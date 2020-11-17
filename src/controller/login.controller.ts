import { Request, Response } from 'express'
import * as jwt from 'jwt-then'
import CONFIG from '../config'
import { UserSI } from '../interfaces/user.interface'
import controllerErrorHandler from '../middleware/controller-error-handler.middleware'
import Vendor from '../models/vendor.model'
import { UserRedis } from '../redis/index.redis'
import LoginService from '../service/login.service'
import OtpService from '../service/otp.service'
import SendEmail from '../utils/emails/send-email'
import ErrorResponse from '../utils/error-response'
import logger from '../utils/logger'
import encryptData from '../utils/password-hash'
import BaseController from './base.controller'
import User from '../models/user.model'

export default class LoginController extends BaseController {
  jwtKey: string
  jwtValidity: string
  service: LoginService
  otpService: OtpService
  constructor(service: LoginService, jwtKey: string, jwtValidity: string, otpService: OtpService) {
    super(service)
    this.service = service
    this.jwtKey = jwtKey
    this.jwtValidity = jwtValidity
    this.otpService = otpService
  }

  getEncryptedPass = controllerErrorHandler(async (req: Request, res: Response) => {
    res.send(encryptData(req.params.password))
  })

  loginVendor = controllerErrorHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body
    const v = await Vendor.findOne({ email, password: encryptData(password) })
    if (v === null) throw new Error("Email id password does not match")
    v.password = undefined
    const token = await jwt.sign(v.toJSON(), CONFIG.VENDOR_JWT, {
      expiresIn: this.jwtValidity,
    })
    res.send({ token })
  })

  login = controllerErrorHandler(async (req: Request, res: Response) => {
    try {
      const email = req.body.email
      const password = encryptData(req.body.password)
      const user = await this.service.login(email, password)
      console.log(this.jwtKey)
      console.log('USER', user)

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
          'Account blocked ',
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
    const createUser: UserSI = await this.service.create(user)
    console.log(createUser)
    if (createUser == null) {
      const errMsg = `unable to create User`;
      logger.error(errMsg);
      res.status(400);
      res.send({ message: errMsg });
      return
    }
    const number =  await this.otpService.sendUserOtpEmail(createUser.email)
    SendEmail.emailConfirm(createUser.email,number.otp,createUser.name)
   
    console.log(createUser.email)
    const token = await jwt.sign(createUser.toJSON(), this.jwtKey, {
      expiresIn: this.jwtValidity,
    })
    res.status(201).send({ token })

  })

  loginwithGoogle = controllerErrorHandler(async (req: Request, res: Response) => {
    const user = req.body
    const { uid, email } = req.body
    
    const getUser = await this.service.getbyUID(uid, email)
    if (getUser === null) {
      user.approved=true
      const createUser = await this.service.create(user)
      if (createUser == null) {
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
    }
    getUser.password = ''
    const token = await jwt.sign(getUser.toJSON(), this.jwtKey, {
      expiresIn: this.jwtValidity,
    })
    return res.status(200).send({
      token,
    })


  })

  signupWithOtpSendOtp = controllerErrorHandler(async (req: Request, res: Response) => {
    const { phone } = req.body
    await this.otpService.signupUserWithPhoneSendOtp(phone)
    res.send({ message: "OTP Sent" })
  })
  signupWithOtpVerifyOtp = controllerErrorHandler(async (req: Request, res: Response) => {
    const { phone, otp } = req.body
    const verifyOTP = await this.otpService.signupUserWithPhoneVerifyOtp(phone, otp)
    // getUser.password = ''
    // const token = await jwt.sign(getUser.toJSON(), this.jwtKey, {
    //   expiresIn: this.jwtValidity,
    // })
    // return res.status(200).send({
    //   token,
    // })
    return res.send(200).send({message:"otp verfied",success:true})
  })

  loginWithOtpSendOtp = controllerErrorHandler(async (req: Request, res: Response) => {
    const {phone} = req.body
    const user = await this.service.getOne({phone}) as UserSI
    if(user === null) throw new ErrorResponse(`User not found with phone ${phone}`)
    await this.otpService.sendUserOtp(phone)
    res.send({message: "Otp sent"})
  })

  loginWithOtpVerifyOtp = controllerErrorHandler(async (req: Request, res: Response) => {
    const {phone, otp} = req.body
    const user = await this.service.getOne({phone}) as UserSI
    if(user === null) throw new ErrorResponse(`User not found with phone ${phone}`)
    await this.otpService.verifyUserOtp(phone, otp, user._id.toString())
    user.password = ''
    const token = await jwt.sign(user.toJSON(), this.jwtKey, {
      expiresIn: this.jwtValidity,
    })
    return res.status(200).send({
      token,
    })
  })

  forgotPasswordVerifyEmail =controllerErrorHandler(async (req: Request, res: Response) => {
    const {email, otp} = req.body
    const user = await this.service.getOne({email}) as UserSI
    if(user === null) throw new ErrorResponse(`User not found with phone ${email}`)
    await this.otpService.emailVerifyUserOtp(email, otp, user._id.toString())
    user.password = ''
    const token = await jwt.sign(user.toJSON(), this.jwtKey, {
      expiresIn: this.jwtValidity,
    })
    return res.status(200).send({
      token,
    })
    

  })
  forgotPasswordSendEmail =controllerErrorHandler(async (req: Request, res: Response) => {
    const {email} = req.body
    const user = await this.service.getOne({email}) as UserSI
    if(!user) res.status(400).send({sucess:false,message:"User not found with phone ${email}"})
   const number =  await this.otpService.sendUserOtpEmail(email)
   console.log(number)
    SendEmail.forgotPasswordUser(email,number.otp)
    res.send({success:true,message:"Email Sent"})

  })



}
