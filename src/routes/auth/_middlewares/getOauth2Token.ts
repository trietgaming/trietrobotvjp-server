import fetch from "cross-fetch";
import {
  FetchedOauth2AccessTokenRequest,
  Oauth2AccessTokenResponse,
} from "@interfaces";
import { Response, NextFunction } from "express";
import { URLSearchParams } from "url";

export default ({
  redirect_uri,
  redirectWhenFailUrl,
  provider,
}: {
  redirect_uri: string;
  redirectWhenFailUrl: string;
  provider: "facebook" | "discord";
}) => {
  return async (
    req: FetchedOauth2AccessTokenRequest,
    res: Response,
    next: NextFunction
  ) => {
    const { code, error } = req.query;
    if (error)
      return res.redirect(`${process.env.CLIENT_DOMAIN}/login?error=${error}`);

    console.log("code", code);

    if (!code)
      return next({
        statusCode: 400,
        code: "auth/discord/noAuthCodeProvided",
        message: "Không có mã xác thực đăng nhập!",
      });

    try {
      let response;

      switch (provider) {
        case "discord":
          response = await fetch("https://discord.com/api/oauth2/token", {
            method: "POST",
            body: new URLSearchParams({
              client_id: process.env.CLIENT_ID,
              client_secret: process.env.CLIENT_SECRET,
              code: code,
              grant_type: "authorization_code",
              redirect_uri,
              scope: "identify email",
            } as any),
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          });
          break;
        case "facebook":
          response = await fetch(
            `https://graph.facebook.com/v12.0/oauth/access_token?client_id=${process.env.FACEBOOK_CLIENT_ID}&redirect_uri=${redirect_uri}&client_secret=${process.env.FACEBOOK_CLIENT_SECRET}&code=${code}`
          );
          break;
        default:
          return next({
            statusCode: 500,
            redirectUrl: redirectWhenFailUrl,
          });
      }

      const oauth2Result = (await response.json()) as Oauth2AccessTokenResponse;

      const { access_token: accessToken, token_type: tokenType } = oauth2Result;
      console.log(accessToken);
      console.log(oauth2Result);
      if (!accessToken)
        return next({
          statusCode: 400,
          code: "jwt/invalid",
          redirectUrl: redirectWhenFailUrl,
        });

      req.accessToken = accessToken;
      req.tokenType = tokenType;
      req.oauthProvider = provider;
      next();
    } catch (error) {
      // NOTE: An unauthorized token will not throw an error;
      // it will return a 401 Unauthorized response in the try block above
      next({ error, redirectUrl: redirectWhenFailUrl });
    }
  };
};
