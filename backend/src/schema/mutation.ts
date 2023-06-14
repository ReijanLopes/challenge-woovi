import {
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLID,
  GraphQLNonNull,
} from "graphql";
import User from "../models/user";
import Card from "../models/card";
import Debt from "../models/debt";
import Tax from "../models/tax";
import { ObjectId } from "mongoose";
import {
  cardType,
  userType,
  debtType,
  taxType,
  debtInput,
  taxInput,
  userInput,
  cardInput,
} from "./types";

const formatExpiringInDate = (expiration: string) => {
  const [month, yaer] = expiration.split("/");
  return new Date(Number("20" + yaer), Number(month) - 1, 1);
};

export const mutation = new GraphQLObjectType({
  name: "Mutation",
  description: "The root of all mutations",
  fields: {
    createUser: {
      type: userType,
      args: {
        input: { type: userInput },
      },
      resolve: async (_, { input }) => await User.create(input),
    },
    mutateCard: {
      type: cardType,
      args: {
        input: { type: cardInput },
      },
      resolve: async (_, { input }) => {
        const { expiration, debts, ...res } = input;
        const findCard = await Card.findOne({
          number: input.number,
          name: input.name,
        });
        const expirationDate = formatExpiringInDate(expiration);
        if (findCard?.number) {
          try {
            const card = await Card.findOneAndUpdate(
              { number: input.number, name: input.name },
              {
                ...res,
                expiration: expirationDate,
                $set: { debts: debts },
              }
            );
            await Debt.updateOne({ _id: debts }, { card: card?._id });
            await User.updateOne(
              { _id: res?.user },
              { $set: { cards: card?._id } }
            );
          } catch (error) {
            return error;
          }
          return await Card.find({ number: input.number, name: input.name });
        }

        try {
          const card = await Card.create({
            ...res,
            expiration: expirationDate,
            $set: { debts: debts },
          });
          await Debt.updateOne({ _id: debts }, { card: card?._id });
          await User.updateOne(
            { _id: res?.user },
            { $set: { cards: card?._id } }
          );
          return card;
        } catch (error) {
          return error;
        }
      },
    },
    createDebt: {
      type: debtType,
      args: {
        input: { type: debtInput },
      },
      resolve: async (_, { input }) => await Debt.create(input),
    },
    createTax: {
      type: taxType,
      args: {
        input: { type: taxInput },
      },
      resolve: async (_, { input }) => await Tax.create(input),
    },
    updateUser: {
      type: userType,
      args: {
        input: { type: userInput },
      },
      resolve: async (_, { input }) => {
        const { _id, ...res } = input;

        try {
          await User.updateOne({ _id }, res, { new: true });
        } catch (error) {
          return error;
        }
        return await User.findById({ _id });
      },
    },
    updateDebt: {
      type: debtType,
      args: {
        input: { type: debtInput },
      },
      resolve: async (_, { input }) => {
        const { _id, ...res } = input;
        try {
          const debt = await Debt.findOneAndUpdate({ _id }, res);
          await User.updateOne(
            { _id: res?.user },
            { $set: { debts: debt?._id } }
          );
        } catch (error) {
          return error;
        }

        return await Debt.findById({ _id });
      },
    },
    updateTax: {
      type: taxType,
      args: {
        input: { type: taxInput },
      },
      resolve: async (_, { input }) => {
        const { _id, ...res } = input;

        try {
          await Tax.findOneAndUpdate({ _id }, res, { new: true });
        } catch (error) {
          return error;
        }
        return await Tax.findById({ _id });
      },
    },
    deleteUser: {
      type: GraphQLBoolean,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (_, { id }) => {
        try {
          const user = await User.deleteOne({ _id: id });
          const cards = await Card.deleteMany({ user: id });
          const debt = await Debt.deleteMany({ user: id });
          console.log(user, cards, debt);
          return (
            !!user?.deletedCount &&
            !!cards?.deletedCount &&
            !!debt?.deletedCount
          );
        } catch (error) {
          console.log(error);
        }
      },
    },
    deleteCard: {
      type: GraphQLBoolean,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (_, { id }) => {
        const card = await Card.deleteOne({ _id: id });
        return !!card;
      },
    },
    deleteDebt: {
      type: GraphQLBoolean,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (_, { id }) => {
        const debt = await Debt.findByIdAndDelete({ _id: id });
        return !!debt;
      },
    },
    deleteTax: {
      type: GraphQLBoolean,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (_, { id }) => {
        const tax = await Tax.findByIdAndDelete({ _id: id });
        return !!tax;
      },
    },
  },
});
