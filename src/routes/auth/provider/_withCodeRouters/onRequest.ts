import { Oauth2CallbackRequest } from "./../../../../interfaces/index";
import { onRequestAsyncHookHandler } from "fastify";

const checkAndThrowError = (async (req: Oauth2CallbackRequest) => {
  const error = req.query.error;
  if (error) throw { code: error };
}) as onRequestAsyncHookHandler;

export default checkAndThrowError;
