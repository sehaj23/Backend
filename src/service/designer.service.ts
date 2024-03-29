import { Router, Request, Response } from "express";
import CONFIG from "../config";
import logger from "../utils/logger";

import Event from "../models/event.model";
import EventDesignerI from "../interfaces/eventDesigner.model";
import mongoose from "../database";
import BaseService from "./base.service";
import { DesignersI } from "../interfaces/designer.interface";

import { String } from "aws-sdk/clients/batch";


export default class DesignerService extends BaseService {

        vendorModel: mongoose.Model<any, any>
        eventModel: mongoose.Model<any, any>


        constructor(designermodel: mongoose.Model<any, any>, vendorModel: mongoose.Model<any, any>, eventModel: mongoose.Model<any, any>) {
                super(designermodel);

                this.vendorModel = vendorModel
                this.eventModel = eventModel

        }
        postDesigner = async (d: DesignersI) => {
             
                const designer = await this.model.create(d)
                //@ts-ignore
                await this.vendorModel.findOneAndUpdate({ _id: d.vendor_id }, { $push: { designers: designer._id } })
                return designer

        }


        //associating designers to events
        addDesignerEvent = async (d: EventDesignerI) => {


                const eventid = mongoose.Types.ObjectId(d.event_id)
                const designerId = mongoose.Types.ObjectId(d.designer_id)
                //@ts-ignore
                const designerEventReq = this.eventModel.findOneAndUpdate({ _id: eventid, designers: { $nin: [designerId] } }, { $push: { designers: designerId } }, { new: true })
                //@ts-ignore
                const newDesignerReq = this.model.findOneAndUpdate({ _id: designerId, events: { $nin: [eventid] } }, { $push: { events: eventid } }, { new: true })
                const [designerEvent, newDesigner] = await Promise.all([designerEventReq, newDesignerReq])
                
                return designerEvent
        }

        deleteDesignerEvent = async (d: EventDesignerI) => {
                const eventid = d.event_id
                const designerId = d.designer_id
                //@ts-ignore
                const designerEventReq = this.eventModel.updateOne({ _id: eventid, designers: { $in: [designerId] } }, { $pull: { "designers": designerId } })
                //@ts-ignore
                const newDesignerReq = this.model.updateOne({ _id: designerId, events: { $in: [eventid] } }, { $pull: { "events": eventid } })
                const [designerEvent, newDesigner] = await Promise.all([designerEventReq, newDesignerReq])
                return { designerEvent, newDesigner }
        }
        patchDesigner = async (id: string, vendor_id: string, d: any) => {


                const designer = await this.model.findOneAndUpdate({ _id: id, vendor_id: vendor_id }, d, { new: true })
                return designer


        }

        designerSettings = async (designer_id: string, update: Array<String>, vendor_id: String) => {
                const designer = await this.model.findOneAndUpdate({ _id: designer_id, vendor_id: vendor_id },update,{new:true})
                
                //const updatedesigner = await Designer.update({_id:designer_id},{$set:updates},{new:true})
                return designer

        }


}


