import { GraphQLObjectType, GraphQLNonNull, GraphQLID } from "graphql";
import { pubsub } from "../redis.config";
import { cardType, userType } from "./types";

export const subscription = new GraphQLObjectType({
  name: "Subscription",
  description: "The root of all subscription",
  fields: () => ({
    cardAdded: {
      type: cardType,
      args: {
        chatRoomId: { type: new GraphQLNonNull(GraphQLID) },
      },
      subscribe: () => pubsub.asyncIterator("CARD_ADDED"),
      resolve: (payload) => {
        return payload?.cardAdded;
      },
    },
    userAdded: {
      type: userType,
      subscribe: () => pubsub.asyncIterator("USER_ADDED"),
      resolve: (payload) => {
        return payload.userAdded;
      },
    },
  }),
});
