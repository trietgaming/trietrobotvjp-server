import mongoose from "mongoose";

const CustomPrice = new mongoose.Schema({
  p: Number,
  a: Number,
});

const Item = new mongoose.Schema(
  {
    id: Number,
    am: { type: Number, default: 0, required: false }, //amount
    c: { type: Array, default: [{ type: CustomPrice }], required: false },
  },
  { _id: false }
);

export default Item;
