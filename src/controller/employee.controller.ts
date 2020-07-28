import BaseController from "./base.controller";
import OfferService from "../service/offer.service";
import { Request, Response } from "express";
import controllerErrorHandler from "../middleware/controller-error-handler.middleware";
import { OfferI } from "../interfaces/offer.interface";
import logger from "../utils/logger";
import EmployeeService from "../service/employee.service";
import * as jwt from "jwt-then";
import CONFIG from "../config";


export default class EmployeeController extends BaseController {

    service: EmployeeService
    constructor(service: EmployeeService) {
        super(service)
        this.service = service
    }

    employeeLogin =controllerErrorHandler( async (req: Request, res: Response) => {
       //TODO:validator
        const { phone, otp } = req.body
        if (!phone || !otp) {

            res.status(403)
            res.send({ message: "Send all data" })
            return
        }
        const employee = await this.service.employeeLogin(phone,otp)
        if (employee == null) {
            res.status(403)
            res.send({ message: "otp or mobile number does not match" })
            return
        }
        const token = await jwt.sign(employee.toJSON(), CONFIG.EMP_JWT, { expiresIn: "7 days" })
        res.send({ token })

    })

}