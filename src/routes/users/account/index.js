import { Router } from "express";
import getAppFirebase from "../../../firebase/getAppFirebase.js";
import Account from "../../../database/models/Account.js";

const accountRouter = Router();

accountRouter.post("/", async (req, res, next) => {
  const { id_token: userIdToken } = req.body;
  if (!userIdToken)
    return next({
      statusCode: 400,
      message: "No Token provied",
    });
  const { auth } = getAppFirebase();
  try {
    const decodedToken = await auth.verifyIdToken(userIdToken);
    if (!decodedToken) throw "invalid id";

    const uid = decodedToken.user_id;
    const userAccount = await Account.findById(uid);
    console.log(userAccount);
    return res.json({
      discord_id: userAccount.did,
      facebook_id: userAccount.fid,
      public_inventory: userAccount.pinv,
      public_balance: userAccount.pbal,
      tradeable: userAccount.trd,
    });
  } catch (err) {
    console.log(err);
    next({
      statusCode: 400,
      message: "invalid ID",
    });
  }
});

accountRouter.use((err, req, res, next) => {
  console.log("in error");
  res.status(err.statusCode).json(err);
});

export default accountRouter;
