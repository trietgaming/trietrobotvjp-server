import { RouteHandlerMethod } from "fastify";
import db from "../../../../db";
import { UidAuthRequest } from "src/interfaces";

export default (async (req: UidAuthRequest) => {
  const uid = req.params!.uid;
  let queryFieldsString = "";
  for (const field of (req.query as { fields: string[] })?.fields) {
    switch (field) {
      case "isInventoryPublic":
        queryFieldsString += "is_inventory_public,";
        break;
      case "isTradable":
        queryFieldsString += "is_tradable,";
        break;
      case "isBalancePublic":
        queryFieldsString += "is_balance_public,";
        break;
      case "bannerId":
        queryFieldsString += "banner_id,";
        break;
      case "wallet":
        queryFieldsString += "wallet,";
        break;
      case "bank":
        queryFieldsString += "bank,";
        break;
      case "bankLimit":
        queryFieldsString += "bank_limit,";
        break;
      case "level":
        queryFieldsString += "level,";
        break;
    }
  }

  if (!queryFieldsString) {
    throw "Invalid Query";
  }

  queryFieldsString = queryFieldsString.replace(/,$/, "");

  let result = await db.query(
    `
        SELECT 
          ${queryFieldsString}
        FROM accounts WHERE id = $1
        `,
    [uid]
  );

  if (!result.rows || !result.rows[0])
    result = await db.query(
      `
      INSERT INTO accounts (id) VALUES ($1) 
      RETURNING ${queryFieldsString}
      `,
      [uid]
    );

  return { ok: true, data: result.rows[0] };
}) as RouteHandlerMethod;
