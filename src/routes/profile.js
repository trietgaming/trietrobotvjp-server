import { Router } from "express";
import getAppFirebase from "../firebase/getAppFirebase.js";

const profileRouter = Router();

profileRouter.get("/", async (req, res, next) => {
  const uid = req.query.uid;
  if (!uid) next({ err: { message: "No uid provided!" }, code: 400 });
  try {
    const { auth, db } = getAppFirebase();
    const user = await auth.getUser(uid);
    if (!user) throw "User Not Found";
    const userRef = db.collection("users").doc(user.uid);
    const userDoc = await userRef.get();
    let userStore = {};
    if (userDoc.exists) userStore = userDoc.data();
    const profile = {
      username: user.displayName,
      uid: user.uid,
      disabled: user.disabled,
      joinedAt: user.joinedAt,
      userStore,
    };
    res.json({ data: profile });
  } catch (err) {
    next({ err, code: 400 });
  }
});

profileRouter.use(({ err, code }, req, res, next) => {
  res.status(code).json(err);
});

export default profileRouter;
