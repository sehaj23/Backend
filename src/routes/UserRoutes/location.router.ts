
import { Router } from "express"
import LocationController from "../../controller/location.controller"
import LocationService from "../../service/location.service"
import Location from "../../models/location.model"


const LocationRouter = Router()
const locationService = new LocationService(Location)
const locationController = new LocationController(locationService)



LocationRouter.get("/cities",locationController.getCities)
LocationRouter.get("/subarea",locationController.getSubAreaByCities)


export default LocationRouter