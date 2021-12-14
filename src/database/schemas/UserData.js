import mongoose from "mongoose";

const UserDataSchema = new mongoose.Schema(
  {
    _id: { type: Number, required: true, unique: true },
    bid: Number, //banner id
    w: { type: Number, default: 0 }, //wallet
    b: { type: Number, default: 0 }, //bank
    bl: { type: Number, default: 0 }, //bank limit
    lvl: { type: Number, default: 1 }, //level
  },
  { _id: false }
);

export default UserDataSchema;
