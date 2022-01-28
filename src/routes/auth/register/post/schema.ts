import { FastifySchema } from "fastify";
import S from "fluent-json-schema";
import base200Response from "../../../../schemas/base200Response";

export default {
  body: S.object()
    .prop("email", S.string().required())
    .prop("password", S.string().required())
    .prop("displayName", S.string().required()),
  response: {
    "200": S.object()
      .prop("token", S.string().required())
      .extend(base200Response),
  },
} as FastifySchema;
