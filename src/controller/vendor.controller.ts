import BaseController from "./base.controller"
import VendorService from "../service/vendor.service"



export default class EventController extends BaseController {

    service: VendorService
    constructor(service: VendorService) {
        super(service)
        this.service = service
    }

}