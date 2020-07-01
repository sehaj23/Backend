import * as redis from 'redis'

const REDIS_PORT = process.env.REDIS_PORT || 6379
const REDIS_HOST = process.env.REDIS_HOST || "localhost"
//@ts-ignore
const redisClient = redis.createClient(REDIS_PORT, REDIS_HOST)

export default redisClient