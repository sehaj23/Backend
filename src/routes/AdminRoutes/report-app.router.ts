import { Router } from "express";
import ReportAppController from "../../controller/report-app.controller";
import ReportAppService from "../../service/report-app.service";
import ReportApp from "../../models/report-app.model";

const reportAppRouter = Router()
const reportAppService = new ReportAppService(ReportApp)
const reportAppController = new ReportAppController(reportAppService)

//TODO: validate the data before sending it the to DB 
reportAppRouter.get("/", reportAppController.get)
reportAppRouter.get("/:id", reportAppController.getId)

export default reportAppRouter