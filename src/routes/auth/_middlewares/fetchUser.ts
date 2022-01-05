import fetch from "cross-fetch";
import { NextFunction, Response } from "express";
import { FetchedOauthUserRequest, RawDiscordUserResponse, RawFacebookUserResponse } from "@interfaces";

export default async (
  req: FetchedOauthUserRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.accessToken || !req.tokenType || !req.oauthProvider)
    return next("something went wrong");

  req.firebaseUserProvider =
    req.oauthProvider === "discord" ? "twitter.com" : "facebook.com";

  try {
    let userResult;
    switch (req.oauthProvider) {
      case "discord":
        userResult = await fetch("https://discord.com/api/users/@me", {
          headers: {
            accept: "application/json",
            authorization: `${req.tokenType} ${req.accessToken}`,
          },
        }).then((res) => res.json() as Promise<RawDiscordUserResponse>);
        req.oauthUser = {
          uid: userResult.id,
          displayName: userResult.username,
          photoURL: userResult.avatar
            ? `https://cdn.discordapp.com/avatars/${userResult.id}/${userResult.avatar}.png?size=128`
            : undefined,
          email: userResult.email,
        };
        break;
      case "facebook":
        userResult = await fetch(
          `https://graph.facebook.com/me?fields=email,name,id,picture&access_token=${req.accessToken}&token_type=${req.tokenType}`
        ).then((res) => res.json() as Promise<RawFacebookUserResponse>);
        console.log(userResult);
        req.oauthUser = {
          uid: userResult.id,
          displayName: userResult.name,
          photoURL: userResult.picture.data.url,
          email: userResult.email,
        };
        break;
      default:
        return next({ statusCode: 500 });
    }

    next();
  } catch (err) {
    next(err);
  }
};
