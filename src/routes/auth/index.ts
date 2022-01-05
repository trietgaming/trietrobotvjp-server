import { Router } from "express";
import discordRouter from "./discord";
import registerRouter from "./register";
import facebookRouter from "./facebook";

const router = Router();

router.use("/discord", discordRouter);
router.use("/register", registerRouter);
router.use("/facebook", facebookRouter);

export default router;
