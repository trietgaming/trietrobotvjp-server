import { Router } from "express";
import accountRouter from "./account";

const userRouter = Router();

userRouter.use("/account", accountRouter);

export default userRouter;
