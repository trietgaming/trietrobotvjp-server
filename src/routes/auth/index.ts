import { FastifyPluginCallback } from "fastify";
import registerRouter from "./register";
import providerRouter from "./provider";

export default (async (fastify) => {
  fastify.register(registerRouter, { prefix: "/register" });
  fastify.register(providerRouter, { prefix: "/provider/:provider" });
}) as FastifyPluginCallback;
