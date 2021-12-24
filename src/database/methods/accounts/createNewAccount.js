import getAppFirebase from "../../../firebase/getAppFirebase.js";
import Account from "../../models/Account.js";

export default async ({
  account,
  firebase: { emailVerified, email, password, displayName },
}) => {
  const { auth } = getAppFirebase();
  const currentUserUid = await Account.estimatedDocumentCount();

  const newAccount = new Account({
    did: account?.discordId,
    fid: account?.facebookId,
    _id: currentUserUid,
  });
  console.log("new Account:");
  console.log(newAccount);
  const user = await auth.createUser({
    uid: currentUserUid.toString(),
    email,
    password,
    displayName,
    emailVerified,
  });
  await newAccount.save();
  console.log(user);

  return user;
};
