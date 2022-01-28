import {
  Oauth2TokenPayload,
  FirebaseConvertedUser,
  RawDiscordUserResponse
} from "../../../../../interfaces/index";
import fetch from "cross-fetch";

export default async (oauth2TokenPayload: Oauth2TokenPayload) => {
  const rawDiscordUserResponse = await fetch("https://discord.com/api/users/@me", {
    headers: {
      accept: "application/json",
      authorization: `${oauth2TokenPayload.tokenType} ${oauth2TokenPayload.accessToken}`,
    },
  }).then((res) => res.json() as Promise<RawDiscordUserResponse>);
  const { id, username, avatar, email } = rawDiscordUserResponse;
  return {
    uid: id,
    displayName: username,
    photoURL: avatar
      ? `https://cdn.discordapp.com/avatars/${id}/${avatar}.png?size=128`
      : undefined,
    email: email,
  } as FirebaseConvertedUser;
};
