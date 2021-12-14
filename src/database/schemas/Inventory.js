import mongoose from "mongoose";
import Item from "./Item.js";

const InventorySchema = new mongoose.Schema(
  {
    _id: { type: String, trim: true, required: true, unique: true },
    iw: { type: Number, required: false, default: 0 },
    lm: { type: Number, required: false, default: 250 }, //items worth
    items: {
      type: Item,
      required: false,
      default: {},
    },
  },
  { _id: false }
);

export default InventorySchema;
