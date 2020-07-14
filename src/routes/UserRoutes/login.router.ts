import { Router } from 'express'
import LoginService from '../../service/UserService/login.service'
import { loginChecks, signupChecks } from '../../validators/login-validator'
import mySchemaValidator from '../../middleware/my-schema-validator'
import { signupLimiter, loginLimiter } from '../../middleware/rate-limit'
const ls = new LoginService()

const loginRouter = Router()

// @ts-ignore
loginRouter.post(
  '/',
  loginLimiter,
  [loginChecks, mySchemaValidator],
  ls.verifyUser
)
// @ts-ignore
loginRouter.post(
  '/create',
  signupLimiter,
  [signupChecks, mySchemaValidator],
  ls.createUser
)

export default loginRouter
