import { Router } from "express";
import ReportAppController from "../../controller/report-app.controller";
import ReportAppService from "../../service/report-app.service";
import ReportApp from "../../models/report-app.model";

const reportAppRouter = Router()
const reportAppService = new ReportAppService(ReportApp)
const reportAppController = new ReportAppController(reportAppService)

//TODO: validate the data before sending it the to DB 
reportAppRouter.post("/", reportAppController.post)

export default reportAppRouter