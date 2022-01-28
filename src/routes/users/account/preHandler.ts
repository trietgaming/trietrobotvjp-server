import getAppFirebase from "../../../appFirebase/getAppFirebase";
import { FastifyInstance, preHandlerAsyncHookHandler } from "fastify";
import { UidAuthRequest } from "src/interfaces";

export default (async (req: UidAuthRequest, reply) => {
  console.log("AUTH CHECK BRO");
  const { authorization: userIdToken } = req.headers;
  const reqUid = req.params!.uid as string;
  console.log(req.params);
  const { auth } = getAppFirebase();
  try {
    const decodedToken = await auth.verifyIdToken(userIdToken as string); //validated on schema
    console.log(decodedToken);
    if (
      !decodedToken ||
      !decodedToken.email_verified ||
      !decodedToken.uid ||
      decodedToken.uid !== reqUid
    )
      throw "invalid id";
  } catch (err) {
    console.log(err);
    throw "invalid ID";
  }
}) as preHandlerAsyncHookHandler;
