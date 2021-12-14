import { Router } from "express";
import getAppFirebase from "../../firebase/getAppFirebase.js";
import Account from "../../database/models/Account.js";
import UserData from "../../database/models/UserData.js";

const registerRouter = Router();

registerRouter.post("/", async (req, res, next) => {
  const { email, password, displayName } = req.body;
  if (!email || !password || !displayName)
    return next({
      statusCode: 400,
      code: "auth/invalidBody",
      message: "Yêu cầu không hợp lệ",
    });
  const { auth } = getAppFirebase();
  const currentUserUid = await Account.estimatedDocumentCount();
  try {
    await auth.getUserByEmail(email);
    return next({
      statusCode: 400,
      code: "auth/email-already-exists",
      message: "Email da ton tai",
    });
  } catch {
    try {
      const newAccount = new Account({
        _id: currentUserUid,
      });
      console.log("new Account:");
      console.log(newAccount);
      const user = await auth.createUser({
        uid: currentUserUid.toString(),
        email,
        password,
        displayName,
      });
      await newAccount.save();
      console.log(user);
      console.log();
      const token = await auth.createCustomToken(user.uid);
      res.json({ ok: true, token });
    } catch (err) {      
      next({
        statusCode: 400,
        code: err?.code,
      });
      console.log(err);
    }
  }
});

registerRouter.use((err, req, res, next) => {
  console.log("in register error");
  console.log(err);
  res.status(err.statusCode).json(err);
});

export default registerRouter;
