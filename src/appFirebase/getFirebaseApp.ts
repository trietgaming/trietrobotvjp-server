import { initializeApp, cert } from "firebase-admin/app";

const initFirebaseApp = () => {
  const firebaseApp = initializeApp({
    credential: cert({
      //FSA = FIREBASE SERVICE ACCOUNT
      projectId: process.env.FSA_PROJECT_ID,
      privateKey: (process.env.FSA_PRIVATE_KEY as string).replace(/\\n/g, "\n"),
      clientEmail: process.env.FSA_CLIENT_EMAIL,
    }),
    projectId: process.env.FSA_PROJECT_ID,
  });
  return () => firebaseApp;
};

const getFirebaseApp = initFirebaseApp();

export default getFirebaseApp;
