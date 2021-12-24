import { getAuth } from "firebase-admin/auth";
import getFirebaseApp from "./getFirebaseApp.js";

const getAppFirebase = () => {
  const app = getFirebaseApp();
  return { auth: getAuth(app) };
};

export default getAppFirebase;
