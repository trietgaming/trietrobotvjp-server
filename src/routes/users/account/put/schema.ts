import { FastifySchema } from "fastify";
import S from "fluent-json-schema";
import base200Response from "../../../../schemas/base200Response";
import baseAuthHeaders from "../../../../schemas/baseAuthHeaders";

export default {
  headers: baseAuthHeaders,
  body: S.object().prop(
    "values",
    S.object()
      .prop("isTradable", S.boolean().required())
      .prop("isInventoryPublic", S.boolean().required())
      .prop("isBalancePublic", S.boolean().required())
  ),
  response: {
    "200": S.object()
      .prop(
        "data",
        S.object()
          .prop("is_tradable", S.boolean())
          .prop("is_inventory_public", S.boolean())
          .prop("is_balance_public", S.boolean())
      )
      .extend(base200Response),
  },
} as FastifySchema;
