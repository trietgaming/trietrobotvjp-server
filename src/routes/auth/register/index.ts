import { FastifyPluginCallback } from "fastify";
import postHandler from "./post/handler";
import postSchema from "./post/schema";

export default (async (fastify) => {
  fastify.post("/", { schema: postSchema }, postHandler);
}) as FastifyPluginCallback;
