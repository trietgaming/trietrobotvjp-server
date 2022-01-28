import {
  Oauth2TokenPayload,
  RawDiscordUserResponse,
  RawFacebookUserResponse,
} from "./../../../../../interfaces/index";
import fetch from "cross-fetch";
import fetchDiscordUser from "./discord";
import fetchFacebookUser from "./facebook";

export default async (oauth2TokenPayload: Oauth2TokenPayload) => {
  switch (oauth2TokenPayload.oauth2Provider) {
    case "discord":
      return await fetchDiscordUser(oauth2TokenPayload);
    case "facebook":
      return await fetchFacebookUser(oauth2TokenPayload);
    default:
      throw "something went wrong";
  }
};
