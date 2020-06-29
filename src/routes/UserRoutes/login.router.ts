import {
    Router
} from "express";
import LoginService from "../../service/UserService/user.login.service";
import * as vd from '../../validators/user-validators/login-validator'
import {checkSchema, check, oneOf, validationResult } from 'express-validator'
import mySchemaValidator from "../../middleware/my-schema-validator";
const ls = new LoginService()

const loginRouter = Router()

// @ts-ignore
loginRouter.post("/", [vd.loginChecks, mySchemaValidator], ls.verifyUser)
// @ts-ignore
loginRouter.post('/create', [vd.signupChecks, mySchemaValidator], ls.createUser)

export default loginRouter
