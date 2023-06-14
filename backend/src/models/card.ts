import { Schema, model } from "mongoose";
import { pubsub } from "../redis.config";
import { schema } from "../schema";

const cardSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Full name is required"],
      index: true,
    },
    number: {
      type: String,
      required: [true, "Card number is required"],
      unique: [true, "Card number must be unique"],
    },
    cpf: {
      type: String,
      required: [true, "CPF is required"],
      index: true,
    },
    expiration: {
      type: Date,
      required: [true, "Expiration date is required"],
    },
    cvv: {
      type: Number,
      required: [true, "Card verification value is required"],
    },
    status: { type: String, default: "active" },
    debts: {
      type: [Schema.Types.ObjectId],
      ref: "Debt",
    },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, "Card user is required"],
    },
  },
  { timestamps: true }
);

cardSchema.post("save", (doc) => {
  pubsub.publish("CARD_ADDED", { cardAdded: doc });
});
const Card = model("Card", cardSchema, "cards");
export default Card;
