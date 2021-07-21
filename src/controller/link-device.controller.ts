import { Request, Response } from "express";
import controllerErrorHandler from "../middleware/controller-error-handler.middleware";
import LinkDeviceService from "../service/link-device.service";
import logger from "../utils/logger";
import BaseController from "./base.controller";


export default class LinkDeviceController extends BaseController{

    service: LinkDeviceService
    constructor(service:LinkDeviceService){
        super(service)
        this.service = service
    }

    addCount = controllerErrorHandler(
        async (req: Request, res: Response) => {
            const device =  req.body.device
            const deviceLink =  await this.service.getOne({name:"devices"})
            if(device=="ios"){
                deviceLink.ios =  deviceLink.ios +1
            }else if(device=="android"){
                deviceLink.android=  deviceLink.android +1
            }
            await deviceLink.save()
            return res.status(200).send({success:true})
        

        })

}