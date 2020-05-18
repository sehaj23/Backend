import verifyToken from "../../middleware/jwt";
import * as crypto from "crypto"
import logger from "../../utils/logger";
import Vendor from "../../models/vendor.model";
import { Router, Request, Response } from "express";
import * as jwt from "jwt-then";
import CONFIG from "../../config";
import { VendorI } from "../../interfaces/vendor.interface";
import BaseService from "./base.service";
import { vendorJWTVerification } from "../../middleware/VendorJwt"
import { mongo } from "mongoose";
import mongoose from "../../database";
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


    static vendorPost = async (req: Request, res: Response) => {
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
            res.send({ token })  //made change here for ID
        } catch (e) {
            res.status(403)
            res.send({ message: `${CONFIG.RES_ERROR} ${e.message}` })
        }
    }
   static get = async (req: Request, res: Response) => {

        try {
            const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
            if (!token) {
                logger.error("No token provided.")
                res.status(401).send({ success: false, message: 'No token provided.' });
                return
            }
            const decoded = await vendorJWTVerification(token)
            if (decoded === null) {
                logger.error("Something went wrong")
                res.status(401).send({ success: false, message: 'Something went wrong' });
                return
            }
       
           //@ts-ignore
           const _id = mongoose.Types.ObjectId(decoded._id)
            const outlets = await Vendor.findById(_id).select("makeup_artists").populate("makeup_artists").select("salons").populate("salons").select("designers").populate("designers").exec()
            res.send(outlets)
            
        } catch (error) {
            
        }

    }
}
