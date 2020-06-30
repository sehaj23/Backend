import Salon from "../../models/salon.model";
import {
    Request,
    Response
} from "express";
import CONFIG from "../../config";
import BaseService from "./base.service";
import mongoose from "../../database";
import arePointsNear from "../../utils/location"

export default class SalonInfoService  {
    // constructor() {
    //     super(Salon)
    // }

    // Salon Info
    getSalonInfo = async (req: Request, res: Response) => {
        try {
            const salonId = req.params.id
            if (!salonId) return res.status(400).send({
                message: 'Id not provided'
            })
            const salon = await Salon.findById(salonId)
            if (!salon) return res.status(404).send({
                message: 'Salon not found'
            })
            res.status(200).send(salon)
        } catch (e) {
            res.status(500).send({
                message: `${CONFIG.RES_ERROR} ${e.message}`
            })
        }
    }

    //get Salons nearby
    getSalonNearby = async (req: Request, res: Response) => {
        try {
           var  centerPoint = { }
           var checkPoint = {}
           var salonLocation = new Array();
           //@ts-ignore
           centerPoint.lat  = req.query.latitude,
           //@ts-ignore
           centerPoint.lng = req.query.longitude  
            const km = req.query.km || 2;
            const salon = await Salon.find({})
           
            for (var a=0;a<salon.length;a++){
                if(salon[a].longitude != null && salon[a].latitude != null){
                    //@ts-ignore
                     checkPoint.lng = salon[a].longitude
                      //@ts-ignore
                     checkPoint.lat = salon[a].latitude
                   var n = await  arePointsNear(checkPoint,centerPoint,km)
                   if(n){
                   salonLocation.push(salon[a])
                   }
                } 
            }
            res.send(salonLocation);


        } catch (error) {          
            res.status(500).send({
                message: `${CONFIG.RES_ERROR} ${error.message}`
            
        })
        }
    }

}