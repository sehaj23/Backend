import AWS = require('aws-sdk')
import { Request, Response } from 'express'
import * as jwt from 'jwt-then'
import moment = require('moment')
import { sqsNewUser } from '../aws'
import CONFIG from '../config'
import { PromoCodeSI, PromoCodeTimeType } from "../interfaces/promo-code.interface"
import { PromoCodeI } from '../interfaces/promo-code.interface'
import { ReferralI, ReferralSI } from '../interfaces/referral.interface'
import { UserSI } from '../interfaces/user.interface'
import controllerErrorHandler from '../middleware/controller-error-handler.middleware'
import Vendor from '../models/vendor.model'
import { PromoCodeRedis, UserRedis } from '../redis/index.redis'
import LoginService from '../service/login.service'
import Notify from '../service/notify.service'
import OtpService from '../service/otp.service'
import PromoCodeService from '../service/promo-code.service'
import ReferralService from '../service/referral.service'
import SendEmail from '../utils/emails/send-email'
import ErrorResponse from '../utils/error-response'
import logger from '../utils/logger'
import encryptData from '../utils/password-hash'
import BaseController from './base.controller'

export default class LoginController extends BaseController {
  jwtKey: string
  jwtValidity: string
  service: LoginService
  otpService: OtpService
  referralService: ReferralService
  promoCodeService: PromoCodeService
  constructor(service: LoginService, jwtKey: string, jwtValidity: string, otpService: OtpService, referralService: ReferralService, promoCodeService: PromoCodeService) {
    super(service)
    this.service = service
    this.jwtKey = jwtKey
    this.jwtValidity = jwtValidity
    this.otpService = otpService
    this.referralService = referralService
    this.promoCodeService = promoCodeService
  }

  getEncryptedPass = controllerErrorHandler(async (req: Request, res: Response) => {
    res.send(encryptData(req.params.password))
  })

  loginVendor = controllerErrorHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body
    const v = await Vendor.findOne({ email, password: encryptData(password) })
    if (v === null) throw new Error("Email id password does not match")
    v.password = undefined
    const token = await jwt.sign({_id: v._id.toString() }, CONFIG.VENDOR_JWT, {
      expiresIn: this.jwtValidity,
    })
    res.send({ token })
  })

  loginAdmin = controllerErrorHandler(async (req: Request, res: Response) => {
    let { username, password } = req.body
    password = encryptData(password)
    const admin = await this.service.loginAdmin(username, password)
    if (admin === null) throw new ErrorResponse({ message: "Username password does not match" })
    const token = await jwt.sign(admin.toJSON(), this.jwtKey, {
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
        const token = await jwt.sign({_id: user._id.toString() }, this.jwtKey, {
          expiresIn: this.jwtValidity,
        })
        return res.status(200).send({
          token: token,
          gender: user.gender
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
    let refferallCode

    user.password = password
    const createUser: UserSI = await this.service.create(user)
    if (req.body.rfcode) {
      const rfCode = req.body.rfcode
      refferallCode = await this.service.getOne({ referral_code: rfCode })
      if (refferallCode != null) {
        const referalData: ReferralI = {
          referred_by: refferallCode._id,
          referred_to: {
            status: "Used",
            referral_code: rfCode,
            user: createUser._id,
          }
        }
        try {
          const referral = await this.referralService.post(referalData) as ReferralSI
        } catch (error) {
          console.log(error)
        }
        // try {
        //   const getRefferal = await this.referralService.countDocumnet({ referred_by: refferallCode._id, "referred_to.status": "Used" })
        //   console.log(refferallCode._id)
        //   if (getRefferal === 4) {
        //     const promoCode = {
        //       promo_code: "REFBONUS" + refferallCode._id.toString().substring(1, 4),
        //       user_ids: [refferallCode._id],
        //       description: "refer your 4 friends and get your first haircut free",
        //       active: true,
        //       salon_ids: [],
        //       categories: ["HAIRCUT"],
        //       time_type: 'All Day',
        //       visiblity: "User",
        //       payment_mode: "Both",
        //       minimum_bill: 100,
        //       discount_type: "Discount Percentage",
        //       discount_percentage: 60,
        //       discount_cap: 600,
        //       usage_time_difference: 1,
        //       max_usage: 1,
        //       start_date_time: moment().toDate(),
        //       expiry_date_time: moment("2021-05-30").toDate()
        //     }
        //     const promo = await this.promoCodeService.post(promoCode) as PromoCodeSI
        //     PromoCodeRedis.removeAll()
        //   }
        // } catch (error) {
        //   console.log(error)
        // }

      }
    }
    if (createUser == null) {
      const errMsg = `unable to create User`;
      logger.error(errMsg);
      res.status(400);
      res.send({ message: errMsg });
      return
    }
    if (createUser.phone != null) {
      const number = await this.otpService.sendUserOtpEmail(createUser.email)
      try {
        SendEmail.emailConfirm(createUser.email, number.otp, createUser.name)
      } catch (error) {

      }

    }
    try {
      SendEmail.signupUser(createUser.email, createUser.name)
    } catch (error) {

    }
    console.log(createUser.email)
    const token = await jwt.sign({ _id: createUser._id.toString() }, this.jwtKey, {
      expiresIn: this.jwtValidity,
    })

    const queueData = {
      "user_id": createUser._id
    }
    

    res.status(201).send({ token })
  })

  loginwithGoogle = controllerErrorHandler(async (req: Request, res: Response) => {
    const user = req.body
    const { uid, email } = req.body
    let refferallCode
    const getUser = await this.service.getbyUIDandEmail(uid, email) as UserSI
    if (getUser === null) {
      user.approved = true
      const createUser = await this.service.create(user)
      if (req.body.rfcode) {
        const rfCode = req.body.rfcode
        refferallCode = await this.service.getOne({ referral_code: rfCode })
        if (refferallCode != null) {
          const referalData: ReferralI = {
            referred_by: refferallCode._id,
            referred_to: {
              status: "Used",
              referral_code: rfCode,
              user: createUser._id,
            }
          }
          try {
            const referral = await this.referralService.post(referalData) as ReferralSI
          } catch (error) {
            console.log(error)
          }
          // try {
          //   const getRefferal = await this.referralService.countDocumnet({ referred_by: refferallCode._id, "referred_to.status": "Used" })
          //   console.log(refferallCode._id)
          //   if (getRefferal === 4) {
          //     const promoCode = {
          //       promo_code: "REFBONUS" + refferallCode._id.toString().substring(1, 4),
          //       user_ids: [refferallCode._id],
          //       description: "refer your 4 friends and get your first haircut free",
          //       active: true,
          //       salon_ids: [],
          //       categories: ["HAIRCUT"],
          //       time_type: 'All Day',
          //       visiblity: "User",
          //       payment_mode: "Both",
          //       minimum_bill: 100,
          //       discount_type: "Discount Percentage",
          //       discount_percentage: 60,
          //       discount_cap: 600,
          //       usage_time_difference: 1,
          //       max_usage: 1,
          //       start_date_time: moment().toDate(),
          //       expiry_date_time: moment("2021-05-30").toDate()
          //     }
          //     const promo = await this.promoCodeService.post(promoCode) as PromoCodeSI
          //     PromoCodeRedis.removeAll()
          //   }
          // } catch (error) {
          //   console.log(error)
          // }
  
        }
      }
      try {
        SendEmail.signupUser(createUser.email,createUser.name)
      } catch (error) {
        console.log(error)
      }
      if (createUser == null) {
        const errMsg = `unable to create User`;
        logger.error(errMsg);
        res.status(400);
        res.send({ message: errMsg });
        return
      }
      createUser.password = ''
     

      const token = await jwt.sign( {_id: createUser._id.toString() }, this.jwtKey, {
        expiresIn: this.jwtValidity,
      })
      const queueData = {
        "user_id": createUser._id
      }
      sqsNewUser(JSON.stringify(queueData))
      return res.status(201).send({
        token: token
      })
    }
    getUser.password = ''
    const token = await jwt.sign({_id: getUser._id.toString() }, this.jwtKey, {
      expiresIn: this.jwtValidity,
    })
    return res.status(200).send({
      token: token, gender: getUser.gender
    })


  })

  loginwithFacebook = controllerErrorHandler(async (req: Request, res: Response) => {
    const user = req.body
    const { uid } = req.body
    let refferallCode
    const getUser = await this.service.getbyUID(uid) as UserSI
    if (getUser === null) {
      user.approved = true
      const createUser = await this.service.create(user)
      if (req.body.rfcode) {
        const rfCode = req.body.rfcode
        refferallCode = await this.service.getOne({ referral_code: rfCode })
        if (refferallCode != null) {
          const referalData: ReferralI = {
            referred_by: refferallCode._id,
            referred_to: {
              status: "Used",
              referral_code: rfCode,
              user: createUser._id,
            }
          }
          try {
            const referral = await this.referralService.post(referalData) as ReferralSI
          } catch (error) {
            console.log(error)
          }
          // try {
          //   const getRefferal = await this.referralService.countDocumnet({ referred_by: refferallCode._id, "referred_to.status": "Used" })
          //   console.log(refferallCode._id)
          //   if (getRefferal === 4) {
          //     const promoCode = {
          //       promo_code: "REFBONUS" + refferallCode._id.toString().substring(1, 4),
          //       user_ids: [refferallCode._id],
          //       description: "refer your 4 friends and get your first haircut free",
          //       active: true,
          //       salon_ids: [],
          //       categories: ["HAIRCUT"],
          //       time_type: 'All Day',
          //       visiblity: "User",
          //       payment_mode: "Both",
          //       minimum_bill: 100,
          //       discount_type: "Discount Percentage",
          //       discount_percentage: 60,
          //       discount_cap: 600,
          //       usage_time_difference: 1,
          //       max_usage: 1,
          //       start_date_time: moment().toDate(),
          //       expiry_date_time: moment("2021-06-15").toDate()
          //     }
          //     const promo = await this.promoCodeService.post(promoCode) as PromoCodeSI
          //     PromoCodeRedis.removeAll()
          //   }
          // } catch (error) {
          //   console.log(error)
          // }
  
        }
      }
      if (createUser == null) {
        const errMsg = `unable to create User`;
        logger.error(errMsg);
        res.status(400);
        res.send({ message: errMsg });
        return
      }
      createUser.password = ''

      const token = await jwt.sign({_id: createUser._id.toString() }, this.jwtKey, {
        expiresIn: this.jwtValidity,
      })
      const queueData = {
        "user_id": createUser._id
      }
      sqsNewUser(JSON.stringify(queueData))
      return res.status(201).send({
        token: token
      })
    }
    getUser.password = ''
    const token = await jwt.sign({_id: getUser._id.toString() }, this.jwtKey, {
      expiresIn: this.jwtValidity,
    })
    return res.status(200).send({
      token: token, gender: getUser.gender
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
    return res.status(200).send({ message: "otp verfied", success: true })
  })

  loginWithOtpSendOtp = controllerErrorHandler(async (req: Request, res: Response) => {
    const { phone } = req.body
    const user = await this.service.getOne({ phone }) as UserSI
    if (user === null) throw new ErrorResponse({ message: `User not found with phone ${phone}` })
    await this.otpService.sendUserOtp(phone)
    res.send({ message: "Otp sent" })
  })

  loginWithOtpVerifyOtp = controllerErrorHandler(async (req: Request, res: Response) => {
    const { phone, otp } = req.body
    const user = await this.service.getOne({ phone }) as UserSI
    if (user === null) throw new ErrorResponse({ message: `User not found with phone ${phone}` })
    await this.otpService.verifyUserOtp(phone, otp, user._id.toString())
    user.password = ''
    const token = await jwt.sign({_id: user._id.toString() }, this.jwtKey, {
      expiresIn: this.jwtValidity,
    })
    return res.status(200).send({
      token: token, gender: user.gender
    })
  })

  forgotPasswordVerifyEmail = controllerErrorHandler(async (req: Request, res: Response) => {
    const { email, otp } = req.body
    const user = await this.service.getOne({ email }) as UserSI
    if (user === null) throw new ErrorResponse({ message: `User not found with phone ${email}` })
    await this.otpService.emailVerifyUserOtp(email, otp, user._id.toString())
    user.password = ''
    const token = await jwt.sign({_id: user._id.toString() }, this.jwtKey, {
      expiresIn: this.jwtValidity,
    })
    return res.status(200).send({
      token,
    })


  })
  forgotPasswordSendEmail = controllerErrorHandler(async (req: Request, res: Response) => {
    const { email } = req.body
    const user = await this.service.getOne({ email }) as UserSI
    if (!user) res.status(400).send({ sucess: false, message: "User not found with phone ${email}" })
    const number = await this.otpService.sendUserOtpEmail(email)
    console.log(number)
    SendEmail.forgotPasswordUser(email, number.otp)
    res.send({ success: true, message: "Email Sent" })

  })

  checkMobileUnique =  controllerErrorHandler(async (req: Request, res: Response) => {
    const {phone}= req.body
    const unique = await this.service.get({phone})
    if(unique){
      return res.status(400).send({message:"Phone number already in user"})
    }
    await  this.otpService.sendUserOtp(phone)
    res.send({ message: "Otp sent" })
    
  })



}
