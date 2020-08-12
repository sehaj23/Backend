import { Request, Response } from 'express'
import * as jwt from 'jwt-then'
import BaseController from './base.controller'
import LoginService from '../service/login.service'
import controllerErrorHandler from '../middleware/controller-error-handler.middleware'
import encryptData from '../utils/password-hash'
import { UserRedis } from '../redis/index.redis'
import CONFIG from '../config'
import logger from '../utils/logger'

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
      console.log(this.jwtKey)
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

  create = controllerErrorHandler(async (req: Request, res: Response) => {
    const user = req.body
      var password = encryptData(user.password)
      
      user.password = password
      const createUser = await this.service.create(user)
      console.log(createUser)
      if(createUser==null){
        const errMsg = `unable to create User`;
            logger.error(errMsg);
            res.status(400);
            res.send({ message: errMsg });
            return
      }
      res.status(201).send(createUser)

  })

  loginwithGoogle =controllerErrorHandler(async (req: Request, res: Response) => {
    const user = req.body
    
    const createUser = await this.service.create(user)
    if(createUser==null){
      const errMsg = `unable to create User`;
          logger.error(errMsg);
          res.status(400);
          res.send({ message: errMsg });
          return
    }
    createUser.password = ''
    const token = await jwt.sign(createUser.toJSON(), this.jwtKey, {
      expiresIn: this.jwtValidity,
    })
    return res.status(200).send({
      token,
    })        
    
  })

}
