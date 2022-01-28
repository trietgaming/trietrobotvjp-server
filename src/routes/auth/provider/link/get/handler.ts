import { RouteHandlerMethod } from "fastify";
import getAppFirebase from "../../../../../appFirebase/getAppFirebase";
import { ProviderLinkRequest } from "../../../../../interfaces";
import convertOauth2ProviderToFirebaseProvider from "../../../../../appFirebase/convertOauth2ProviderToFirebaseProvider";
import getOauth2Token from "../../_methods/getOauth2Token";
import fetchUser from "../../_methods/fetchUser";

const redirectUris = {
  facebook: process.env.BASE_FACEBOOK_REDIRECT_URI + "/link",
  discord: process.env.BASE_DISCORD_REDIRECT_URI + "/link",
};

const linkGetHandler = (async (req: ProviderLinkRequest, reply) => {
  const provider = req.params.provider;
  const oauth2TokenPayload = await getOauth2Token({
    code: req.query.code as string,
    provider: provider,
    redirectUri: redirectUris[provider],
  });

  const firebaseConvertedUser = await fetchUser(oauth2TokenPayload);

  try {
    await getAppFirebase().auth.updateUser(req!.decodedToken!.user_id, {
      providerToLink: {
        providerId: convertOauth2ProviderToFirebaseProvider(provider),
        ...firebaseConvertedUser,
      },
    });
    reply.redirect(`${process.env.CLIENT_DOMAIN}/account?ok=linking/ok`);
  } catch (err) {
    console.log(err);
    throw {
      code: "auth/credential-already-in-use",
    };
  }
}) as RouteHandlerMethod;

export default linkGetHandler;
