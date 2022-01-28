import { FastifyPluginCallback } from "fastify";
import verifyPostHandler from "./verify/post/handler";
import verifyPostSchema from "./verify/post/schema";
import withCodeRouters from "./_withCodeRouters";

const providerRouter: FastifyPluginCallback = async (fastify) => {
  fastify.post("/verify", { schema: verifyPostSchema }, verifyPostHandler);
  fastify.register(withCodeRouters);
};

export default providerRouter;
