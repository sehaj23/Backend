import { Router, Request, Response } from "express";
import CONFIG from "../../config";
import logger from "../../utils/logger";
import Designer from "../../models/designers.model";
import Event from "../../models/event.model";
import EventDesignerI from "../../interfaces/eventDesigner.model";
import mongoose from "../../database";
import BaseService from "./base.service";
import { DesignersI } from "../../interfaces/designer.interface";
import Vendor from "../../models/vendor.model";

export default class DesignerService extends BaseService{

    constructor(){
        super(Designer)
    }

    post = async (req: Request, res: Response) => {
        try {
            const d: DesignersI = req.body
            const designer = await Designer.create(d)
            const _id = designer.vendor_id
            await Vendor.findOneAndUpdate({_id}, {$push: {designers: designer._id}})
            res.send(designer)
        } catch (e) {
            logger.error(`${e.message}`)
            res.status(400)
            res.send({ message: `${CONFIG.RES_ERROR} ${e.message}` })
            
        }
    }
    DesignerSettings= async (req: Request, res: Response) => {
        try {
           const designer_id = req.params.id
          
           if(!designer_id){
            const errMsg = "Designer ID not found"
            logger.error(errMsg)
            res.status(400)
            res.send({message: errMsg})
            return
        }
    const updates = Object.keys(req.body)
    const allowedupates =["designer_name","brand_name","location","start_working_hours"]
    const isvalid = updates.every((update)=>allowedupates.includes(update))
       
           
         
         if(!isvalid){
            const errMsg = "Error updating Designer"
            logger.error(errMsg)
            res.status(400)
            res.send({message: errMsg})
            return
        }
        const designer  = await  Designer.findById(designer_id)
        updates.forEach((update)=>{
            
            designer[update] = req.body[update]
            
        })
        const updateddesigner = await designer.save()
        //const updatedesigner = await Designer.update({_id:designer_id},{$set:updates},{new:true})
        res.send(updateddesigner)

        
            
        } catch (error) {
            const errMsg = "Error updating Designer"
            logger.error(errMsg)
            res.status(400)
            res.send({message: errMsg})
            return
            
        }


    }
}