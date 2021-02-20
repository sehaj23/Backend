import ReportsSalonService from "../service/salon-reports.service"
import BaseController from "./base.controller"

export default class ReportsSalonController extends BaseController{
    service: ReportsSalonService
    constructor(service: ReportsSalonService) {
        super(service)
        this.service = service
    }
}