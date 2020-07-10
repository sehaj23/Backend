import { Router } from 'express'
import LoginService from '../../service/UserService/login.service'
import * as vd from '../../validators/user-validators/login-validator'
import mySchemaValidator from '../../middleware/my-schema-validator'
import { signupLimiter, loginLimiter } from '../../middleware/rate-limit'
const ls = new LoginService()

const loginRouter = Router()

// @ts-ignore
loginRouter.post(
  '/',
  loginLimiter,
  [vd.loginChecks, mySchemaValidator],
  ls.verifyUser
)
// @ts-ignore
loginRouter.post(
  '/create',
  signupLimiter,
  [vd.signupChecks, mySchemaValidator],
  ls.createUser
)

export default loginRouter
