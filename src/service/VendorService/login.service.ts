import verifyToken from "../../middleware/jwt";
import * as crypto from "crypto"
import logger from "../../utils/logger";
import Vendor from "../../models/vendor.model";
import { Router, Request, Response } from "express";
import * as jwt from "jwt-then";
import CONFIG from "../../config";
import { VendorI } from "../../interfaces/vendor.interface";
import BaseService from "./base.service";
const loginRouter = Router()

export default class LoginService extends BaseService {


    static createVendor = async (req: Request, res: Response) => {
        try {

            const v: VendorI = req.body
            if (!v.email || !v.password) {
                res.status(403)
                res.send({ message: "Send all data" })
                return
            }

            const passwordHash = crypto.createHash("md5").update(v.password).digest("hex")
            v.password = passwordHash
            const vendor = await Vendor.create(v)
            vendor.password = ""
            res.send(vendor)
        } catch (e) {
            res.status(403)
            res.send({ message: `${CONFIG.RES_ERROR} ${e.message}` })
        }

    }


    static Vendorpost = async (req: Request, res: Response) => {
        try {

            const { email, password } = req.body
            if (!email || !password) {

                res.status(403)
                res.send({ message: "Send all data" })
                return
            }

            const passwordHash = crypto.createHash("md5").update(password).digest("hex")
            const vendor = await Vendor.findOne({ email, password: passwordHash })
            if (vendor == null) {
                res.status(403)
                res.send({ message: "Username password does not match" })
                return
            }
            vendor.password = ""
            const token = await jwt.sign(vendor.toJSON(), CONFIG.VENDOR_JWT,{expiresIn:"7 days"})
            res.send({ token })
        } catch (e) {
            res.status(403)
            res.send({ message: `${CONFIG.RES_ERROR} ${e.message}` })
        }
    }
   static get = async (req: Request, res: Response) => {

        try {
            const id = req.params.id
            const outlets = await Vendor.findById(id).select("makeup_artists").populate("makeup_artists").select("salons").populate("salons").select("designers").populate("designers").exec()
            res.send(outlets)
            
        } catch (error) {
            
        }

    }
}
