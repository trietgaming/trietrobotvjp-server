import { Request } from "express";
import { DecodedIdToken } from "firebase-admin/auth";

export interface ClientCallException {
  statusCode: number;
  code: string;
  redirectUrl?: string;
  [another: string]: any;
}

export interface Oauth2AccessTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope?: string;
}

export interface RawDiscordUserResponse {
  id: string;
  bot?: boolean;
  username: string;
  discriminator: string;
  avatar: string;
  verified?: boolean;
  email?: string;
  flags?: number;
  banner?: string;
  accent_color?: number;
  premium_type?: number;
  public_flags?: number;
}

export interface RawFacebookUserResponse {
  id: string;
  name: string;
  email?: string;
  picture: {
    data: {
      height: number;
      is_silhouette: boolean;
      url: string;
      width: number;
    };
  };
  short_name?: string;
  name_format?: string;
  middle_name?: string;
  last_name?: string;
  first_name?: string;
}

export interface UserConverted {
  uid: string;
  displayName: string;
  photoURL?: string;
  email?: string;
}

export interface AuthRequest extends Request {
  decodedToken?: DecodedIdToken;
}

export interface FetchedOauth2AccessTokenRequest extends AuthRequest {
  accessToken?: string;
  tokenType?: string;
  oauthProvider?: string;
}

export interface FetchedOauthUserRequest
  extends FetchedOauth2AccessTokenRequest {
  oauthUser?: UserConverted;
  /**
   * "twitter.com" is "discord"
   */
  firebaseUserProvider?: "twitter.com" | "facebook.com";
}

export interface EmailAndPasswordVerifyResult {
  kind: "identitytoolkit#VerifyPasswordResponse";
  localId: string;
  email: string;
  displayName: string;
  idToken: string;
  registered: boolean;
}
