import BaseController from "./base.controller";
import OfferService from "../service/offer.service";
import { Request, Response } from "express";
import controllerErrorHandler from "../middleware/controller-error-handler.middleware";
import { OfferI } from "../interfaces/offer.interface";
import logger from "../utils/logger";
import EmployeeService from "../service/employee.service";
import * as jwt from "jwt-then";
import CONFIG from "../config";
import { EmployeeAbsenteeismI } from "../interfaces/employeeAbsenteeism.interface";


export default class EmployeeController extends BaseController {

    service: EmployeeService
    constructor(service: EmployeeService) {
        super(service)
        this.service = service
    }

    employeeLogin = controllerErrorHandler(async (req: Request, res: Response) => {
        //TODO:validator
        const { phone, otp } = req.body
        if (!phone || !otp) {

            res.status(403)
            res.send({ message: "Send all data" })
            return
        }
        const employee = await this.service.employeeLogin(phone, otp)
        if (employee == null) {
            res.status(403)
            res.send({ message: "otp or mobile number does not match" })
            return
        }
        const token = await jwt.sign(employee.toJSON(), CONFIG.EMP_JWT, { expiresIn: "7 days" })
        res.send({ token })

    })
    employeeAbsent = controllerErrorHandler(async (req: Request, res: Response) => {
        const d: EmployeeAbsenteeismI = req.body
        //@ts-ignore
        d.employee_id = req.empId
        const absent = await this.service.employeeAbsent(d)
        res.send(absent)

    })
    employeeAbsentUpdate = controllerErrorHandler(async (req: Request, res: Response) => {
        const d: EmployeeAbsenteeismI = req.body
        //@ts-ignore
        d.employee_id = req.empId
        const absent = await this.service.employeeAbsentUpdate(d)
        if (absent === null) {
            logger.error(`Not able to update `)
            res.status(400)
            res.send({ message: `Not able to update event: event_id  ${d.employee_id}` })
            return
        }
        res.send(absent)
    })
    getEmp = controllerErrorHandler(async (req: Request, res: Response) => {
        //@ts-ignore
        const id = req.empId
        const outlets = await this.service.getEmp(id)
        res.send(outlets)
    })
    employeeSlots = controllerErrorHandler(async (req: Request, res: Response) => {
        //@ts-ignore
        const empId = req.empId

        // getting the date from the frontend for which he needs the slots for
        let slotsDate = req.body.slots_date
        if (slotsDate) {
            const msg = "Something went wrong"
            logger.error(msg)
            res.status(400).send({ success: false, message: msg });
            return
        }
        slotsDate = new Date(slotsDate)
        const slots = await this.service.employeeSlots(empId, slotsDate)
        res.send(slots)

    })
    employeeSelectSlot = controllerErrorHandler(async (req: Request, res: Response) => {
        //TODO:Validator
        // getting the date from the frontend for which he needs the slots for
        const data = req.body

        //@ts-ignore
        data.employee_id = req.empId
        let slotsDate = data.slots_date
        if (slotsDate) {
            const msg = "Something went wrong"
            logger.error(msg)
            res.status(400).send({ success: false, message: msg });
            return
        }
        slotsDate = new Date(slotsDate)

        const absentismTimes = data.absenteeism_times
        if (Array.isArray(absentismTimes) === false) {
            const msg = "absentismTimes only array allowed"
            logger.error(msg)
            res.status(400).send({ success: false, message: msg });
            return
        }
        const absent = await this.service.employeeSelectSlot(data)
        res.send(absent)

    })
    updateEmployee = async (req: Request, res: Response) => {

        const d = req.body
        //@ts-ignore
        const empId = req.empId
        const update = await this.service.updateEmp(empId, d)
        if (update === null) {
            logger.error(`unable to update `)
            res.status(400)
            res.send({ message: `unable to update event: event_id  ${empId}` })
            return
        }
        res.send(update)


    }


}