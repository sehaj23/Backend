const RateLimit = require('express-rate-limit')
const RedisStore = require('rate-limit-redis')
import redisClient from '../redis/redis'

export const signupLimiter = new RateLimit({
  store: new RedisStore({
    client: redisClient,
  }),
  windowMs: 3 * 60 * 60 * 1000, // 3 hours window
  max: 5,
  message: {
    message:
      'Too many accounts created, please try again in 3 hours',
  },
  delayMs: 0,
})

export const loginLimiter = new RateLimit({
  store: new RedisStore({
    client: redisClient,
  }),
  windowMs: 3 * 60 * 60 * 1000, // 3 hours window
  max: 8,
  message: {
    message:
      'Too many login attempts, please try again in 3 hours',
  },
  delayMs: 0,
})
