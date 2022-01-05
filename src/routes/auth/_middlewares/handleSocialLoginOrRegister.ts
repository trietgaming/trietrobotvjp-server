import { Response, NextFunction } from "express";
import getAppFirebase from "@appFirebase/getAppFirebase";
import jwt from "jsonwebtoken";
import createNewAccount from "@db/methods/accounts/createNewAccount";
import { FetchedOauthUserRequest } from "@interfaces";

export default async (
  req: FetchedOauthUserRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.oauthUser || !req.firebaseUserProvider)
    return next({
      redirectUrl: `${process.env.CLIENT_DOMAIN}/register`,
      message: "Error when fetch user",
    });
  if (req.oauthProvider === "facebook" && !req.oauthUser.email)
    //request for email
    return res.redirect(
      `https://www.facebook.com/v12.0/dialog/oauth?client_id=${
        process.env.FACEBOOK_CLIENT_ID
      }&redirect_uri=${encodeURIComponent(
        process.env.DOMAIN + "/auth/facebook"
      )}&auth_type=rerequest&scope=email`
    );

  const auth = getAppFirebase().auth;
  console.log(req.oauthUser);
  try {
    const existsUser = await auth.getUserByProviderUid(
      req.firebaseUserProvider,
      req.oauthUser.uid
    );
    if (existsUser) {
      return res.redirect(
        `${
          process.env.CLIENT_DOMAIN
        }/login/custom?token=${await auth.createCustomToken(existsUser.uid)}`
      );
    }
  } catch (err: any) {
    if (err!.code !== "auth/user-not-found")
      return next({
        statusCode: 500,
        ...err?.errorInfo,
        redirectUrl: `${process.env.CLIENT_DOMAIN}/register`,
      });

    try {
      await auth.getUserByEmail(req.oauthUser.email as string);
      const jwtToken = jwt.sign(
        {
          email: req.oauthUser.email,
          [`${req.oauthProvider}_id`]: req.oauthUser.uid,
          conflict: true,
          displayName: req.oauthUser.displayName,
          provider: req.oauthProvider,
        },
        process.env.PRIVATE_KEY as string,
        {
          expiresIn: 300,
        }
      );

      return res.redirect(
        `${process.env.CLIENT_DOMAIN}/register/social?token=${jwtToken}`
      );
    } catch (err: any) {
      if (err?.code !== "auth/user-not-found")
        return next({
          statusCode: 500,
          redirectUrl: `${process.env.CLIENT_DOMAIN}/register`,
          ...err?.errorInfo,
        });

      try {
        const newUser = await createNewAccount({
          ...req.oauthUser,
          providerToLink: {
            providerId: req.firebaseUserProvider,
            ...req.oauthUser,
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
          error: err,
          redirectUrl: `${process.env.CLIENT_DOMAIN}/register`,
        });
      }
    }
  }
};
