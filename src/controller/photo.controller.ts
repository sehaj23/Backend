import PhotoService from "../service/photo.service"
import BaseController from "./base.controller"


export default class PhotoController extends BaseController {

    service:PhotoService
    constructor(service: PhotoService) {
        super(service)
       
    }

}