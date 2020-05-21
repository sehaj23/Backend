import { Router, Request, Response } from "express";
import CONFIG from "../../config";
import logger from "../../utils/logger";
import BaseService from "./base.service";
import { EmployeeI } from "../../interfaces/employee.interface";
import mongoose from "../../database";

import Employee from "../../models/employees.model";

const employee = Router()

export default class EmployeeService {


    createEmployee = async (req: Request, res: Response) => {
        try {
            const v: EmployeeI = req.body
            if (!v.name || !v.phone) {
                res.status(403)
                res.send({ message: "Send all data" })
                return
            }
        
            const emp = await Employee.create(v)


            res.send(emp)
            



        } catch (e) {
            const errMsg = "Unable to create Employee"
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
        }

    }



    editEmployee = async (req: Request, res: Response) => {
        try {
            const v: EmployeeI = req.body
            const _id = req.params.id
            const emp = await (await Employee.findByIdAndUpdate({ _id }, v, { new: true }).populate("services")).execPopulate()// to return the updated data do - returning: true
            if (!emp) {

                const errMsg = `Employee Not Found`
                logger.error(errMsg)
                res.status(400)
                res.send({ message: errMsg })
                return

            }
            res.send(emp)
        } catch (e) {
            const errMsg = `Error Updating`
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
        }
    }



    deleteEmployee = async (req: Request, res: Response) => {
        try {
            const _id = req.params.id
            const emp = await Employee.findByIdAndDelete(_id)
            if (!emp) {
                const errMsg = `Employee Not Found`
                logger.error(errMsg)
                res.status(400)
                res.send({ message: errMsg })
            }
            res.send(emp)

        } catch (e) {
            const errMsg = `Error Deleting Employee`
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })

        }

    }

}