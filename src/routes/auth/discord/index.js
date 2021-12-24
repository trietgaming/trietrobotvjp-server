import "dotenv/config";
import fetch from "node-fetch";
import { Router } from "express";
import jwt from "jsonwebtoken";
import getOauth2Token from "./getOauth2Token.js";
import fetchUser from "./fetchUser.js";
import Account from "../../../database/models/Account.js";
import getAppFirebase from "../../../firebase/getAppFirebase.js";
import createNewAccount from "../../../database/methods/accounts/createNewAccount.js";

const router = Router();

process.env.PRIVATE_KEY = process.env.PRIVATE_KEY.replace(/\\n/g, "\n");

router.get(
  "/",
  getOauth2Token({
    redirect_uri: process.env.DISCORD_REDIRECT_URI,
    scope: "identify email",
    redirectWhenFailUrl: `${process.env.CLIENT_DOMAIN}/login`,
  }),
  fetchUser,
  async (req, res, next) => {
    if (!req.discordUser)
      return next({
        redirectUrl: `${process.env.CLIENT_DOMAIN}/register`,
        message: "Error when fetch user",
      });
    try {
      const { email, id: discord_id } = req.discordUser;
      if (!email || !discord_id)
        throw new Error("Can't get email or discord id");
      const existsUser = await Account.findOne({ did: discord_id });
      console.log(existsUser);
      const { auth } = getAppFirebase();

      if (existsUser) {
        const token = await auth.createCustomToken(existsUser._id.toString());
        return res.redirect(
          `${process.env.CLIENT_DOMAIN}/login/custom?token=${token}`
        );
      }
      try {
        await auth.getUserByEmail(email);
        const jwtToken = jwt.sign(
          { email, discord_id, provider: "discord", conflict: true },
          process.env.PRIVATE_KEY,
          {
            expiresIn: 300,
          }
        );

        return res.redirect(
          `${process.env.CLIENT_DOMAIN}/register/social?token=${jwtToken}`
        );
      } catch (err) {
        console.log(err);
        try {
          const newUser = await createNewAccount({
            account: { discordId: discord_id },
            firebase: {
              email,
              displayName: req.discordUser.username,
            },
          });
          const token = await auth.createCustomToken(newUser.uid.toString());
          return res.redirect(
            `${process.env.CLIENT_DOMAIN}/login/custom?token=${token}`
          );
        } catch (err) {
          console.log(err);
          next({
            statusCode: 500,
            redirectUrl: `${process.env.CLIENT_DOMAIN}/register`,
          });
        }
      }
    } catch (err) {
      console.log(err);
      next({
        statusCode: 500,
        error: err,
        redirectUrl: `${process.env.CLIENT_DOMAIN}/register`,
      });
    }
  }
);

router.post("/verify", async (req, res, next) => {
  const { password, jwtToken } = req.body;
  if (!jwtToken) return next({ statusCode: 400, code: "jwt/empty" });
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

router.get(
  "/link",
  async (req, res, next) => {
    const idToken = req.query.state;
    if (!idToken)
      return next({
        statusCode: 400,
        message: "No id Token provided",
      });
    const auth = getAppFirebase().auth;

    try {
      req.decodedToken = await auth.verifyIdToken(idToken, true);
      next();
    } catch (err) {
      return next({
        statusCode: 400,
        message: "jwt/invalidToken",
      });
    }
  },
  getOauth2Token({
    redirect_uri: process.env.DISCORD_LINKING_REDIRECT_URI,
    scope: "identify",
    redirectWhenFailUrl: `${process.env.CLIENT_DOMAIN}/account`,
  }),
  fetchUser,
  async (req, res, next) => {
    if (!req.decodedToken || !req.discordUser)
      return next({
        statusCode: 500,
        redirectUrl: `${process.env.CLIENT_DOMAIN}/account`,
      });
    try {
      await Account.findByIdAndUpdate(req.decodedToken.user_id, {
        did: req.discordUser.id,
      });
      res.redirect(`${process.env.CLIENT_DOMAIN}/account?ok=linking/ok`);
    } catch (err) {
      console.log(err);
      next({
        redirectUrl: `${process.env.CLIENT_DOMAIN}/account`,
        code: "auth/credential-already-in-use",
      });
    }
  }
);

router.delete("/link", async (req, res, next) => {
  if (!req.headers.token)
    return next({ statusCode: 400, message: "no Id Token provided" });
  const auth = getAppFirebase().auth;
  try {
    const decodedToken = await auth.verifyIdToken(req.headers.token, true);
    const uid = decodedToken.user_id;

    try {
      const userAccount = await Account.findByIdAndUpdate(
        uid,
        { did: null },
        {
          new: true,
        }
      );
      res.json({
        ok: true,
        account: {
          discord_id: userAccount.did,
          facebook_id: userAccount.fid,
          public_inventory: userAccount.pinv,
          public_balance: userAccount.pbal,
          tradeable: userAccount.trd,
        },
      });
    } catch (err) {
      next({ statusCode: 400, message: "user not linked" });
    }
  } catch (err) {
    next({ statusCode: 400, ...err });
  }
});

router.use((err, req, res, next) => {
  console.log("in error");
  console.log(err);
  err.redirectUrl
    ? res.redirect(`${err.redirectUrl}?error=${err.code || "unexpected"}`)
    : res.status(err.statusCode).json(err);
});

export default router;
