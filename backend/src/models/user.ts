import { Schema, model } from "mongoose";
import { pubsub } from "../redis.config";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "this email already exists"],
    },
    status: {
      type: String,
      default: "active",
    },
    cards: {
      type: [Schema.Types.ObjectId],
      ref: "Card",
    },
    debts: {
      type: [Schema.Types.ObjectId],
      ref: "Debt",
    },
  },
  { timestamps: true }
);

userSchema.post("save", (doc) => {
  pubsub.publish("USER_ADDED", { userAdded: doc });
});
const User = model("User", userSchema);

export default User;
