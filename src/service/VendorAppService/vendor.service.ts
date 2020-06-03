import logger from "../../utils/logger";
import * as crypto from "crypto"
import Vendor from "../../models/vendor.model";
import { Router, Request, Response } from "express";
import * as jwt from "jwt-then";
import CONFIG from "../../config";
import { VendorI } from "../../interfaces/vendor.interface";
import { vendorJWTVerification } from "../../middleware/VendorJwt"
import mongoose from "../../database";
import { EmployeeAbsenteeismI } from "../../interfaces/employeeAbsenteeism.interface"
import EmployeeAbsenteeism from "../../models/employeeAbsenteeism.model"
import { Mongoose } from "mongoose";
import BaseService from "./base.service";




export default class VendorService extends BaseService {

    constructor() {
        super(Vendor)
    }



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
            const token = await jwt.sign(vendor.toJSON(), CONFIG.VENDOR_JWT, { expiresIn: "7 days" })
            res.send({ token })  //made change here for ID
        } catch (e) {
            res.status(403)
            res.send({ message: `${CONFIG.RES_ERROR} ${e.message}` })
        }
    }

    employeeAbsent = async (req: Request, res: Response) => {

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

            const d: EmployeeAbsenteeismI = req.body
            if (!d.employee_id) {
                return res.send("Send Employee ID")
            }
            //@ts-ignore
            d.employee_id = mongoose.Types.ObjectId(d.employee_id);

            console.log(d)



            //@ts-ignore
            const absent = await (await EmployeeAbsenteeism.create(d)).populate("employee_id").execPopulate()
            res.send(absent)





        } catch (error) {
            logger.error(`${error.message}`)
            res.status(403)
            res.send("Error creating ")
        }

    }



    employeeAbsentUpdate = async (req: Request, res: Response) => {

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

            const d: EmployeeAbsenteeismI = req.body

            console.log(d)
            //@ts-ignore


            //@ts-ignore
            const check = await EmployeeAbsenteeism.findOneAndUpdate({ employee_id: d.employee_id, absenteeism_date: d.absenteeism_date }, d, { new: true }).populate("employee_id").exec()
            res.send(check);



        } catch (error) {
            logger.error(`${error.message}`)
            res.status(403)
            res.send("Error creating ")
        }

    }
    get = async (req: Request, res: Response) => {

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