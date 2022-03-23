import controllerErrorHandler from "../middleware/controller-error-handler.middleware"
import PhotoService from "../service/photo.service"
import BaseController from "./base.controller"
import { Request, Response } from 'express';

export default class PhotoController extends BaseController {

    service:PhotoService
    constructor(service: PhotoService) {
        super(service)
       
    }
     updatePhoto =  controllerErrorHandler(async (req: Request, res: Response) => {
         const updatePhoto = await this.service.getPhotoAndUpdateUrl()
         res.send(updatePhoto)
     })

}