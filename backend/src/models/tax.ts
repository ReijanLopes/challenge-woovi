import { Schema, model } from "mongoose";

// as I don't know the company's interest rule, I'll leave two interest tables, one "none": "without interest", and another, "common": as a tax of 0.32788
const taxSchema = new Schema({
  cet: { type: Number },
  type: { type: String, required: [true, "Type tax is required"] },
  value: { type: Number },
});

const Tax = model("Tax", taxSchema);
export default Tax;
