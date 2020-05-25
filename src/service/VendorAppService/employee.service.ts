import * as jwt from "jwt-then";
import CONFIG from "../../config";
import { EmployeeI } from "../../interfaces/employee.interface";
import * as crypto from "crypto"
import { Router, Request, Response } from "express";
import Employee from "../../models/employees.model"

export default class EmployeeService {

    static employeeLogin = async (req: Request, res: Response) => {
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
            const token = await jwt.sign(employee.toJSON(), CONFIG.EMP_JWT,{expiresIn:"7 days"})
            res.send({ token })
        } catch (error) {
            res.status(403)
            res.send({ message: `${CONFIG.RES_ERROR} ${error.message}` })
        }



    }

}