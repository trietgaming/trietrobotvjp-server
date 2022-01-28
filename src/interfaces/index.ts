import { FastifyRequest } from "fastify";
import { DecodedIdToken } from "firebase-admin/auth";
import { AvailableProviders } from "../types";

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

export interface Oauth2TokenPayload {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  refreshToken?: string;
  scope?: string;
  oauth2Provider: AvailableProviders;
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

export interface FirebaseConvertedUser {
  uid: string;
  displayName: string;
  photoURL?: string;
  email?: string;
}

export interface ProviderLinkRequest extends Oauth2CallbackRequest {
  decodedToken?: DecodedIdToken;
  query: { code?: string; error?: string; state: string };
}

export interface EmailAndPasswordVerifyResult {
  kind: "identitytoolkit#VerifyPasswordResponse";
  localId: string;
  email: string;
  displayName: string;
  idToken: string;
  registered: boolean;
}

export interface UidAuthRequest extends FastifyRequest {
  params: { uid?: string };
}

export interface Oauth2CallbackRequest extends FastifyRequest {
  params: { provider: AvailableProviders };
  query: { code?: string; error?: string };
}

export interface ConflictProviderRegisterJwtTokenPayload {
  email: string;
  id: string;
  conflict: true;
  displayName: string;
  provider: AvailableProviders;
}
