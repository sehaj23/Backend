import LocationService from "../service/location.service";
import BaseController from "./base.controller";

export default class LocationController extends BaseController {

    locationService: LocationService
    constructor(locationService: LocationService){
        super(locationService)
        this.locationService = locationService
    }

}