import { FastifySchema } from "fastify";
import S from "fluent-json-schema";
import baseParamsSchema from "../../_base-schemas/params";
import baseQuerystringSchema from "../../_base-schemas/querystring";

const linkGetSchema = {
  querystring: S.object()
    .prop("state", S.string().required())
    .extend(baseQuerystringSchema),
  params: baseParamsSchema,
  response: {
    "302": S.object().prop(
      "headers",
      S.object().prop("location", S.string().required())
    ),
  },
} as FastifySchema;

export default linkGetSchema;
