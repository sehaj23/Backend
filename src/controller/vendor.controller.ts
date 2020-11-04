import { Request, Response } from 'express'
import BaseController from './base.controller'
import VendorService from '../service/vendor.service'
import controllerErrorHandler from '../middleware/controller-error-handler.middleware'
import { SalonRedis } from '../redis/index.redis'
import CONFIG from '../config'
import { EmployeeAbsenteeismI } from '../interfaces/employeeAbsenteeism.interface'
import logger from '../utils/logger'
import { PhotoI } from '../interfaces/photo.interface'
import { ReportVendorI } from '../interfaces/reportVendor.interface'
import { FeedbackI } from '../interfaces/feedback.interface'
import EmployeeService from '../service/employee.service'

export default class VendorController extends BaseController {
  
  service: VendorService;
  employeeService:EmployeeService
  constructor(service: VendorService,employeeService:EmployeeService) {
    super(service)
    this.service = service
    this.employeeService=employeeService
  }
//   vendorLogin =controllerErrorHandler( async (req: Request, res: Response) => {
//     const { email, password } = req.body
//     console.log(req.body)
//     if (!email || !password) {

//         res.status(400)
//         res.send({ message: "Send all data" })
//         return
//     }
//     const token = await this.service.vendorLogin(email,password)
//     if (token == null) {
//         res.status(400)
//         res.send({ message: "Username password does not match" })
//         return
//     }
//     res.send(token)
 
//     })


  employeeAbsent=controllerErrorHandler( async (req: Request, res: Response) => {
    const d:EmployeeAbsenteeismI = req.body
    if(d.employee_id==""){
        res.status(400).send("send Employee ID")
    }
    const absent = await  this.service.employeeAbsent(d)
    if(absent===null){
        logger.error(`Unable to create`)
        res.status(400)
        res.send({ message: `Unable to create` })
        return
    }
    res.send(absent)

  })

    employeeAbsentUpdate =controllerErrorHandler( async (req: Request, res: Response) => {
        const d: EmployeeAbsenteeismI = req.body
        const update = await this.service.employeeAbsentUpdate(d)
        if(update===null){
            logger.error(`Unable to update absentism`)
            res.status(400)
            res.send({ message: `Unable to update absentism` })
            return
        }
        res.send(update)



    })

    vendorInfo =controllerErrorHandler( async (req: Request, res: Response) => {
        //@ts-ignore
        const id = req.vendorId
        console.log(id)
        const vendor = await this.service.getVendor(id)
        
        if(vendor==null){
            logger.error(`Unable to fetch info. Please Login again`)
            res.status(400)
            res.send({ message: `Unable to fetch info. Please Login again` })
            return
        }
        res.send(vendor)

    })

    update =controllerErrorHandler( async (req: Request, res: Response) => {
        //@ts-ignore
        const id = req.vendorId
        const d = req.body
        const vendor = await this.service.update(id,d)
        if(vendor==null){
            logger.error(`Unable to fetch info. Please Login again`)
            res.status(400)
            res.send({ message: `Unable to fetch info. Please Login again` })
            return
        }
        res.send(vendor)
    })

    updatePass =controllerErrorHandler( async (req: Request, res: Response) => {

        const password = req.body.password
        const newpassword = req.body.newpassword
        //@ts-ignore
        const vendorId = req.vendorId
        const update = await this.service.updatePass(vendorId,password,newpassword)
        if(update==null){
            logger.error(`Unable to update password`)
            res.status(400)
            res.send({ message: `Unable to update password` })
            return
        }
        res.send(update)
    })
    employeeSlots =controllerErrorHandler ( async (req: Request, res: Response)=>{
        const id = req.params.id
        let gotSlotsDate =   req.query.slots_date
        //TODO:validator
        if (!gotSlotsDate) {
            const msg = "Something went wrong"
            logger.error(msg)
            res.status(400).send({ success: false, message: msg });
            return
        }
        const slotsDate = new Date(gotSlotsDate.toString())
        
        const slots = await this.employeeService.employeeSlots(id, slotsDate)
        
        if(slots==null){
            logger.error(`No Slots Found`)
            res.status(400)
            res.send({ message: `No Slots Found` })
            return
        }
        res.send(slots)

    })
    slots =controllerErrorHandler( async (req: Request, res: Response) => {
      const id =  req.params.id
      const date = req.query.date
      const slots = await this.service.slots(id,date.toString())
      if(slots==null){
        logger.error(`No Slots Found`)
        res.status(400)
        res.send({ message: `No Slots Found` })
        return
    }
    res.send(slots)


    })

    employeebyId =controllerErrorHandler( async (req: Request, res: Response) => {
        const  id = req.params.id
        const emp = await this.service.employeebyId(id)

        if(emp==null){
            logger.error(`Unable to find Employee`)
            res.status(400)
            res.send({ message: `Unable to find Employee` })
            return
        }
        res.send(emp)
    })

    report = controllerErrorHandler(async (req: Request, res: Response) =>{
        const data:ReportVendorI = req.body
        //@ts-ignore
        data.employee_id=req.vendorId
        const createReport = await this.service.report(data)
        if(createReport===null){
            logger.error(`Unable to create report`)
            res.status(400)
            res.send({ message: `Unable to create report` })
            return
        }
        res.send(createReport)

    })
    feedback= controllerErrorHandler(async (req: Request, res: Response) =>{
        const data:FeedbackI = req.body
         //@ts-ignore
         data.vendor_id=req.vendorId
        const feedback = await this.service.feedback(data)
        if(feedback===null){
            logger.error(`Unable to create feedback`)
            res.status(400)
            res.send({ message: `Unable to create feedback` })
            return
        }
        res.status(200).send({message:"Thank you for your feedback",success:true})

    })
    
    vendorDelete = controllerErrorHandler(async (req: Request, res: Response) => {
        //@ts-ignore
          const id = req.vendorId
          const vendor = await this.service.vendorDelete(id)
          if(vendor==null){
              logger.error(`unable to delete account `)
              res.status(400)
              res.send({ message: `unable to delete account` })
              return
          }
          res.send({message:"Account Deleted",success:"true"})
  
      })

      vendorService = controllerErrorHandler(async (req: Request, res: Response) => {
            const id = req.params.id
            //@ts-ignore
            const vendorId = req.vendorId
            const service =await this.service.vendorService(id,vendorId)
            if(service==null){
                logger.error(`unable to get services`)
                res.status(400)
                res.send({ message: `unable to get services` })
                return
            }
            res.send(service)

      })

      employeeServicecount = controllerErrorHandler(async (req: Request, res: Response) => {
        const id = req.params.id
       
        const service =await this.employeeService.employeeService(id)   
      
        if(service==null){
            logger.error(`unable to get services`)
            res.status(400)
            res.send({ message: `unable to get services` })
            return
        }
        res.send(service)

      })

      notificationUpdate = controllerErrorHandler(async (req: Request, res: Response) => {
        //@ts-ignore
        const id = req.vendorId
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