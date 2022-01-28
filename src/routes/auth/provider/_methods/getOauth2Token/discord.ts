import { Oauth2AccessTokenResponse } from "../../../../../interfaces/index";
import fetch from "cross-fetch";

export default (code: string, redirect_uri: string) =>
  fetch("https://discord.com/api/oauth2/token", {
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
  }).then((res) => res.json() as Promise<Oauth2AccessTokenResponse>);
