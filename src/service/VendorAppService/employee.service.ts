import * as jwt from "jwt-then";
import CONFIG from "../../config";
import { EmployeeI } from "../../interfaces/employee.interface";
import * as crypto from "crypto"
import { Router, Request, Response } from "express";
import Employee from "../../models/employees.model"
import EmployeeAbsenteeism from "../../models/employeeAbsenteeism.model"

import { EmployeeAbsenteeismI } from "../../interfaces/employeeAbsenteeism.interface"
import logger from "../../utils/logger"
import mongoose from "../../database"
import { employeeJWTVerification } from "../../middleware/Employee.jwt"
import BaseService from "./base.service";


export default class EmployeeService extends BaseService {

    constructor() {
        super(Employee)
    }

    employeeLogin = async (req: Request, res: Response) => {
        try {

            const { phone, otp } = req.body
            if (!phone || !otp) {

                res.status(403)
                res.send({ message: "Send all data" })
                return
            }
            const employee = await Employee.findOne({ phone: phone })
            if (employee == null) {
                res.status(403)
                res.send({ message: "otp or mobile number does not match" })
                return
            }
            const token = await jwt.sign(employee.toJSON(), CONFIG.EMP_JWT, { expiresIn: "7 days" })
            res.send({ token })
        } catch (error) {
            res.status(403)
            res.send({ message: `${CONFIG.RES_ERROR} ${error.message}` })
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
            const decoded = await employeeJWTVerification(token)
            if (decoded === null) {
                logger.error("Something went wrong")
                res.status(401).send({ success: false, message: 'Something went wrong' });
                return
            }

            const d: EmployeeAbsenteeismI = req.body

            console.log(d)
            //@ts-ignore

            d.employee_id = mongoose.Types.ObjectId(decoded._id)
            //@ts-ignore
            const absent = await EmployeeAbsenteeism.create(d)
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
            const decoded = await employeeJWTVerification(token)
            if (decoded === null) {
                logger.error("Something went wrong")
                res.status(401).send({ success: false, message: 'Something went wrong' });
                return
            }

            const d: EmployeeAbsenteeismI = req.body

            console.log(d)
            //@ts-ignore

            d.employee_id = decoded._id
            //@ts-ignore
            const check = await EmployeeAbsenteeism.findOneAndUpdate({ employee_id: decoded._id, absenteeism_date: d.absenteeism_date }, d, { new: true })
            res.send(check);



        } catch (error) {
            logger.error(`${error.message}`)
            res.status(403)
            res.send("Error creating ")
        }

    }






}