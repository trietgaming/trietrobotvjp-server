import fetch from "cross-fetch";
import {
  Oauth2AccessTokenResponse,
  Oauth2TokenPayload,
} from "../../../../../interfaces";
import { URLSearchParams } from "url";
import facebookGetOauth2Token from "./facebook";
import discordGetOauth2Token from "./discord";
import { AvailableProviders } from "../../../../../types";

const providerMethods = {
  facebook: facebookGetOauth2Token,
  discord: discordGetOauth2Token,
};

export default async ({
  code,
  provider,
  redirectUri,
}: {
  code: string;
  provider: AvailableProviders;
  redirectUri: string;
}) => {
  const getOauth2Token =
    providerMethods[provider] ||
    ((...params) => {
      throw "invalid Provider";
    });

  const oauth2Result = await getOauth2Token(code, redirectUri);

  const {
    access_token: accessToken,
    token_type: tokenType,
    expires_in: expiresIn,
    refresh_token: refreshToken,
  } = oauth2Result;

  console.log(oauth2Result);
  if (!accessToken)
    throw {
      statusCode: 400,
      code: "jwt/invalid",
    };

  return {
    accessToken,
    tokenType,
    expiresIn,
    refreshToken,
    oauth2Provider: provider,
  } as Oauth2TokenPayload;
};
