import { Router, Request, Response } from "express";
import CONFIG from "../config";
import verifyToken from "../middleware/jwt";
import * as crypto from "crypto"
import logger from "../utils/logger";
import Designer, { DesignersI } from "../models/designers.model";
import Admin, {AdminI} from "../models/admin.model";
import Event, {EventI} from "../models/event.model";
import Vendor, {VendorI} from "../models/vendor.model";
import MakeupArtist from "../models/makeupArtist.model";
import Salon from "../models/salon.model";

const vendorRouter = Router()

export default class VendorService{
    static post = async (req: Request, res: Response) => {
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
    }

    static get = async (req: Request, res: Response) => {
        try {
            const events = await Vendor.findAll()
            res.send(events)
        } catch (e) {
            res.status(403)
            res.send(e.message)
        }
    }

    static getId = async (req: Request, res: Response) => {
        try {
            const id = req.params.id
            if(!id){
                const msg = 'Id not found for vendor.'
                logger.error(msg)
                res.status(403)
                res.send(msg)
            }
            const event = await Vendor.findByPk(id, {include: [Designer, MakeupArtist, Salon], attributes: {exclude: ["password"]}})
            res.send(event)
        } catch (e) {
            res.status(403)
            res.send(e.message)
        }
    }

    static put = async (req: Request, res: Response) => {
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
    }
}
