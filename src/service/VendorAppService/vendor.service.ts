import logger from "../../utils/logger";
import * as crypto from "crypto"
import Vendor from "../../models/vendor.model";
import { Router, Request, Response } from "express";
import * as jwt from "jwt-then";
import CONFIG from "../../config";
import { VendorI } from "../../interfaces/vendor.interface";
import { vendorJWTVerification } from "../../middleware/VendorJwt"
import mongoose from "../../database";


export default class VendorService{



 vendorLogin = async (req: Request, res: Response) => {
    try {

        const { email, password } = req.body
        console.log(req.body)
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
}