import { RouteHandlerMethod, FastifyRequest } from "fastify";
import getAppFirebase from "../../../../appFirebase/getAppFirebase";
import createNewAccount from "../../../../db/methods/accounts/createNewAccount";

interface AccountRegisterRequest extends FastifyRequest {
  body: {
    email: string;
    password: string;
    displayName: string;
    [anotherUnexpectedKeys: string]: unknown;
  };
}

export default (async (req: AccountRegisterRequest) => {
  const { email, password, displayName } = req.body;
  const { auth } = getAppFirebase();

  const user = await createNewAccount({
    email,
    password,
    displayName,
  });
  const token = await auth.createCustomToken(user.uid);
  return { ok: true, token };
}) as RouteHandlerMethod;
