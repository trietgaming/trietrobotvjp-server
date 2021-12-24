import { Router } from "express";
import getAppFirebase from "../../firebase/getAppFirebase.js";
import Account from "../../database/models/Account.js";
import "dotenv/config";
import createNewAccount from "../../database/methods/accounts/createNewAccount.js";

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
  try {
    await auth.getUserByEmail(email);
    return next({
      statusCode: 400,
      code: "auth/email-already-exists",
      message: "Email da ton tai",
    });
  } catch {
    try {
      const user = await createNewAccount({
        firebase: {
          email,
          password,
          displayName,
        },
      });
      const token = await auth.createCustomToken(user.uid);
      return res.json({ ok: true, token });
    } catch (err) {
      console.log(err);
      next({ statusCode: 500, ...err });
    }
  }
});

registerRouter.use((err, req, res, next) => {
  console.log("in register error");
  console.log(err);
  res.status(err.statusCode).json(err);
});

export default registerRouter;
