import { FastifySchema } from "fastify";
import S from "fluent-json-schema";
import base200Response from "../../../../../schemas/base200Response";
import { availableProvidersAsSStringArray } from "../../_availableProviders";

const verifyPostSchema: FastifySchema = {
  body: S.object()
    .prop("password", S.string())
    .prop("jwtToken", S.string().required()),
  response: {
    "200": S.object()
      .prop(
        "payload",
        S.object()
          .prop("email", S.string())
          .prop("id", S.string())
          .prop(
            "provider",
            S.string()
            .oneOf([...availableProvidersAsSStringArray])
          )
          .prop("conflict", S.boolean().const(true))
          .prop("displayName", S.string())
      )
      .prop("token", S.string())
      .extend(base200Response),
  },
};

export default verifyPostSchema;
