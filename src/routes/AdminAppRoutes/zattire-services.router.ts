import { Router } from "express";
import ZattireServiceController from "../../controller/zattire-service.controller";
import verifyToken from "../../middleware/jwt";
import zattireServiceModel from "../../models/zattire_services.model";
import ZattireService from "../../service/zattire-service";

const zattireServiceRouter = Router()
const zs = new ZattireService(zattireServiceModel)
const zattireServiceController = new ZattireServiceController(zs)
zattireServiceRouter.post("/", verifyToken, zattireServiceController.post)
zattireServiceRouter.get("/", verifyToken, zattireServiceController.get)
/**
 * @swagger
 * /api/zattire-services/categories:
 *  get:
 *      summary: Get the list services offered by zattire
 *      tags: [Admin]
 *      description: Get the list services offered by zattire
 *      responses:
 *          default:
 *              description: Zattire services
 */
zattireServiceRouter.get("/categories", verifyToken, zattireServiceController.getCategories)
zattireServiceRouter.get("/info/:id", verifyToken, zattireServiceController.getById)
zattireServiceRouter.put("/:id", verifyToken, zattireServiceController.put)
zattireServiceRouter.put("/service/:id", verifyToken, zattireServiceController.addService)
zattireServiceRouter.delete("/service/:cid/:sid", verifyToken, zattireServiceController.deleteServiceFromCategory)
zattireServiceRouter.patch("/service/:cid/:sid", verifyToken, zattireServiceController.editServiceFromCategory)
zattireServiceRouter.get("/search", verifyToken, zattireServiceController.searchByServiceName)
zattireServiceRouter.get("/service/:id", verifyToken, zattireServiceController.getbyServiceID)
zattireServiceRouter.delete("/:id", verifyToken, zattireServiceController.delete)




export default zattireServiceRouter
