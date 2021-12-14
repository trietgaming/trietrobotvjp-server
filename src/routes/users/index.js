import { Router } from "express";
import balanceRouter from "./balance/index.js";
import accountRouter from "./account/index.js";

const userRouter = new Router();

userRouter.use("/balance", balanceRouter);
userRouter.use("/account", accountRouter);

export default userRouter;
