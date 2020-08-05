import { Request, Response } from 'express'
import BaseController from './base.controller'
import VendorService from '../service/vendor.service'
import controllerErrorHandler from '../middleware/controller-error-handler.middleware'
import { SalonRedis } from '../redis/index.redis'
import CONFIG from '../config'
import { EmployeeAbsenteeismI } from '../interfaces/employeeAbsenteeism.interface'
import logger from '../utils/logger'
import { PhotoI } from '../interfaces/photo.interface'

export default class VendorController extends BaseController {
  
  service: VendorService
  constructor(service: VendorService) {
    super(service)
    this.service = service
  }
  vendorLogin =controllerErrorHandler( async (req: Request, res: Response) => {
    const { email, password } = req.body
    console.log(req.body)
    if (!email || !password) {

        res.status(400)
        res.send({ message: "Send all data" })
        return
    }
    const token = await this.service.vendorLogin(email,password)
    if (token == null) {
        res.status(400)
        res.send({ message: "Username password does not match" })
        return
    }
    res.send(token)
 
    })


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
        const id = req.vendoId
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
        const timeSlots = req.query.slots_date
        //TODO:validator
        if (!timeSlots) {
            const msg = "Something went wrong"
            logger.error(msg)
            res.status(400).send({ success: false, message: msg });
            return
        }
        const slots  =  await this.service.employeeSlots(id,timeSlots.toString())
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

   
}