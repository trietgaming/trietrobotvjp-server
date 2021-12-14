import mongoose from "mongoose";
import UserDataSchema from "../schemas/UserData.js";

export default mongoose.model("userdatas", UserDataSchema);
