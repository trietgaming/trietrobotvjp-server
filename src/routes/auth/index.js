import { Router } from "express";
import discordRouter from "./discord/index.js";
import registerRouter from "./register.js";

const router = Router();

router.use("/discord", discordRouter);
router.use("/register", registerRouter);

export default router;
