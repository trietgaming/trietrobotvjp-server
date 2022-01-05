import fetch from "cross-fetch";
import { EmailAndPasswordVerifyResult } from "src/interfaces";

export default async (
  email: string,
  password: string
): Promise<EmailAndPasswordVerifyResult> => {
  return (await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: `email=${email}&password=${password}`,
    }
  ).then((result) => result.json())) as EmailAndPasswordVerifyResult;
};
