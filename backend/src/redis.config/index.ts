import { RedisPubSub } from "graphql-redis-subscriptions";
import Redis from "ioredis";
import "dotenv/config";

const host = process.env.REDIS_HOST || "127.0.0.1";
const port = process.env.REDIS_PORT ? process.env.REDIS_PORT : "6379";

const options = {
  host: host,
  port: Number(port),
  retryStrategy: (times: number) => {
    return Math.min(times * 50, 2000);
  },
};

export const pubsub = new RedisPubSub({
  publisher: new Redis(options),
  subscriber: new Redis(options),
});
