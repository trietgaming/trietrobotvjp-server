import { getAuth } from "firebase-admin/auth";
import getFirebaseApp from "./getFirebaseApp";

const getAppFirebase = () => {
    const app = getFirebaseApp();
    return { auth: getAuth(app) };
};

export default getAppFirebase;
