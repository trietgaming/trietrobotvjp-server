import { FastifyPluginCallback } from "fastify";
import accountRouter from "./account";

export default (async (fastify) => {
  fastify.register(accountRouter, { prefix: "/account" });
}) as FastifyPluginCallback;
