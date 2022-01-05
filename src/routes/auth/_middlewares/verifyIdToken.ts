import getAppFirebase from "@appFirebase/getAppFirebase";
import { AuthRequest } from "@interfaces";
import { NextFunction, Response } from "express";

export default async (req: AuthRequest, res: Response, next: NextFunction) => {
  const idToken = req.query.state;
  if (!idToken || typeof idToken !== "string")
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
      message: "jwt/invalid",
    });
  }
};
