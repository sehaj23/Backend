import { Router } from "express"
import ReportsSalonController from "../../controller/salon-reports.controller"
import verifyToken from "../../middleware/jwt"
import ReportSalon from "../../models/reportSalon.model"
import ReportsSalonService from "../../service/salon-reports.service"



const reportsSalonRouter = Router()
const reportsSalonService =  new ReportsSalonService(ReportSalon)
const reportsSalonController = new ReportsSalonController(reportsSalonService)


reportsSalonRouter.get("/:id",verifyToken, reportsSalonController.getId)
reportsSalonRouter.get("/salon/:id",verifyToken,reportsSalonController.getSalonReport)

export default reportsSalonRouter