import {
  Network,
  Observable,
  RequestParameters,
  Variables,
  Store,
  RecordSource,
  Environment,
  IEnvironment,
} from "relay-runtime";
import { createClient } from "graphql-ws";
import { Platform } from "react-native";

const port = process.env.REACT_APP_API_PORT || 3002;

const url =
  Platform.OS === "ios"
    ? `ws://127.0.0.1:${port}/graphql`
    : `ws://10.0.2.2:${port}/graphql`;

const wsClient = createClient({
  url,
});

function fetchOrSubscribe(
  operation: RequestParameters,
  variables: Variables
): Observable<any> {
  return Observable.create((sink) => {
    if (!operation.text) {
      return sink.error(new Error("Operation text cannot be empty"));
    }
    return wsClient.subscribe(
      {
        operationName: operation.name,
        query: operation.text,
        variables,
      },
      sink
    );
  });
}

export function createEnvironment(): IEnvironment {
  const network = Network.create(fetchOrSubscribe, fetchOrSubscribe);
  const store = new Store(new RecordSource());
  return new Environment({ store, network });
}
