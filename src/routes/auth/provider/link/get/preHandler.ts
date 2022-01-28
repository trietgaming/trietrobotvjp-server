import getAppFirebase from "../../../../../appFirebase/getAppFirebase";
import { RouteHandlerMethod, preHandlerAsyncHookHandler } from "fastify";
import { ProviderLinkRequest } from "../../../../../interfaces";

const linkGetPreHandler = (async (req: ProviderLinkRequest) => {
  const idToken = req.query.state;
  const auth = getAppFirebase().auth;

  try {
    req.decodedToken = await auth.verifyIdToken(idToken, true);
    return;
  } catch {
    throw {
      statusCode: 400,
      message: "jwt/invalid",
    };
  }
}) as preHandlerAsyncHookHandler;

export default linkGetPreHandler;
