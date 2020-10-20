import BaseController from "./base.controller";
import AdminService from "../service/admin.service";
import { Request, Response } from "express";
import controllerErrorHandler from "../middleware/controller-error-handler.middleware";
import encryptData from "../utils/password-hash";
import Admin from "../models/admin.model";


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
}
