import getAppFirebase from "../../../appFirebase/getAppFirebase";
import db from "../..";
import { CreateRequest } from "firebase-admin/auth";

export default async ({
  emailVerified,
  email,
  password,
  displayName,
  photoURL,
  providerToLink,
  ...props
}: CreateRequest) => {
  const { auth } = getAppFirebase();
  console.log(providerToLink);
  console.log("new Account:");
  let user = await auth.createUser({
    uid: `${
      (
        await db.query(`UPDATE counter SET current = current + 1 RETURNING *`)
      ).rows[0].current
    }`,
    email,
    password,
    displayName,
    emailVerified,
    photoURL,
  });
  if (providerToLink)
    user = await auth.updateUser(user.uid, { providerToLink });
  console.log(user);

  return user;
};
