import Koa from "koa";
import bodyParser from "koa-bodyparser";
import { useServer } from "graphql-ws/lib/use/ws";
import { connect } from "mongoose";
import { WebSocketServer } from "ws";
import { execute, subscribe, GraphQLError } from "graphql";
import "dotenv/config";
import cors from "@koa/cors";
import {
  getGraphQLParameters,
  processRequest,
  renderGraphiQL,
  shouldRenderGraphiQL,
  sendMultipartResponseResult,
  sendResponseResult,
} from "graphql-helix";

import { schema } from "./schema";

const app = new Koa();
const port = process.env.PORT || 3002;
const mongodbURL = process.env.MONGODB_CONNECT as string;

app.use(cors());
app.use(bodyParser());

app.use(async (ctx) => {
  const request = {
    body: ctx.request.body,
    headers: ctx.req.headers,
    method: ctx.request.method,
    query: ctx.request.query,
  };
  if (shouldRenderGraphiQL(request)) {
    ctx.body = renderGraphiQL({
      subscriptionsEndpoint: `ws://localhost:${port}/graphql`,
    });
  } else {
    const { operationName, query, variables } = getGraphQLParameters(request);

    const result = await processRequest({
      operationName,
      query,
      variables,
      request,
      schema,
    });

    if (result.type === "RESPONSE") {
      await sendResponseResult(result, ctx.res);
    } else if (result.type === "MULTIPART_RESPONSE") {
      await sendMultipartResponseResult(result, ctx.res);
    } else {
      ctx.body.status = 422;
      ctx.body.json = {
        errors: [
          new GraphQLError("Subscriptions should be sent over WebSocket."),
        ],
      };
    }
  }
});

connect(mongodbURL)
  .then(() => {
    console.info("🥳 Connect in mongodb");
  })
  .catch((err) => console.error({ message: err }));

const server = app.listen(port, () => {
  const wsServer = new WebSocketServer({
    server,
    path: "/graphql",
  });

  useServer({ schema, execute, subscribe }, wsServer);
  console.info(`🚀 Server running in port ${port}`);
});
