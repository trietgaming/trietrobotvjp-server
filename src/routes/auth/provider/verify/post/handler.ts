import { RouteHandlerMethod } from "fastify";
import jwt from "jsonwebtoken";
import getAppFirebase from "../../../../../appFirebase/getAppFirebase";
import verifyUserWithEmailAndPassword from "../../../../../appFirebase/verifyUserWithEmailAndPassword";
import { ConflictProviderRegisterJwtTokenPayload } from "./../../../../../interfaces/index";
import convertOauth2ProviderToFirebaseProvider from "../../../../../appFirebase/convertOauth2ProviderToFirebaseProvider";

const verifyPostHandler: RouteHandlerMethod = async (req, reply) => {
  const { password, jwtToken } = req.body as {
    password: string;
    jwtToken: string;
  };
  if (!jwtToken) throw { statusCode: 400, code: "jwt/empty" };
  const payload = jwt.verify(
    jwtToken,
    process.env.PRIVATE_KEY as string
  ) as ConflictProviderRegisterJwtTokenPayload;
  console.log(payload);
  if (password) {
    const { auth } = getAppFirebase();
    const { email, id, displayName, provider } = payload;
    console.log(email);
    try {
      const result = await verifyUserWithEmailAndPassword(email, password);

      if (!result.registered || result.email !== email || !result.idToken)
        throw { statusCode: 400, code: "auth/wrong-password" };

      await auth.updateUser(result.localId, {
        providerToLink: {
          providerId: convertOauth2ProviderToFirebaseProvider(provider),
          uid: id,
          displayName,
        },
      });

      const customToken = await auth.createCustomToken(result.localId);

      return {
        ok: true,
        token: customToken,
      };
    } catch (err: any) {
      console.log(err);
      throw { statusCode: 400, ...err, ...err?.errorInfo };
    }
  }
  return { ok: true, payload };
};

export default verifyPostHandler;
