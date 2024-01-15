import { createClient } from "redis";

const redisHost = process.env.REDIS_HOST;
if (!redisHost) {
  throw new Error("Missing REDIS_HOST environment variable");
}
export const redisClient = createClient({
  url: redisHost,
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));
redisClient.on("connect", () => console.log("Redis connected"));
redisClient.connect();

export default redisClient;
