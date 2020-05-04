import { Router } from "express";
import VendorverifyToken from "../../middleware/VendorJwt";
import offerservices from "../../service/VendorService/offer.service";
const offerRouter = Router()
const es = new offerservices()

offerRouter.post("/:id",VendorverifyToken,es.createOffer)
offerRouter.put("/edit/:id",VendorverifyToken,es.updateOffer)
offerRouter.get("/",VendorverifyToken,es.allOffer)
offerRouter.patch("/disable/:id",VendorverifyToken,es.disableOffer)



export default offerRouter
