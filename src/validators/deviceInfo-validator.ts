import { check } from 'express-validator'
import User from '../models/user.model'

export const deviceInfoChecks = [
  check('user_id', 'Invalid User')
    .isMongoId()
    .custom(async (userId) => {
      return await User.findById(userId).then((user) => {
        if (!user) return Promise.reject('User not found')
      })
    })
]
