import { FastifyPluginCallback, FastifySchema } from "fastify";
import S from "fluent-json-schema";
import preHandler from "./preHandler";
import getHandler from "./get/handler";
import getSchema from "./get/schema";
import putHandler from "./put/handler";
import putSchema from "./put/schema";

export default (async (fastify) => {
  fastify.addHook("preHandler", preHandler);
  fastify.get("/", { schema: getSchema }, getHandler);
  fastify.put("/", { schema: putSchema }, putHandler);
}) as FastifyPluginCallback;
