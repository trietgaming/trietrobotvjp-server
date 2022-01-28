import { RouteHandlerMethod } from "fastify";
import db from "../../../../db";
import { UidAuthRequest } from "../../../../interfaces";

export default (async (req: UidAuthRequest) => {
  const { isTradable, isInventoryPublic, isBalancePublic } = (
    req.body as { values: object }
  ).values as {
    isTradable: boolean;
    isInventoryPublic: boolean;
    isBalancePublic: boolean;
  };
  const queryResult = await db.query(
    `
      UPDATE accounts 
      SET 
        is_balance_public = $2, 
        is_inventory_public = $3, 
        is_tradable = $4 
      WHERE id = $1
      RETURNING 
        is_inventory_public, 
        is_tradable, 
        is_balance_public
    `,
    [req.params!.uid, !!isBalancePublic, !!isInventoryPublic, !!isTradable]
  );
  if (!queryResult.rows[0]) throw "unexpected";
  return { ok: true, data: queryResult.rows[0] };
}) as RouteHandlerMethod;
