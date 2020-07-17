import { Router, Request, Response } from "express";
import CONFIG from "../config";
import logger from "../utils/logger";

import Event from "../models/event.model";
import EventDesignerI from "../interfaces/eventDesigner.model";
import mongoose from "../database";
import BaseService from "./base.service";
import { DesignersI } from "../interfaces/designer.interface";

import { String } from "aws-sdk/clients/batch";


export default class DesignerService extends BaseService{
   
    vendorModel: mongoose.Model<any, any>
    eventModel: mongoose.Model<any, any>


    constructor(designermodel: mongoose.Model<any, any>, vendorModel: mongoose.Model<any, any>, eventModel: mongoose.Model<any, any>) {
        super(designermodel);
       
        this.vendorModel = vendorModel
        this.eventModel = eventModel

    }
    postDesigner = async (d:DesignersI,vendor_id) => {
            d.vendor_id=vendor_id
            const designer = await this.model.create(d)
            await this.vendorModel.findOneAndUpdate({_id:vendor_id}, {$push: {designers: designer._id}})
            return designer
      
    }


    //associating designers to events
    addDesignerEvent = async (d:EventDesignerI) => {
      
            
            const eventid= mongoose.Types.ObjectId(d.event_id)
            const designerId= mongoose.Types.ObjectId(d.designer_id)
            const designerEventReq =  this.eventModel.findOneAndUpdate({_id: eventid, designers: { $nin: [designerId] } }, {$push: {designers: designerId}}, {new: true})
            
            const newDesignerReq = this.model.findOneAndUpdate({_id: designerId, events: { $nin: [eventid] } }, {$push: {events: eventid}}, {new: true})
            const [designerEvent, newDesigner] = await Promise.all([designerEventReq, newDesignerReq])
            return {designerEvent,newDesigner}
      
    }

    deleteDesignerEvent = async (d: EventDesignerI) => {    
            const eventid= d.event_id
            const designerId= d.designer_id
            const designerEventReq =  this.eventModel.updateOne({_id: eventid, designers: { $in: [designerId] } }, { $pull: { "designers" : designerId}})
            const newDesignerReq = this.model.updateOne({_id: designerId, events: { $in: [eventid] }}, { $pull: { "events" : eventid}})     
            const [designerEvent, newDesigner] = await Promise.all([designerEventReq, newDesignerReq]) 
            return {designerEvent, newDesigner}
    }
    patchDesigner = async (id:string,vendor_id:string,d:any) => {
      

            const designer = await this.model.findOneAndUpdate({ _id: id, vendor_id: vendor_id }, d, { new: true })
            return designer

       
    }

    designerSettings = async (designer_id:string,updates:Array<String>,vendor_id:String) => {
      
       
            const designer = await this.model.findOne({_id:designer_id,vendor_id:vendor_id})
            updates.forEach((update) => {

                designer[update] = updates[update]

            })
            const updateddesigner = await designer.save()
            //const updatedesigner = await Designer.update({_id:designer_id},{$set:updates},{new:true})
            return updateddesigner



       


    }

    
}


