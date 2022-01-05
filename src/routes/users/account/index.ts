import { Router } from "express";
import getAppFirebase from "../../../appFirebase/getAppFirebase";
import db from "../../../db";

const accountRouter = Router();

interface ExpectedBody {
  id_token: string;
}

accountRouter.post("/", async (req, res, next) => {
  const { id_token: userIdToken }: ExpectedBody = req.body;
  if (!userIdToken)
    return next({
      statusCode: 400,
      message: "No Token provied",
    });
  const { auth } = getAppFirebase();
  try {
    const decodedToken = await auth.verifyIdToken(userIdToken);
    if (!decodedToken || !decodedToken.email_verified || !decodedToken.user_id)
      throw "invalid id";
    const uid = decodedToken.user_id;

    let result = await db.query(
      `
        SELECT 
          is_inventory_public, 
          is_tradable, 
          is_balance_public, 
          banner_id, 
          wallet, 
          bank, 
          bank_limit, 
          level,
          (CASE WHEN pin_code IS NULL THEN false ELSE true END) AS has_pin_code
        FROM accounts WHERE id = $1
        `,
      [uid]
    );
    if (!result.rows || !result.rows[0])
      result = await db.query(
        `
      INSERT INTO accounts (id) VALUES ($1) RETURNING 
      is_inventory_public, 
      is_tradable, 
      is_balance_public, 
      banner_id, 
      wallet, 
      bank, 
      bank_limit, 
      level,
      (CASE WHEN pin_code IS NULL THEN false ELSE true END) AS has_pin_code
    `,
        [uid]
      );
    return res.json(result.rows[0]);
  } catch (err) {
    console.log(err);
    next({
      statusCode: 400,
      message: "invalid ID",
    });
  }
});

export default accountRouter;
