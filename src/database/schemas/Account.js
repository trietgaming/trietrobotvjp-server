import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema(
  {
    _id: { type: Number, required: true, unique: true },
    did: {
      type: String,
      trim: true,
      required: false,
      index: {
        unique: true,
        partialFilterExpression: { did: { $type: "string" } },
      },
      default: null,
    }, //Discord ID
    fid: {
      type: String,
      trim: true,
      required: false,
      index: {
        unique: true,
        partialFilterExpression: { fid: { $type: "string" } },
      },
      default: null,
    }, //Facebook ID
    pinv: { type: Boolean, required: false, default: true }, //public inventory?
    pbal: { type: Boolean, required: false, default: true }, //public balance?
    trd: { type: Boolean, required: false, default: true }, //inventory tradeable?
  },
  { _id: false }
);

export default AccountSchema;