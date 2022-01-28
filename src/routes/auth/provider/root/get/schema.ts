import { FastifySchema } from "fastify";
import S from "fluent-json-schema";
import baseParamsSchema from "../../_base-schemas/params";
import baseQuerystringSchema from "../../_base-schemas/querystring";

const rootGetSchema: FastifySchema = {
  querystring: baseQuerystringSchema,
  params: baseParamsSchema,
  response: {
    "302": S.object().prop(
      "headers",
      S.object().required().prop("location", S.string().required())
    ),
  },
};

export default rootGetSchema;
