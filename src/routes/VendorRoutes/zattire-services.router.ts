import { Router } from "express";
import ZattireServiceController from "../../controller/zattire-service.controller"
import ZattireService from "../../service/zattire-service";
import zattireServiceModel from "../../models/zattire_services.model"
import VendorverifyToken from "../../middleware/VendorJwt";

const zattireServiceRouter =  Router()
const zs = new ZattireService(zattireServiceModel)
const zattireServiceController = new ZattireServiceController(zs)

zattireServiceRouter.get("/",VendorverifyToken,zattireServiceController.get)



export default zattireServiceRouter
