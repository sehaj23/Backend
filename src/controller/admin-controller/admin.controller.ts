import BaseController from "../base.controller";
import AdminService from "../../service/AdminService/admin.service";
import { Request, Response } from "express";
import controllerErrorHandler from "../../middleware/controller-error-handler.middleware";
import encryptData from "../../utils/password-hash";
import Admin from "../../models/admin.model";


export default class AdminController extends BaseController{

    service: AdminService
    constructor(service: AdminService){
        super(service)
        this.service = service
    }

    login = controllerErrorHandler((req: Request, res: Response) => {
        const password = encryptData(req.body.password)
        const user = this.service.login(req.body.username, password)

        if(user == null){
            res.status(400).send({message: "Username and password does not match"})
        }
    })
}
