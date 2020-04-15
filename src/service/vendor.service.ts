import { Request, Response } from "express";
import CONFIG from "../config";
import * as crypto from "crypto"
import logger from "../utils/logger";
import Designer from "../models/designers.model";
import Vendor from "../models/vendor.model";
import MakeupArtist from "../models/makeupArtist.model";
import Salon from "../models/salon.model";
import { VendorI, VendorSI } from "../interfaces/vendor.interface";

export default class VendorService{
    static post = async (req: Request, res: Response) => {
        try {
            const v: VendorI = req.body

            const passwordHash = crypto.createHash("md5").update(v.password!).digest("hex")
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
            const vendor = await Vendor.find().populate('designers')
            res.send(vendor)
        } catch (e) {
            logger.error(e.message)
            console.log(e.message);
            res.status(403)
            res.send(e.message)
        }
    }

    static getId = async (req: Request, res: Response) => {
        try {
            const _id = req.params.id
            if(!_id){
                const msg = 'Id not found for vendor.'
                logger.error(msg)
                res.status(403)
                res.send(msg)
            }
            const event = await Vendor.findById(_id)
            res.send(event)
        } catch (e) {
            logger.error(e.message)
            res.status(403)
            res.send(e.message)
        }
    }

    static put = async (req: Request, res: Response) => {
        try {

            const vendorData: VendorSI = req.body
            const _id = vendorData.$isDefault
            const [num, vendor] = await Vendor.update(vendorData, { where: { id: _id! } }) // to return the updated data do - returning: true
            vendorData.id = _id

            res.send(vendorData)
        } catch (e) {
            logger.error(e.message)
            res.status(403)
            res.send({ message: `${CONFIG.RES_ERROR} ${e.message}` })
        }
    }
}
