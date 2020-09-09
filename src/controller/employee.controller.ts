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
import { FeedbackVendorI } from "../interfaces/feedbackVendor.interface";
import { ReportVendorI } from "../interfaces/reportVendor.interface";
import { PhotoI } from "../interfaces/photo.interface";


export default class EmployeeController extends BaseController {

    service: EmployeeService
    constructor(service: EmployeeService) {
        super(service)
        this.service = service
    }

    getByIdWithService = controllerErrorHandler(async (req: Request, res: Response) => {
        const emp = await this.service.getByIdWithService(req.params.id)
        res.send(emp)
    })

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
        if(employee.blocked===true){
            res.status(403)
            res.send({ message: "Account deleted" })
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
        let gotSlotsDate = req.query.date
        console.log(gotSlotsDate)
        if (!gotSlotsDate) {
            const msg = "Something went wrong"
            logger.error(msg)
            res.status(400).send({ success: false, message: msg });
            return
        }
        const slotsDate = new Date(gotSlotsDate.toString())
        
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
    updateEmployee = controllerErrorHandler(async (req: Request, res: Response) => {

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


    })

    addServicesByCatgoryNames = controllerErrorHandler(async (req: Request, res: Response) => {
        const {salonId, employeeId} = req.params
        const {selectedCategoryNames} = req.body
        console.log("employeeId", employeeId)
        console.log("selectedCategoryNames", selectedCategoryNames)
        console.log("salonId", salonId)
        const employee = await this.service.addServicesByCatgoryNames(salonId, employeeId, selectedCategoryNames)
        res.send(employee)
    })

    employeeDelete = controllerErrorHandler(async (req: Request, res: Response) => {
      //@ts-ignore
        const id = req.empId
        const employee = await this.service.employeeDelete(id)
        if(employee==null){
            logger.error(`unable to delete account `)
            res.status(400)
            res.send({ message: `unable to delete account` })
            return
        }
        res.send({message:"Account Deleted",success:"true"})

    })
    feedback= controllerErrorHandler(async (req: Request, res: Response) =>{
        const data:FeedbackVendorI = req.body
        //@ts-ignore
        data.employee_id=req.empId
        const feedback = await this.service.feedback(data)
        if(feedback===null){
            logger.error(`Unable to create feedback`)
            res.status(400)
            res.send({ message: `Unable to create feedback` })
            return
        }
        res.status(200).send({message:"Thank you for your feedback",success:true})

    }) 
    report = controllerErrorHandler(async (req: Request, res: Response) =>{
        const data:ReportVendorI = req.body
        //@ts-ignore
        data.employee_id=req.empId
        const createReport = await this.service.report(data)
        if(createReport===null){
            logger.error(`Unable to create report`)
            res.status(400)
            res.send({ message: `Unable to create report` })
            return
        }
        res.send(createReport)

    })  
    empService = controllerErrorHandler(async (req: Request, res: Response) => {
        //@ts-ignore
        const id= req.empId 
        const service =await this.service.employeeService(id)
        res.send(service)

  })
  addProfilePic = async (req: Request, res: Response) => {
    try {
        const photoData: PhotoI = req.body
        //@ts-ignore
        const _id = req.params.id || req.userId || req.vendorId || req.empId
        // saving photos 
        const newEvent = await this.service.addProfilePic(photoData,_id)
       
        res.send(newEvent)
    } catch (e) {
        logger.error(`User Put Photo ${e.message}`)
        res.status(403).send(`${e.message}` )
    }
}
notificationUpdate = controllerErrorHandler(async (req: Request, res: Response) => {
    //@ts-ignore
    const id = req.empId
    const status = req.body.status
    
    const notification = await this.service.updateNotification(id,status)
    if(notification==null){
        logger.error(`something went wrong`)
        res.status(400)
        res.send({ message: `something went wrong`,success:false })
        return
    }
    res.send({message:"Notification status update",success:true})
  })

}