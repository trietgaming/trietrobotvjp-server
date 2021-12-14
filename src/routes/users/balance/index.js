import { Router } from "express";
import UserData from "../../../database/schemas/UserData.js";

const balanceRouter = new Router();

balanceRouter.get("/:userId", async (req, res, next) => {
  const userId = req.params.userId;
  res.json(await UserData.find());
});

export default balanceRouter;
