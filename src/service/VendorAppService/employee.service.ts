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
import EmployeeverifyToken, { employeeJWTVerification } from "../../middleware/Employee.jwt"
import BaseService from "./base.service";
import { PhotoI } from "../../interfaces/photo.interface";
import Photo from "../../models/photo.model";
import moment = require("moment");
import Salon from "../../models/salon.model";


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


            const decoded = await employeeJWTVerification(token)


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


            const decoded = await employeeJWTVerification(token)


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
    get = async (req: Request, res: Response) => {

        try {
            const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

            const decoded = await employeeJWTVerification(token)


            //@ts-ignore
            const _id = mongoose.Types.ObjectId(decoded._id)
            const outlets = await Employee.findById(_id).populate("services").populate("photo").exec()


            res.send(outlets)

        } catch (error) {
            logger.error(`${error.message}`)
            res.status(403)
            res.send("Error  ")

        }



    }
    update = async (req: Request, res: Response) => {
        try {
            const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
            const decoded = await employeeJWTVerification(token)


            const d = req.body

            //@ts-ignore
            const _id = mongoose.Types.ObjectId(decoded._id)
            const vendor = await Employee.findByIdAndUpdate(_id, d, { new: true })
            res.send(vendor)


        } catch (e) {
            logger.error(`${e.message}`)
            res.status(403)
            res.send("Error updating")


        }
    }
    putProfilePic = async (req: Request, res: Response) => {
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
            //@ts-ignore
            const _id = decoded._id
            const photoData: PhotoI = req.body

            // saving photos 
            const photo = await Photo.create(photoData)
            // adding it to event
            const newEvent = await Employee.findByIdAndUpdate({ _id }, { photo: photo._id }, { new: true }).populate("photo").exec() // to return the updated data do - returning: true
            res.send(newEvent)
        } catch (e) {
            logger.error(`User Put Photo ${e.message}`)
            res.status(403)
            res.send({ message: `${CONFIG.RES_ERROR} ${e.message}` })
        }
    }

    employeeSlots = async (req: Request, res: Response) => {
        try {
            const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
           
            const decoded = await employeeJWTVerification(token)
           
            //@ts-ignore
            const empId = decoded._id

            // getting the date from the frontend for which he needs the slots for
            let slotsDate = req.body.slots_date
            if (slotsDate) {
                const msg = "Something went wrong"
                logger.error(msg)
                res.status(400).send({ success: false, message: msg });
                return
            }
            slotsDate = new Date(slotsDate)

            const salonReq = Salon.findOne({ employees: [empId] })
            const employeesAbsenteeismReq = EmployeeAbsenteeism.findOne({ employee_id: empId, absenteeism_date: slotsDate })
            const [salon, employeesAbsenteeism] = await Promise.all([salonReq, employeesAbsenteeismReq])
            const starting_hours = salon.start_working_hours
            var slots = starting_hours.map(function (val) {
                const storeDate = moment(val).format('hh:mm a')
                const employeeAbsentSlots = employeesAbsenteeism.absenteeism_times
                if (employeeAbsentSlots.length === 0) {
                    return {
                        store_date: storeDate,
                        absent: false
                    }
                }
                for (let slot of employeeAbsentSlots) {
                    slot = moment(slot).format('hh:mm a')
                    if (slot === storeDate) {
                        return {
                            store_date: storeDate,
                            absent: true
                        }
                    }
                }
                return {
                    store_date: storeDate,
                    absent: false
                }
            })
            res.send(slots)
        } catch (e) {
            logger.error(`User Put Photo ${e.message}`)
            res.status(403)
            res.send({ message: `${CONFIG.RES_ERROR} ${e.message}` })
        }
    }

    // to add employee in empabs model
    employeeSelectSlot = async (req: Request, res: Response) => {
        try {
            const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
           
            const decoded = await employeeJWTVerification(token)
           
           

            // getting the date from the frontend for which he needs the slots for
            const data = req.body

            //@ts-ignore
            data.employee_id = decoded._id // req.empId
            let slotsDate = data.slots_date
            if (slotsDate) {
                const msg = "Something went wrong"
                logger.error(msg)
                res.status(400).send({ success: false, message: msg });
                return
            }
            slotsDate = new Date(slotsDate)

            const absentismTimes= data.absenteeism_times
            if(Array.isArray(absentismTimes) === false){
                const msg = "absentismTimes only array allowed"
                logger.error(msg)
                res.status(400).send({ success: false, message: msg });
                return
            }
            const empAbsent = EmployeeAbsenteeism.create(data)
            res.send(empAbsent)
        } catch (e) {
            logger.error(`User Put Photo ${e.message}`)
            res.status(403)
            res.send({ message: `${CONFIG.RES_ERROR} ${e.message}` })
        }
    }
}