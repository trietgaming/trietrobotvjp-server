import { FastifySchema } from 'fastify';
import S from "fluent-json-schema";
import base200Response from "../../../../schemas/base200Response";
import baseAuthHeaders from "../../../../schemas/baseAuthHeaders";

export default {
  headers: baseAuthHeaders,
  querystring: S.object().prop("fields", S.array().items(S.string())),
  response: {
    "200": S.object()
      .prop(
        "data",
        S.object()
          .additionalProperties(false)
          .prop("is_tradable", S.boolean())
          .prop("is_inventory_public", S.boolean())
          .prop("is_balance_public", S.boolean())
          .prop("wallet", S.string())
          .prop("bank", S.string())
          .prop("bank_limit", S.string())
          .prop("level", S.number())
          .prop("banner_id", S.number())
      )
      .extend(base200Response),
  },
} as FastifySchema;
