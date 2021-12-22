import { Router } from "express";
import LocationController from "../../controller/location.controller";
import verifyToken from "../../middleware/jwt";

import Location from "../../models/location.model";
import LocationService from "../../service/location.service";

const locationRouter = Router()
const locationService = new LocationService(Location)
const locationController = new LocationController(locationService)

locationRouter.put("/",verifyToken,locationController.put)
locationRouter.post("/",verifyToken,locationController.post)
locationRouter.get("/",verifyToken,locationController.get)
locationRouter.delete("/",verifyToken,locationController.delete)


export default locationRouter