import {
  Oauth2TokenPayload,
  FirebaseConvertedUser,
  RawFacebookUserResponse,
} from "../../../../../interfaces/index";
import fetch from "cross-fetch";

export default async (oauth2TokenPayload: Oauth2TokenPayload) => {
  const rawFacebookUserResponse = await fetch(
    `https://graph.facebook.com/me?fields=email,name,id,picture&access_token=${oauth2TokenPayload.accessToken}&token_type=${oauth2TokenPayload.tokenType}`
  ).then((res) => res.json() as Promise<RawFacebookUserResponse>);
  const { id, name, picture, email } = rawFacebookUserResponse;
  return {
    uid: id,
    displayName: name,
    photoURL: picture.data.url,
    email: email,
  } as FirebaseConvertedUser;
};
