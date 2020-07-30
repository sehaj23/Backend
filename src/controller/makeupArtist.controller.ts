import BaseController from "./base.controller";
import MakeupArtistService from "../service/makeupartist.service";
import { Request, Response } from "express";
import controllerErrorHandler from "../middleware/controller-error-handler.middleware";
import { MakeupArtistI } from "../interfaces/makeupArtist.interface";
import logger from "../utils/logger";
import ServiceI from "../interfaces/service.interface";
import mongoose from "../database";
import { EmployeeI } from "../interfaces/employee.interface";
import { EventMakeupArtistI } from "../interfaces/eventMakeupArtist.interface";
import { OfferI } from "../interfaces/offer.interface";

export default class MakeupArtistController extends BaseController {

    service: MakeupArtistService
    constructor(service: MakeupArtistService) {
        super(service)
        this.service = service
    }

    postMua = controllerErrorHandler(async (req: Request, res: Response) => {

        const ma: MakeupArtistI = req.body
     
        if(ma.vendor_id.length==0){
               //@ts-ignore
        ma.vendor_id = req.vendorId
        }
        console.log(ma)
        
        const makeupArtist = await this.service.postMua(ma)
        if (makeupArtist === null) {
            const errMsg = `salon not found`;
            logger.error(errMsg);
            res.status(400);
            res.send({ message: errMsg });
        }
        res.send(makeupArtist)

    })

    patchMakeupArtist = controllerErrorHandler(async (req: Request, res: Response) => {

        //TODO: validator    
        //@ts-ignore
        const vendor_id = req.vendorId
        const d = req.body
        const id = req.params.id

        if (!id) {
            const errMsg = "MakeupArtist ID not found"
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return

        }
        const makeupArtist = await this.service.patchMakeupArtist(id, vendor_id, d)
        if (makeupArtist === null) {
            const errMsg = `mua not found`;
            logger.error(errMsg);
            res.status(400);
            res.send({ message: errMsg });
        }
        res.send(makeupArtist)


    })
    makeupArtistSettings = controllerErrorHandler(async (req: Request, res: Response) => {
        //TODO:validator
        //TODO: Test this function

        //@ts-ignore
        const vendor_id = req.vendorId
        const updates = Object.keys(req.body)
        const allowedupates = ["name", "location", "start_working_hours"]
        const isvalid = updates.every((update) => allowedupates.includes(update))
        const update = req.body
        const makeupArtist_id = req.params.id

        if (!makeupArtist_id) {
            const errMsg = "MakeupArtist ID not found"
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return
        }

        if (!isvalid) {
            const errMsg = "Error updating MakeupArtist"
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return
        }
        const updatedMua = await this.service.makeupArtistSettings(makeupArtist_id, update, vendor_id)
        if (updatedMua === null) {
            const errMsg = `mua not found`;
            logger.error(errMsg);
            res.status(400);
            res.send({ message: errMsg });
        }
        res.send(updatedMua)
    })

    addMakeupArtistService = controllerErrorHandler(async (req: Request, res: Response) => {
        //TODO:validator

        const d: ServiceI = req.body.services
        const id = req.params.id
        //@ts-ignore
        const vendor_id = req.vendorId
        if (!id) {
            logger.error(`Mua Id is missing mua_id:`)
            res.status(403)
            res.send({ message: `Mua Id is missing mua_id:` })
            return
        }
        const muaService = await this.service.addMakeupArtistService(id, d)
        if (muaService === null) {
            const errMsg = `mua not found`;
            logger.error(errMsg);
            res.status(400);
            res.send({ message: errMsg });
        }
        res.send(muaService)


    })
    deleteMakeupArtistService = controllerErrorHandler(async (req: Request, res: Response) => {
        //TODO:validator

        const sid = req.params.sid
        const _id = req.params.id
        if (!_id || !sid) {
            logger.error(`mua Id is missing mua_id:  & mua_id: `)
            res.status(403)
            res.send({ message: `Mua Id is missing mua_id: ` })
            return
        }
        //@ts-ignore
        const vendor_id = req.vendorId
        const deleteMuaService = await this.service.deleteMakeupArtistService(_id, sid, vendor_id)

        if (deleteMuaService === null) {
            const errMsg = `Delete Service: no data with this _id and service was found`
            logger.error(errMsg)
            res.status(403)
            res.send({ message: errMsg })
            return
        }
        res.send(deleteMuaService)

    })
    getService = controllerErrorHandler(async (req: Request, res: Response) => {
        const id = req.params.id
        if (!id) {
            const errMsg = `id is missing from the params`
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return
        }
        //@ts-ignore
        const vendor_id = req.vendorId

        const muaService = await this.service.getService(id, vendor_id)
        if (muaService === null) {
            const errMsg = `no service found`
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return
        }
        res.send(muaService)


    })
    addMakeupArtistEmployee = controllerErrorHandler(async (req: Request, res: Response) => {
        //TODO:validator
        const d: EmployeeI = req.body
        const _id = req.params.id
        if (!_id) {
            const errMsg = `Add Emp: no data with this _id and service was found`
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return
        }
        const muaEmployee = await this.service.addMakeupArtistEmployee(d, _id)
        if (muaEmployee === null) {
            const errMsg = `Add Emp: no data with this _id and service was found`
            logger.error(errMsg)
            res.status(403)
            res.send({ message: errMsg })
            return
        }
        res.send(muaEmployee)
    })

    deleteMakeupArtistEmployee = controllerErrorHandler(async (req: Request, res: Response) => {
        //TODO:Validator
        const id = req.params.id
        const eid = req.params.eid

        if (!id || !eid) {
            const errMsg = `delete Emp: no data with this _id and service was found`
            logger.error(errMsg)
            res.status(403)
            res.send({ message: errMsg })
            return
        }
        const deleteMuaEmployee = await this.service.deleteMakeupArtistEmployee(id, eid)
        if (deleteMuaEmployee === null) {
            const errMsg = `delete Emp: no data with this _id and service was found`
            logger.error(errMsg)
            res.status(403)
            res.send({ message: errMsg })
            return
        }
        res.send(deleteMuaEmployee)
    })
    editMuaEmployee = controllerErrorHandler(async (req: Request, res: Response) => {
        const v = req.body
        const mua_id = req.params.id
        const emp_id = req.params.eid
        const emp = await this.service.editMuaEmployee(emp_id, v)
        if (emp == null) {
            const errMsg = `Error updating employee`
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return
        }
        res.send(emp)

    })

    updateService = controllerErrorHandler(async (req: Request, res: Response) => {
        //TODO:validator
        const d = req.body

        const id = req.params.id
        //id is salon id
        const sid = req.params.sid
        // const service = req.body
        if (!id || !sid) {
            logger.error(`sid and id not found`)
            res.status(403)
            res.send({ message: "SID and ID not found" })
        }

        // const mua = await Service.findByIdAndUpdate(sid,d,{new:true})
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

        const mua = await this.service.updateService(id, updates, sid, d)
        res.send(mua)

    })
    addMakeupArtistEvent = controllerErrorHandler(async (req: Request, res: Response) => {
        //TODO:Validator
        const data: EventMakeupArtistI = req.body
        if (!data.event_id || !data.makeup_artist_id) {
            logger.error(`not comeplete data Refer EventMakeupArtistI Interface. event_id: ${data.event_id} & makeup_artist_id: ${data.makeup_artist_id}`)
            res.status(400)
            res.send({ message: `not comeplete data Refer EventMakeupArtistI Interface. event_id: ${data.event_id} & makeup_artist_id: ${data.makeup_artist_id}` })
            return
        }
        const addmuaEvent = await this.service.addMakeupArtistEvent(data)
        if (addmuaEvent === null) {
            logger.error(`Not able to update event`)
            res.status(400)
            res.send({ message: `Not able to update event` })
            return
        }
        res.send(addmuaEvent)

    })
    deleteMakeupArtistEvent = controllerErrorHandler(async (req: Request, res: Response) => {
        //TODO:Validator
        const data: EventMakeupArtistI = req.body
        if (!data.event_id || !data.makeup_artist_id) {
            logger.error(`Not comeplete data Refer EventMakeupArtistI Interface. event_id: ${data.event_id} & makeup_artist_id: ${data.makeup_artist_id}`)
            res.status(400)
            res.send({ message: `not comeplete data Refer EventMakeupArtistI Interface. event_id: ${data.event_id} & makeup_artist_id: ${data.makeup_artist_id}` })
            return
        }
        const delmuaEvent = await this.service.deleteMakeupArtistEvent(data)
        if (delmuaEvent == null) {
            logger.error(`IDs do not match`)
            res.status(400)
            res.send({ message: `IDs do not match` })
            return
        }
        res.status(200)
        res.send(true)
    })

    createOffer =controllerErrorHandler( async (req: Request, res: Response) => {
        //TODO:validator
        const id = req.params.id
        const serviceId = req.params.sid || req.body.service_id
        if(!serviceId){
            const errMsg = `Service Id is missing`
            res.status(400)
            res.send({errMsg})
            return
        }
        const e: OfferI = req.body
        const mua= await this.service.createOffer(id,serviceId,e)
        if(mua==null){
            logger.error(`Not able to create offer`)
            res.status(400)
            res.send({ message: `Unable to create offer` })
            return
        }

    })

}