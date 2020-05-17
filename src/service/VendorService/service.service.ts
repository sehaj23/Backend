import { Router, Request, Response } from "express";
import CONFIG from "../../config";
import logger from "../../utils/logger";
import { ServiceSI } from "../../interfaces/service.interface";
import mongoose from "../../database";

import Service from "../../models/service.model";
import BaseService from "./base.service";
import Salon from "../../models/salon.model";
import Mua from "../../models/makeupArtist.model";
const service = Router()

export default class ServiceServices {

    createService = async (req: Request, res: Response) => {
        try {
            const v: ServiceSI = req.body
            if (!v.name || !v.price || !v.duration) {
                res.status(403)
                res.send({ message: "Send all data" })
                return
            }
            const service = await Service.create(v)
            const service_id = service._id


            if (req.body.salon_id) {
                const id = mongoose.Types.ObjectId(req.body.salon_id)

        
           const services = req.body.services
          if(req.body.salon_id){
       
           const result =   services.map(function(el){
            var id = Object.assign({},el);
            id.salon_id = req.body.salon_id
            return id;
   


          
           })
           const service = await Service.create(result)
           res.send(service)
        }
        if(req.body.mua_id){
       
            const result =   services.map(function(el){
             var id = Object.assign({},el);
             id.mua_id = req.body.mua_id
             return id;
    
 
 
           
            })
            const service = await Service.create(result)
            res.send(service)
            
         }

       
         

           
            


            //  if (salon_id) {
                

              
            //     })
            //     console.log(result)

            
                // const service_id = service._id
                // const id = mongoose.Types.ObjectId(req.body.salon_id)


                //  await Salon.findByIdAndUpdate({ _id: id }, { $push: { services: service_id } })

             
            //  if (req.body.mua_id) {
            //      const id = mongoose.Types.ObjectId(req.body.mua_id)


            //    await Mua.findByIdAndUpdate({ _id: id }, { $push: { services: service_id } })

            // }

         
           

                await Salon.findByIdAndUpdate({ _id: id }, { $push: { services: service_id } })

            }
            if (req.body.mua_id) {
                const id = mongoose.Types.ObjectId(req.body.mua_id)


                await Mua.findByIdAndUpdate({ _id: id }, { $push: { services: service_id } })

            }


            res.send(service)


        } catch (e) {
            const errMsg = `Unable to Create Service`
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
        }

    }
    getService = async (req: Request, res: Response) => {
        try {

            const service = await Service.find().populate("photos").populate("salons").populate("makeup_artists").exec()
            res.send(service)



        } catch (e) {
            const errMsg = `Unable to fetch Service`
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
        }

    }
    updateService = async (req: Request, res: Response) => {
        try {
            const v: ServiceSI = req.body
            const _id = req.params.id
            const ser = await Service.findByIdAndUpdate({ _id }, v, { new: true, runValidators: true }).populate("photos").populate("salons").populate("makeup_artists").exec()
            if (!ser) {
                const errMsg = `Unable to Edit Service`
                logger.error(errMsg)
                res.status(400)
                res.send({ message: errMsg })


            }
            res.send(ser)

        } catch (e) {
            const errMsg = `Unable to Edit Service`
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
        }

    }
    deleteService = async (req: Request, res: Response) => {
        try {
            const _id = req.params.id
            const ser = await Service.findByIdAndDelete(_id)
            if (!ser) {
                const errMsg = `Unable to Find Service`
                logger.error(errMsg)
                res.status(400)
                res.send({ message: errMsg })

            }
            res.send(ser)



        } catch (e) {
            const errMsg = `Unable to delete Service`
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
        }
    }
}