import { Router } from "express";
import getOauth2Token from "../_middlewares/getOauth2Token";
import fetchUser from "../_middlewares/fetchUser";
import verifyAndLink from "../_middlewares/verifyAndLink";
import verifyIdToken from "../_middlewares/verifyIdToken";
import linkUserWithProvider from "../_middlewares/linkUserWithProvider";
import handleSocialLoginOrRegister from "../_middlewares/handleSocialLoginOrRegister";

const router = Router();

router.get(
  "/",
  getOauth2Token({
    provider: "facebook",
    redirect_uri: process.env.FACEBOOK_REDIRECT_URI as string,
    redirectWhenFailUrl: `${process.env.CLIENT_DOMAIN}/login`,
  }),
  fetchUser,
  handleSocialLoginOrRegister
);

router.post("/verify", verifyAndLink);

router.get(
  "/link",
  verifyIdToken,
  getOauth2Token({
    provider: "facebook",
    redirect_uri: process.env.FACEBOOK_REDIRECT_URI + "/link",
    redirectWhenFailUrl: `${process.env.CLIENT_DOMAIN}/account`,
  }),
  fetchUser,
  linkUserWithProvider
);

export default router;
