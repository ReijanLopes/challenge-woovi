import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLID,
  GraphQLNonNull,
  GraphQLString,
} from "graphql";

import Tax from "../models/tax";
import User from "../models/user";
import Card from "../models/card";
import Debt from "../models/debt";
import { cardType, userType, debtType, taxType } from "./types";

export const query = new GraphQLObjectType({
  name: "Query",
  description: "The root of all queries",
  fields: () => ({
    getUser: {
      name: "getUser",
      type: userType,
      args: {
        id: {
          type: GraphQLID,
        },
      },
      resolve: async (_, args) => {
        const result = await User.findById({ _id: args?.id })
          .populate("cards")
          .populate("debts");
        return result;
      },
    },
    getCard: {
      name: "getCard",
      type: cardType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve: async (_, args) =>
        await Card.findById({ _id: args.id }).populate("debts"),
    },
    getDebt: {
      name: "getDebt",
      type: debtType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve: async (_, args) => {
        const result = await Debt.findById({ _id: args?.id })
          .populate("tax")
          .populate("user")
          .populate("card");
        return result;
      },
    },
    getTax: {
      name: "getTax",
      type: taxType,
      args: {
        type: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve: async (_, args) => Tax.findOne({ type: args.type }),
    },
    listUser: {
      name: "listUser",
      type: new GraphQLList(userType),
      resolve: async () => await User.find().populate("cards"),
    },
    listCard: {
      name: "listCard",
      type: new GraphQLList(cardType),
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve: async (_, args) => await Card.find({ user: args.id }),
    },
    listDebt: {
      name: "listDebt",
      type: debtType,
      args: {
        userId: {
          type: GraphQLID,
        },
        cardId: {
          type: GraphQLID,
        },
      },
      resolve: async (_, args) => {
        const find = args?.userId
          ? { userId: args?.userId }
          : { cardId: args?.cardId };
        return await Debt.find(find);
      },
    },
    listTax: {
      name: "listTax",
      type: taxType,
      resolve: async () => Tax.find(),
    },
  }),
});
