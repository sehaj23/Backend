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


export default class SalonController extends BaseController {

    service: SalonService
    constructor(service: SalonService) {
        super(service)
        this.service = service
    }

    postSalon = controllerErrorHandler(async (req: Request, res: Response) => {
        const d: SalonI = req.body
        //@ts-ignore
        d.vendor_id = req.vendorId
        //@ts-ignore
        const salon = await this.service.postSalon(req.vendorId, d)
        if (salon === null) {
            const errMsg = `salon not found`;
            logger.error(errMsg);
            res.status(400);
            res.send({ message: errMsg });
        }
        res.send(salon)

    })
    patchSalon = controllerErrorHandler(async (req: Request, res: Response) => {
        const d = req.body
        const id = req.params.id
        //@ts-ignore
        const vendor_id = req.vendorId

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

        const salon = await this.service.salonSettings(salon_id, updates, vendor_id)
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
        const vendor_id = req.vendorId
        const newSalon = await this.service.addSalonService(salon_id, vendor_id, d)
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
        const salon = await this.service.deleteSalonService(_id, sid, vendor_id)

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
        //@ts-ignore
        const vendor_id = req.vendorId
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
        const key = Object.keys(d)
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
        res.send(salon)
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
        res.send(offers)
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

        res.send(designerEvent)
    })


}