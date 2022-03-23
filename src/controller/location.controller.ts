import controllerErrorHandler from "../middleware/controller-error-handler.middleware";
import LocationService from "../service/location.service";
import BaseController from "./base.controller";
import { Request, Response } from "express"
export default class LocationController extends BaseController {

    locationService: LocationService
    constructor(locationService: LocationService){
        super(locationService)
        this.locationService = locationService
    }

    getCities = controllerErrorHandler( async (req: Request, res: Response) => {
        const city = await this.locationService.get({})
        let cities = []
        city.map((e)=>{
            if(e.city != null && e.city !="" && e.city != " "){
            cities.push(e.city)
            }
           
        })
        res.status(200).send({cities})
    })
    getSubAreaByCities = controllerErrorHandler( async (req: Request, res: Response) => {
        if(!req.query.city){
            return res.status(400).send({message:"send city in query"})
        }
        const city = await this.locationService.get({city:req.query.city})
        let subarea = []
        city.map((e)=>{
            subarea.push(e.city)
           
        })
        res.status(200).send({subarea})
    })
 
 
}