import { Router } from "express"
import OfferService from "../../service/AdminService/offer.service"
import verifyToken from "../../middleware/jwt"

const offerRouter = Router()
const vs = new OfferService()

offerRouter.post("/", verifyToken, vs.post)
offerRouter.get("/", verifyToken, vs.get)
offerRouter.get("/:id", verifyToken, vs.getId)
offerRouter.put("/:id", verifyToken, vs.put)

export default offerRouter