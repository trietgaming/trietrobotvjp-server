import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import getAppFirebase from "../../../appFirebase/getAppFirebase";
import verifyUserWithEmailAndPassword from "../../../appFirebase/verifyUserWithEmailAndPassword";

export default async (req: Request, res: Response, next: NextFunction) => {
  const { password, jwtToken } = req.body as {
    password: string;
    jwtToken: string;
  };
  if (!jwtToken) return next({ statusCode: 400, code: "jwt/empty" });
  try {
    const payload = jwt.verify(jwtToken, process.env.PRIVATE_KEY as string) as {
      email: string;
      discord_id?: string;
      facebook_id?: string;
      displayName: string;
    };
    console.log(payload);
    if (password) {
      const { auth } = getAppFirebase();
      const { email, discord_id, facebook_id, displayName } = payload;
      console.log(email);
      console.log(discord_id);
      try {
        const result = await verifyUserWithEmailAndPassword(email, password);

        if (!result.registered || result.email !== email || !result.idToken)
          return next({ statusCode: 400, code: "auth/wrong-password" });

        const customToken = await auth.createCustomToken(result.localId);
        await auth.updateUser(result.localId, {
          providerToLink: {
            providerId: facebook_id ? "facebook.com" : "twitter.com",
            uid: facebook_id || discord_id,
            displayName,
          },
        });

        return res.status(200).json({
          token: customToken,
        });
      } catch (err: any) {
        console.log(err);
        return next({ statusCode: 400, ...err, ...err?.errorInfo });
      }
    }
    res.json({ ok: true, payload });
  } catch {
    next({ statusCode: 400, code: "jwt/invalid" });
  }
};
