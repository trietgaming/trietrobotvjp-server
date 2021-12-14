import "dotenv/config";
import fetch from "node-fetch";
import { Router } from "express";
import jwt from "jsonwebtoken";
import getOauth2Token from "./getOauth2Token.js";
import fetchUser from "./fetchUser.js";
import Account from "../../../database/models/Account.js";
import getAppFirebase from "../../../firebase/getAppFirebase.js";

const router = Router();

process.env.PRIVATE_KEY = process.env.PRIVATE_KEY.replace(/\\n/g, "\n");

router.get("/", getOauth2Token, fetchUser, async (req, res, next) => {
  if (!req.discordUser) return next("Error when fetch user");
  try {
    const { email, id: discord_id } = req.discordUser;
    if (!email || !discord_id) throw new Error("Can't get email or discord id");
    const existsUser = await Account.findOne({ did: discord_id });
    console.log(existsUser);
    const { auth } = getAppFirebase();

    if (existsUser) {
      const token = await auth.createCustomToken(existsUser._id.toString());
      return res.redirect(
        `${process.env.CLIENT_DOMAIN}/login/social?token=${token}`
      );
    }
    let jwtToken;
    try {
      const userWithSameEmail = await auth.getUserByEmail(email);
      if (!userWithSameEmail) throw new Error("User not found");
      jwtToken = jwt.sign(
        { email, discord_id, provider: "discord", conflict: true },
        process.env.PRIVATE_KEY,
        {
          expiresIn: 300,
        }
      );
    } catch (err) {
      console.log(err);
      jwtToken = jwt.sign(
        { email, discord_id, provider: "discord" },
        process.env.PRIVATE_KEY,
        {
          expiresIn: 300,
        }
      );
    }

    return res.redirect(
      `${process.env.CLIENT_DOMAIN}/register/social?token=${jwtToken}`
    );
  } catch (err) {
    next({ statusCode: 500, error: err });
  }
});

router.post("/verify", async (req, res, next) => {
  const { password, jwtToken } = req.body;
  if (!jwtToken) return next({ statusCode: 400, code: "jst/empty" });
  try {
    const payload = jwt.verify(jwtToken, process.env.PRIVATE_KEY);
    console.log(payload);
    if (password) {
      const { auth } = getAppFirebase();
      const { email, discord_id } = payload;
      console.log(email);
      console.log(discord_id);
      try {
        const response = await fetch(
          `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            },
            body: `email=${email}&password=${password}`,
          }
        );
        const result = await response.json();

        if (!result.registered || result.email !== email || !result.idToken)
          return next({ statusCode: 400, code: "auth/wrong-password" });

        const customToken = await auth.createCustomToken(result.localId);
        await Account.findByIdAndUpdate(+result.localId, {
          did: discord_id,
        });

        return res.status(200).json({
          token: customToken,
        });
      } catch (err) {
        console.log(err);
        return next({ statusCode: 400, ...err });
      }
    }
    res.json({ ok: true, payload });
  } catch {
    next({ statusCode: 400, code: "jwt/invalid" });
  }
});

router.use((err, req, res, next) => {
  console.log("in error");
  console.log(err);
  res.status(err.statusCode).json(err);
});

export default router;
