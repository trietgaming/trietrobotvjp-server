import { Oauth2AccessTokenResponse } from "../../../../../interfaces/index";
import fetch from "cross-fetch";

export default (code: string, redirect_uri: string) =>
  fetch(
    `https://graph.facebook.com/v12.0/oauth/access_token?client_id=${process.env.FACEBOOK_CLIENT_ID}&redirect_uri=${redirect_uri}&client_secret=${process.env.FACEBOOK_CLIENT_SECRET}&code=${code}`
  ).then((res) => res.json() as Promise<Oauth2AccessTokenResponse>);
