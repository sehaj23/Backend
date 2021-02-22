import { Router } from "express"
import ReferralController from "../../controller/referral.controller"
import verifyToken from "../../middleware/jwt"
import Referral from "../../models/referral.model"
import ReferralService from "../../service/referral.service"


const referralRouter = Router()
const referralService = new ReferralService(Referral)
const referralController = new ReferralController(referralService)

referralRouter.get("/code",verifyToken,referralController.getRefferalbyCode)

export default referralRouter