
import { Router, Request, Response } from "express";
import CONFIG from "../config";
import verifyToken from "../middleware/jwt";
import Vendor, { VendorI } from "../models/vendor.model";
import * as crypto from "crypto"
import logger from "../utils/logger";

const vendorRouter = Router()

vendorRouter.post("/", verifyToken, async (req: Request, res: Response) => {
    try {
        const {
            name,
            email,
            password,
            contact_number
        }: VendorI = req.body

        const v: VendorI = {
            name,
            email,
            password,
            contact_number
        }
        const passwordHash = crypto.createHash("md5").update(password!).digest("hex")
        v.password = passwordHash

        const vendor = await Vendor.create(v)

        res.send(vendor)
    } catch (e) {
        logger.error(`${e.message}`)
        res.status(403)
        res.send({ message: `${CONFIG.RES_ERROR} ${e.message}` })
    }
})


vendorRouter.get("/", verifyToken, async (req: Request, res: Response) => {
    try {
        const events = await Vendor.findAll()
        res.send(events)
    } catch (e) {
        res.status(403)
        res.send(e.message)
    }
})

vendorRouter.put("/", verifyToken, async (req: Request, res: Response) => {
    try {
        const { 
            id,
            name,
            email,
            contact_number
        }: VendorI = req.body


        const vendorData: VendorI = {
            name,
            email,
            contact_number
        }

        const [num, vendor] = await Vendor.update(vendorData, { where: { id: id! } }) // to return the updated data do - returning: true
        vendorData.id = id

        res.send(vendorData)
    } catch (e) {
        res.status(403)
        res.send({ message: `${CONFIG.RES_ERROR} ${e.message}` })
    }
})

export default vendorRouter