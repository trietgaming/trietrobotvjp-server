import { Router } from "express";
import getAppFirebase from "@appFirebase/getAppFirebase";
import createNewAccount from "@db/methods/accounts/createNewAccount";

const registerRouter = Router();

registerRouter.post("/", async (req, res, next) => {
  const { email, password, displayName } = req.body as {
    email: string | undefined;
    password: string | undefined;
    displayName: string | undefined;
  };
  if (!email || !password || !displayName)
    return next({
      statusCode: 400,
      code: "auth/invalidBody",
      message: "Yêu cầu không hợp lệ",
    });
  const { auth } = getAppFirebase();

  try {
    const user = await createNewAccount({
      email,
      password,
      displayName,
    });
    const token = await auth.createCustomToken(user.uid);
    return res.json({ ok: true, token });
  } catch (err: any) {
    console.log(err);
    next({ statusCode: 500, ...err, ...err?.errorInfo });
  }
});

export default registerRouter;
