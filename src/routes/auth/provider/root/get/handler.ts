import { ConflictProviderRegisterJwtTokenPayload } from "./../../../../../interfaces/index";
import getAppFirebase from "../../../../../appFirebase/getAppFirebase";
import jwt from "jsonwebtoken";
import createNewAccount from "../../../../../db/methods/accounts/createNewAccount";
import convertOauth2ProviderToFirebaseProvider from "../../../../../appFirebase/convertOauth2ProviderToFirebaseProvider";
import { AvailableProviders } from "./../../../../../types/index";
import { RouteHandlerMethod, FastifyRequest } from "fastify";
import { Oauth2CallbackRequest } from "../../../../../interfaces";
import getOauth2Token from "../../_methods/getOauth2Token";
import fetchUser from "../../_methods/fetchUser";

const redirectUris = {
  facebook: process.env.BASE_FACEBOOK_REDIRECT_URI as string,
  discord: process.env.BASE_DISCORD_REDIRECT_URI as string,
};

const rootGetHandler = (async (req: Oauth2CallbackRequest, reply) => {
  const provider = req.params.provider;
  const firebaseConvertedProvider =
    convertOauth2ProviderToFirebaseProvider(provider);
  const oauth2tokenPayload = await getOauth2Token({
    code: req.query.code as string,
    redirectUri: redirectUris[provider],
    provider,
  });
  const firebaseConvertedUser = await fetchUser(oauth2tokenPayload);
  if (provider === "facebook" && !firebaseConvertedUser.email)
    //request for email (facebook provider only)
    return reply.redirect(
      `https://www.facebook.com/v12.0/dialog/oauth?client_id=${
        process.env.FACEBOOK_CLIENT_ID
      }&redirect_uri=${encodeURIComponent(
        process.env.BASE_FACEBOOK_REDIRECT_URI as string
      )}&auth_type=rerequest&scope=email`
    );

  const auth = getAppFirebase().auth;
  try {
    const existsUser = await auth.getUserByProviderUid(
      firebaseConvertedProvider,
      firebaseConvertedUser.uid
    );
    if (existsUser) {
      return reply.redirect(
        `${
          process.env.CLIENT_DOMAIN
        }/login/custom?token=${await auth.createCustomToken(existsUser.uid)}`
      );
    }
  } catch (err: any) {
    if (err!.code !== "auth/user-not-found")
      throw {
        statusCode: 500,
        ...err?.errorInfo,
      };

    try {
      await auth.getUserByEmail(firebaseConvertedUser.email as string);
      const jwtToken = jwt.sign(
        {
          email: firebaseConvertedUser.email,
          id: firebaseConvertedUser.uid,
          conflict: true,
          displayName: firebaseConvertedUser.displayName,
          provider: provider,
        } as ConflictProviderRegisterJwtTokenPayload,
        process.env.PRIVATE_KEY as string,
        {
          expiresIn: 300,
        }
      );

      return reply.redirect(
        `${process.env.CLIENT_DOMAIN}/register/social?token=${jwtToken}`
      );
    } catch (err: any) {
      if (err?.code !== "auth/user-not-found")
        throw {
          statusCode: 500,
          ...err?.errorInfo,
        };

      const newUser = await createNewAccount({
        ...firebaseConvertedUser,
        providerToLink: {
          providerId: firebaseConvertedProvider,
          ...firebaseConvertedUser,
        },
      });
      const token = await auth.createCustomToken(newUser.uid.toString());
      return reply.redirect(
        `${process.env.CLIENT_DOMAIN}/login/custom?token=${token}`
      );
    }
  }
}) as RouteHandlerMethod;

export default rootGetHandler;
