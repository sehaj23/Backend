import { Router } from "express";
import verifyToken from "../../middleware/jwt";
import ZattireServiceController from "../../controller/zattire-service.controller"
import ZattireService from "../../service/zattire-service";
import zattireServiceModel from "../../models/zattire_services.model"

const zattireServiceRouter =  Router()
const zs = new ZattireService(zattireServiceModel)
const zattireServiceController = new ZattireServiceController(zs)
zattireServiceRouter.post("/",verifyToken,zattireServiceController.post)
zattireServiceRouter.get("/",verifyToken,zattireServiceController.get)
zattireServiceRouter.get("/info/:id",verifyToken,zattireServiceController.getId)
zattireServiceRouter.put("/:id",verifyToken,zattireServiceController.put)
zattireServiceRouter.put("/service/:id",verifyToken,zattireServiceController.addService)
zattireServiceRouter.delete("/service/:cid/:sid",verifyToken,zattireServiceController.deleteServiceFromCategory)
zattireServiceRouter.patch("/service/:cid/:sid",verifyToken,zattireServiceController.editServiceFromCategory)
zattireServiceRouter.get("/search",verifyToken,zattireServiceController.searchByServiceName)




export default zattireServiceRouter
