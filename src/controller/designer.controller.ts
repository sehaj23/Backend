import { Request, Response } from "express";
import { DesignersSI } from "../interfaces/designer.interface";
import EventDesignerI from "../interfaces/eventDesigner.model";
import controllerErrorHandler from "../middleware/controller-error-handler.middleware";
import DesignerService from "../service/designer.service";
import logger from "../utils/logger";
import BaseController from "./base.controller";

export default class DesignerController extends BaseController {

    service: DesignerService
    constructor(service: DesignerService) {
        super(service)
        this.service = service
    }

    postDesigner =controllerErrorHandler( async (req: Request, res: Response) => {
        const d:DesignersSI = req.body
               //@ts-ignore
        d.vendor_id= req.vendorId
        const designer =await this.service.postDesigner(d)
        res.status(201).send(designer)
    })

    addDesignerEvent =controllerErrorHandler( async (req: Request, res: Response) => {
        const d: EventDesignerI = req.body
        const designerEvent = await this.service.addDesignerEvent(d)
        if(designerEvent === null){
            logger.error(`Not able to update event`)
            res.status(400)
            res.send({ message: `Not able to update event: event_id  ${d.event_id}` })
            return
        }
        res.status(201).send(designerEvent)

    })

    deleteDesignerEvent =controllerErrorHandler( async (req: Request, res: Response) => {

        const d: EventDesignerI = req.body
        const designerEvent = await this.service.deleteDesignerEvent(d)
        if(designerEvent === null){
            logger.error(`Not able to update event`)
            res.status(400)
            res.send({ message: `Not able to update event: event_id  ${d.event_id}` })
            return
        }
        res.status(200).send(designerEvent)

    })
    patchDesigner =controllerErrorHandler( async (req: Request, res: Response) => {
        //TODO:Validator
        const id = req.params.id    
        //@ts-ignore
        const vendor_id = req.vendorId
        if (!id) {
            const errMsg = "Designer ID not found"
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return
        }
        const d = req.body
        const designer = this.service.patchDesigner(id,vendor_id,d)
        if(designer==null){
            logger.error(`Not able to update designer`)
            res.status(400)
            res.send({ message: `Not able to update designer` })
            return
        }
        res.status(200).send(designer)
    })

    designerSettings =controllerErrorHandler( async (req: Request, res: Response) => {
       //TODO:Validator
        //TODO:Test this functi
        const designer_id = req.params.id

        if (!designer_id) {
            const errMsg = "Designer ID not found"
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return
        }
        const updates = Object.keys(req.body)
        const update = req.body
        const allowedupates = ["designer_name", "brand_name", "location", "start_working_hours"]
        const isvalid = updates.every((update) => allowedupates.includes(update))
        
        
        //@ts-ignore
        const vendor_id = req.vendorId
        if (!isvalid) {
            const errMsg = "Error updating Designer"
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return
        }
        const designer = await this.service.designerSettings(designer_id,update,vendor_id)
        if(designer==null){
            logger.error(`Not able to update designer`)
            res.status(400)
            res.send({ message: `Not able to update designer` })
            return
        }

        res.status(200).send(designer)




    })

}