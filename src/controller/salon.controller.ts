import BaseController from "./base.controller";
import SalonService from "../service/salon.service";
import { Request, Response } from "express";
import controllerErrorHandler from "../middleware/controller-error-handler.middleware";
import { SalonI } from "../interfaces/salon.interface";
import logger from "../utils/logger";
import ServiceI from "../interfaces/service.interface";
import { EmployeeI } from "../interfaces/employee.interface";
import { PhotoI } from "../interfaces/photo.interface";
import EventDesignerI from "../interfaces/eventDesigner.model";
import { OfferI } from "../interfaces/offer.interface";
import { SalonRedis } from "../redis/index.redis";
import { keys } from "../seeds/data/admin/admins";


export default class SalonController extends BaseController {

    service: SalonService
    constructor(service: SalonService) {
        super(service)
        this.service = service
    }

    postSalon = controllerErrorHandler(async (req: Request, res: Response) => {
        const d: SalonI = req.body

        if(d.vendor_id.length==0){
        //@ts-ignore
        d.vendor_id = req.vendorId
        }
       

        //@ts-ignore
        const salon = await this.service.postSalon(req.vendorId, d)
        if (salon === null) {
            const errMsg = `salon not found`;
            logger.error(errMsg);
            res.status(400);
            res.send({ message: errMsg });
        }
        res.status(201).send(salon)

    })
    patchSalon = controllerErrorHandler(async (req: Request, res: Response) => {
        const d = req.body
        const id = req.params.id

        //@ts-ignore
        const vendor_id = req.vendorId
        console.log(vendor_id)
        console.log(id)


        const salon = await this.service.patchSalon(id, vendor_id, d)
        if (salon === null) {
            const errMsg = `salon not found`;
            logger.error(errMsg);
            res.status(400);
            res.send({ message: errMsg });
        }
        res.send(salon)
    })
    salonSettings = controllerErrorHandler(async (req: Request, res: Response) => {
        
        const salon_id = req.params.id
        //@ts-ignore
        const vendor_id = req.vendorId
        const updates = Object.keys(req.body)
        const d = req.body
        const allowedupates = ["name", "location", "start_working_hours", "insta_link", "fb_link", "end_working_hours"]
        const isvalid = updates.every((update) => allowedupates.includes(update))
        console.log(isvalid)
        if (!isvalid) {
                const errMsg = `Sorry ${updates} cannot be updated!`
                logger.error(errMsg)
                res.send({message:errMsg})
                return
        }
        const salon = await this.service.patchSalon(salon_id,vendor_id,d)
        if (salon === null) {
            const errMsg = `salon not found`;
            logger.error(errMsg);
            res.status(400);
            res.send({ message: errMsg });
        }
        res.send(salon)


    })
    addSalonService = controllerErrorHandler(async (req: Request, res: Response) => {
        const d: ServiceI = req.body.services
        const salon_id = req.params.id
        //@ts-ignore
       
    
        const newSalon = await this.service.addSalonService(salon_id, d)
        if (newSalon === null) {
            const errMsg = `Add Services: no data with this _id and service was found`
            logger.error(errMsg)
            res.status(403)
            res.send({ message: errMsg })
            return
        }
        res.send(newSalon)

    })
    deleteSalonService = controllerErrorHandler(async (req: Request, res: Response) => {
        const sid = req.params.sid
        const _id = req.params.id
        //@ts-ignore
        const vendor_id = req.vendorId
        //TODO: validator
        if (!_id || !sid) {
            logger.error(`salon Id is missing salon_id:  & mua_id: `)
            res.status(403)
            res.send({ message: `salon Id is missing mua_id:` })
            return
        }
        const salon = await this.service.deleteSalonService(_id, sid)

        if (salon === null) {
            const errMsg = `Delete Service: no data with this _id and service was found`
            logger.error(errMsg)
            res.status(403)
            res.send({ message: errMsg })
            return
        }
        res.send(salon)


    })
    getService = controllerErrorHandler(async (req: Request, res: Response) => {
        const id = req.params.id
        console.log("calling get service api")
        
        //TODO: validator
        if (!id) {
            const errMsg = `id is missing from the params`
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return
        }
        const salon = await this.service.getService(id)
        if (salon === null) {
            const errMsg = `no service found`
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return
        }
        res.send(salon)


    })
    updateService = controllerErrorHandler(async (req: Request, res: Response) => {
        const d = req.body
        const id = req.params.id
        const sid = req.params.sid
        //@ts-ignore
        const vendor_id = req.vendorId
        //TODO:validator

        if (!id || !sid) {
            logger.error(`sid and id not found`)
            res.status(403)
            res.send({ message: "SID and ID not found" })
        }
        const updates = Object.keys(req.body)
        const allowedupates = ["name", "price:", "duration", "gender", "photo",]
        const isvalid = updates.every((update) => allowedupates.includes(update))

        if (!isvalid) {
            const errMsg = "Error updating "
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return
        }
        const salon = await this.service.updateService(id, d, sid)
        if (salon === null) {
            const errMsg = `no service found`
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return
        }
        res.send({message:"Service updated!"})
    })
    addSalonEmployee = controllerErrorHandler(async (req: Request, res: Response) => {
        const d: EmployeeI = req.body
        const _id = req.params.id
        //TODO:validator
        if (!_id) {
            const errMsg = `Add Emp: no data with this _id and service was found`
            logger.error(errMsg)
            res.status(403)
            res.send({ message: errMsg })
            return
        }
        const newSalon = await this.service.addSalonEmployee(d, _id)

        if (newSalon === null) {
            const errMsg = `Add Emp: no data with this _id and service was found`
            logger.error(errMsg)
            res.status(403)
            res.send({ message: errMsg })
            return
        }
        res.send(newSalon)

    })
    deleteSalonEmployee = controllerErrorHandler(async (req: Request, res: Response) => {
        const _id = req.params.id
        const eid = req.params.eid
        //@ts-ignore
        const vendor_id = req.vendorId
    
        //:TODO:validator
        if (!_id || !eid) {
            const errMsg = `delete Emp: no data with this _id and service was found`
            logger.error(errMsg)
            res.status(403)
            res.send({ message: errMsg })
            return
        }

        const newSalon = await this.service.deleteSalonEmployee(_id, eid, vendor_id)
        if (newSalon === null) {
            const errMsg = `delete Emp: no data with this _id and service was found`
            logger.error(errMsg)
            res.status(403)
            res.send({ message: errMsg })
            return
        }
        res.send(newSalon)

    })
    editSalonEmployee = controllerErrorHandler(async (req: Request, res: Response) => {
        const v = req.body
        const salon_id = req.params.id
        const emp_id = req.params.eid
        const emp = await this.service.editSalonEmployee(v, salon_id, emp_id)
        if (emp == null) {
            const errMsg = `Employee Not Found`
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return

        }
        res.send(emp)
    })

    putProfilePic = controllerErrorHandler(async (req: Request, res: Response) => {

        const photoData: PhotoI = req.body
        const _id = req.params.id

        const newEvent = await this.service.putProfilePic(photoData, _id)
        if (newEvent == null) {
            const errMsg = `Profile pic not updated!`
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return

        }
        res.send(newEvent)
    })

    getOffer = controllerErrorHandler(async (req: Request, res: Response) => {
        const id = req.params.id
        //TODO:validator
        if (!id) {
            const errMsg = `id is missing from the params`
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return
        }
        const offers = await this.service.getOffer(id)
        if (offers === null) {
            const errMsg = `no offers found`
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return
        }
        res.status(200).send(offers)
    })

    addSalonEvent = controllerErrorHandler(async (req: Request, res: Response) => {

        const d: EventDesignerI = req.body
        const designerEvent = await this.service.addSalonEvent(d)
        if (designerEvent === null) {
            logger.error(`Not able to update event`)
            res.status(400)
            res.send({ message: `Not able to update event: eventid -, event_id: ${d.event_id}` })
            return
        }

        res.status(201).send(designerEvent)
    })

    createOffer = controllerErrorHandler(async (req: Request, res: Response) => {
        //TODO:validator
        const id = req.params.id
        const serviceId = req.params.sid || req.body.service_id
        if (!serviceId) {
            const errMsg = `Service Id is missing`
            res.status(400)
            res.send({ errMsg })
            return
        }
        const e: OfferI = req.body
        const salon = await this.service.createOffer(id, serviceId, e)
        if (salon == null) {
            logger.error(`Not able to create offer`)
            res.status(400)
            res.send({ message: `Unable to create offer` })
            return
        }
        res.status(201).send(salon)

    })

    getSalonInfo = controllerErrorHandler(async (req: Request, res: Response) => {
        //TODO:validator
        const salonId = req.params.id;
        const sr: string = await SalonRedis.get(salonId)
        if (sr !== null) return res.send(JSON.parse(sr))
        const salon = await this.service.getSalonInfo(salonId)
        SalonRedis.set(salonId, salon)
        res.status(200).send(salon)
    })

    getSalonNames = controllerErrorHandler(async (req: Request, res: Response) => {
        //TODO:validator
        const data = new Array()
        let salons
        const sr = await SalonRedis.get('Salons')
        if (sr !== null) { salons = JSON.parse(sr) }
        else {
            salons = await this.service.getSalonNames(data)
            SalonRedis.set('Salons', salons)
        }

        res.status(200).send(salons)

    })
    getSalonsRw = controllerErrorHandler(async (req: Request, res: Response) => {
        const rating = req.query.rating
        if (rating !== 'asc' && rating !== 'dsc')
            return res.status(400).send({ message: 'Send valid sorting order' })
        const data = new Array()
        let salons
        const sr = await SalonRedis.get('Salons')
        if (sr !== null) salons = JSON.parse(sr)
        else {
            salons = await this.service.getSalonsRw(rating, data)
            SalonRedis.set('Salons', salons)
        }
        res.status(200).send(salons)

    })

    getSearchResult = controllerErrorHandler(async (req: Request, res: Response) => {
        //TODO:Validato
        const phrase = req.query.phrase
        if (!phrase)
            return res.status(400).send({ message: 'Provide search phrase' })
        const salon = await this.service.getSearchResult(phrase)
        res.status(200).send(salon)
    })
    getSalonNearby = controllerErrorHandler(async (req: Request, res: Response) => {
        var centerPoint = {}
        //TODO: store location of User
        //@ts-ignore
        centerPoint.lat = req.query.latitude
        //@ts-ignore
        centerPoint.lng = req.query.longitude
        const km = req.query.km || 2
        let salon
        const sr = await SalonRedis.get('Salons')
        if (sr !== null) salon = JSON.parse(sr)
        else {
            salon = await this.service.getSalonNearby(centerPoint, km)
            SalonRedis.set('Salons', salon)
        }
        res.status(200).send(salon)
    })

    getSalonDistance = controllerErrorHandler(async (req: Request, res: Response) => {
        var centerPoint = {}
        //TODO: store location of User
        //@ts-ignore
        centerPoint.lat = req.query.latitude
        //@ts-ignore
        centerPoint.lng = req.query.longitude
        const km = req.query.km || 2
        const salonLocation = await this.service.getSalonDistance(centerPoint, km)
        res.status(200).send(salonLocation)

    })

}