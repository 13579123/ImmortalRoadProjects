import { getRedis } from "../module/redis";
import dotenv from "dotenv";

dotenv.config()

export const redis = getRedis({
  url: `redis://${ process.env.REDIS_HOST || "127.0.0.1"}:${ process.env.REDIS_PORT || "6379"}`
})