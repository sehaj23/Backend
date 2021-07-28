import { Request, Response } from "express";
import controllerErrorHandler from "../middleware/controller-error-handler.middleware";
import AdminService from "../service/admin.service";
import logger from "../utils/logger";
import BaseController from "./base.controller";


export default class AdminController extends BaseController{

    service: AdminService
    constructor(service: AdminService){
        super(service)
        this.service = service
    }

    login = controllerErrorHandler(async(req: Request, res: Response) => {
        console.log(req.body)
        const user = await this.service.login(req.body.username, req.body.password)
        console.log(user)
        if(user === null){
            res.status(400).send({message: "Username and password does not match"})
            return
        }
        res.send(user)
    })

    updateFCM = controllerErrorHandler(async (req: Request, res: Response) => {
        //@ts-ignore
        const id =  req.userId
        const fcm = req.body.fcm_token
        const user = await this.service.updateFCM(id, fcm)
        if (user == null) {
            logger.error(`Unable to fetch info. Please Login again`)
            res.status(400)
            res.send({ message: `Unable to fetch info. Please Login again` })
            return
        }
        res.send(user)
    })

    deleteFcm = controllerErrorHandler(async (req: Request, res: Response) => {
        //@ts-ignore
        const id =  req.userId
        const fcm = req.body.fcm_token
        const user = await this.service.deleteFCM(id, fcm)
        if (user == null) {
            logger.error(`Unable to fetch info. Please Login again`)
            res.status(400)
            res.send({ message: `Unable to fetch info. Please Login again` })
            return
        }
        res.send(user)
    })

    
}
