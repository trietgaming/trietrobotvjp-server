import { FastifyPluginCallback } from "fastify";
import rootGetHandler from "../root/get/handler";
import rootGetSchema from "../root/get/schema";
import linkGetPreHandler from "../link/get/preHandler";
import linkGetHandler from "../link/get/handler";
import checkAndThrowError from "./onRequest";
import withCodeRoutersErrorHandler from "./errorHandler";
import linkGetSchema from "../link/get/schema";

const withCodeRouters = (async (fastify) => {
  fastify.decorateRequest("decodedToken", null);
  fastify.addHook("onRequest", checkAndThrowError);
  fastify.setErrorHandler(withCodeRoutersErrorHandler);
  fastify.get(
    "/link",
    {
      preHandler: linkGetPreHandler,
      schema: linkGetSchema,
    },
    linkGetHandler
  );
  fastify.get(
    "/",
    {
      schema: rootGetSchema,
    },
    rootGetHandler
  );
}) as FastifyPluginCallback;

export default withCodeRouters;
