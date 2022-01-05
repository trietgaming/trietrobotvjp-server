import getAppFirebase from "@appFirebase/getAppFirebase";
import { Response, NextFunction } from "express";
import { FetchedOauthUserRequest } from "@interfaces";

export default async (
  req: FetchedOauthUserRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.decodedToken || !req.oauthUser)
    return next({
      statusCode: 500,
      redirectUrl: `${process.env.CLIENT_DOMAIN}/account`,
    });
  try {
    await getAppFirebase().auth.updateUser(req.decodedToken.user_id, {
      providerToLink: {
        providerId: req.firebaseUserProvider,
        ...req.oauthUser,
      },
    });
    res.redirect(`${process.env.CLIENT_DOMAIN}/account?ok=linking/ok`);
  } catch (err) {
    console.log(err);
    next({
      redirectUrl: `${process.env.CLIENT_DOMAIN}/account`,
      code: "auth/credential-already-in-use",
    });
  }
};
