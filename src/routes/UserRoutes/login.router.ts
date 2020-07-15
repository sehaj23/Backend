import { Router } from 'express'
import LoginService from '../../service/login.service'
import { loginChecks, signupChecks } from '../../validators/login-validator'
import mySchemaValidator from '../../middleware/my-schema-validator'
import { signupLimiter, loginLimiter } from '../../middleware/rate-limit'
import User from '../../models/user.model'
import LoginController from '../../controller/login.controller'
import CONFIG from '../../config'

const loginRouter = Router()
const loginService = new LoginService(User)
const loginController = new LoginController(loginService, CONFIG.USER_JWT, '30 days')

// @ts-ignore
loginRouter.post(
  '/',
  loginLimiter,
  [loginChecks, mySchemaValidator],
  loginController.login
)

//@ts-ignore
loginRouter.post(
  '/create',
  signupLimiter,
  [signupChecks, mySchemaValidator],
  loginController.post
)

export default loginRouter
