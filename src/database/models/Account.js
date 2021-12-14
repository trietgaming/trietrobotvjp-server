import mongoose from "mongoose";
import AccountSchema from "../schemas/Account.js";

export default mongoose.model("accounts", AccountSchema);
