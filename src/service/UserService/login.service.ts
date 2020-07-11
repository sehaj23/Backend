import encryptData from '../../utils/password-hash'
import User from '../../models/user.model'
import { Request, Response } from 'express'
import * as jwt from 'jwt-then'
import CONFIG from '../../config'
import UserI from '../../interfaces/user.interface'
import BaseService from './base.service'
import { UserRedis } from '../../redis/index.redis'

export default class LoginService extends BaseService {
  constructor() {
    super(User)
  }

  // Signup
  createUser = async (req: Request, res: Response) => {
    try {
      const v: UserI = req.body
      v.password = encryptData(v.password)
      const user = await User.create(v)
      delete user.password
      res.status(201).send({
        _id: user._id,
      })
    } catch (e) {
      res.status(500).send({
        message: `${CONFIG.RES_ERROR} ${e.message}`,
      })
    }
  }

  // Login
  verifyUser = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body

      const user = await User.findOne({
        email,
        password: encryptData(password),
      })

      if (user == null) {
        let count: number = 1
        const failedCount: string = await UserRedis.get(email)
        if (failedCount !== null) {
          count = parseInt(failedCount) + 1
          if (count === 6) {
            const usr = await User.findOne({ email })
            usr.blocked = true
            usr.save()
          }
        }
        UserRedis.set(email, count)
        return res.status(401).send({
          message: 'Username & password do not match',
        })
      }

      if (!user.blocked) {
        UserRedis.remove(email)
        delete user.password
        const token = await jwt.sign(user.toJSON(), CONFIG.USER_JWT, {
          expiresIn: '30 days',
        })
        return res.status(200).send({
          token,
        })
      }

      res.status(403).send({
        message: 'Account blocked due to numerous failed login attempts. Reset password to login.',
      })
    } catch (e) {
      res.status(500).send({
        message: `${CONFIG.RES_ERROR} ${e.message}`,
      })
    }
  }
}
