import BaseController from "./base.controller"
import EventService from "../service/event.service"



export default class EventController extends BaseController {

    service: EventService
    constructor(service: EventService) {
        super(service)
        this.service = service
    }

}