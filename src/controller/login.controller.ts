import { Request, Response } from 'express'
import * as jwt from 'jwt-then'
import BaseController from './base.controller'
import LoginService from '../service/login.service'
import controllerErrorHandler from '../middleware/controller-error-handler.middleware'
import encryptData from '../utils/password-hash'
import { UserRedis } from '../redis/index.redis'
import CONFIG from '../config'

export default class LoginController extends BaseController {
  jwtKey: string
  jwtValidity: string
  service: LoginService
  constructor(service: LoginService, jwtKey: string, jwtValidity: string) {
    super(service)
    this.service = service
    this.jwtKey = jwtKey
    this.jwtValidity = jwtValidity
  }

  login = controllerErrorHandler(async (req: Request, res: Response) => {
    try {
      const email = req.body.email
      const password = encryptData(req.body.password)
      const user = await this.service.login(email, password)
      console.log('USER',user)

      if (user == null) {
        let count: number = 1
        const failedCount: string = await UserRedis.get('Login', { email })
        if (failedCount !== null) {
          count = parseInt(failedCount) + 1
          if (count === 6) {
            const usr = await this.service.getByEmail(email)
              usr.blocked = true
              usr.save()            
          }
        }
        UserRedis.set('Login', count, { email })
        return res.status(401).send({
          message: 'Username & password do not match',
        })
      }

      if (!user.blocked) {
        UserRedis.remove('Login', { email })
        user.password = ''
        const token = await jwt.sign(user.toJSON(), this.jwtKey, {
          expiresIn: this.jwtValidity,
        })
        return res.status(200).send({
          token,
        })
      }

      res.status(403).send({
        message:
          'Account blocked due to numerous failed login attempts. Reset password to unblock account.',
      })
    } catch (e) {
      res.status(500).send({
        message: `${CONFIG.RES_ERROR} ${e.message}`,
      })
    }
  })
}
