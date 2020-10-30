import EventService from "../service/event.service"
import BaseController from "./base.controller"



export default class EventController extends BaseController {

    service: EventService
    constructor(service: EventService) {
        super(service)
        this.service = service
    }

}