import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import getFirebaseApp from "./getFirebaseApp.js";

const getAppFirebase = () => {
  const app = getFirebaseApp();
  return { auth: getAuth(app), db: getFirestore(app) };
};

export default getAppFirebase;
