import {
  GraphQLID,
  GraphQLList,
  GraphQLString,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLFloat,
  GraphQLInputObjectType,
} from "graphql";

export const taxType = new GraphQLObjectType({
  name: "Tax",
  fields: {
    cet: { type: GraphQLFloat },
    type: { type: GraphQLString },
    value: { type: GraphQLFloat },
  },
});

const installmentsType = new GraphQLObjectType({
  name: "Installments",
  fields: {
    status: { type: GraphQLString },
    idMonth: { type: GraphQLInt },
    value: { type: GraphQLFloat },
    expires: { type: GraphQLString },
  },
});

export const debtType = new GraphQLObjectType({
  name: "Debt",
  fields: {
    _id: { type: GraphQLID },
    value: { type: GraphQLFloat },
    tax: { type: taxType },
    cashback: { type: GraphQLFloat },
    numberOfInstallments: { type: GraphQLInt },
    totalValue: { type: GraphQLFloat },
    installments: { type: new GraphQLList(installmentsType) },
    cet: { type: GraphQLFloat },
    user: {
      type: new GraphQLObjectType({
        name: "UserDebt",
        fields: {
          _id: { type: GraphQLID },
          name: { type: GraphQLString },
          email: { type: GraphQLString },
          status: { type: GraphQLString },
          createdAt: { type: GraphQLString },
          updatedAt: { type: GraphQLString },
        },
      }),
    },
    card: {
      type: new GraphQLObjectType({
        name: "CardDebt",
        fields: {
          _id: { type: GraphQLID },
          name: { type: GraphQLString },
          number: { type: GraphQLString },
          cpf: { type: GraphQLString },
          expiration: { type: GraphQLString },
          cvv: { type: GraphQLString },
          status: { type: GraphQLString },
          createdAt: { type: GraphQLString },
          updatedAt: { type: GraphQLString },
        },
      }),
    },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  },
});

export const cardType = new GraphQLObjectType({
  name: "Card",
  fields: {
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    number: { type: GraphQLString },
    cpf: { type: GraphQLString },
    expiration: { type: GraphQLString },
    cvv: { type: GraphQLString },
    status: { type: GraphQLString },
    debts: { type: new GraphQLList(debtType) },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  },
});

export const userType = new GraphQLObjectType({
  name: "User",
  fields: {
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    status: { type: GraphQLString },
    cards: { type: new GraphQLList(cardType) },
    debts: { type: new GraphQLList(debtType) },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  },
});

export const taxInput = new GraphQLInputObjectType({
  name: "TaxInput",
  fields: {
    cet: { type: GraphQLFloat },
    type: { type: GraphQLString },
    value: { type: GraphQLFloat },
  },
});

export const installmentsInput = new GraphQLInputObjectType({
  name: "InstallmentsInput",
  fields: {
    status: { type: GraphQLString },
    idMonth: { type: GraphQLInt },
    value: { type: GraphQLFloat },
    expires: { type: GraphQLString },
  },
});

export const debtInput = new GraphQLInputObjectType({
  name: "DebtInput",
  fields: {
    _id: { type: GraphQLID },
    value: { type: GraphQLFloat },
    tax: { type: GraphQLID },
    cashback: { type: GraphQLFloat },
    numberOfInstallments: { type: GraphQLInt },
    totalValue: { type: GraphQLFloat },
    installments: { type: new GraphQLList(installmentsInput) },
    cet: { type: GraphQLFloat },
    user: { type: GraphQLID },
    card: { type: GraphQLID },
  },
});

export const cardInput = new GraphQLInputObjectType({
  name: "CardInput",
  fields: {
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    number: { type: GraphQLString },
    cpf: { type: GraphQLString },
    expiration: { type: GraphQLString },
    cvv: { type: GraphQLString },
    status: { type: GraphQLString },
    debts: { type: new GraphQLList(GraphQLID) },
    user: { type: GraphQLID },
  },
});

export const userInput = new GraphQLInputObjectType({
  name: "UserInput",
  fields: {
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    status: { type: GraphQLString },
    cards: { type: new GraphQLList(GraphQLID) },
    debts: { type: new GraphQLList(GraphQLID) },
  },
});
