import { Router, Request, Response } from "express";
import CONFIG from "../config";
import logger from "../utils/logger";
import Event from "../models/event.model";
import EventDesignerI from "../interfaces/eventDesigner.model";
import mongoose from "../database";
import BaseService from "../service/base.service";
import { DesignersI } from "../interfaces/designer.interface";
import Vendor from "../models/vendor.model";
import Salon from "../models/salon.model";
import { SalonI } from "../interfaces/salon.interface";
import ServiceI from "../interfaces/service.interface";

import { EmployeeI } from "../interfaces/employee.interface";
import Employee from "../models/employees.model";
import Offer from "../models/offer.model";
import { vendorJWTVerification } from "../middleware/VendorJwt"
import { PhotoI } from "../interfaces/photo.interface";
import Photo from "../models/photo.model";



export default class SalonService extends BaseService {


    postSalon = async (vendorId:string,d:SalonI) => {
            const salon = await Salon.create(d)
            //@ts-ignore
            const _id = mongoose.Types.ObjectId(vendorId)
            await Vendor.findOneAndUpdate({ _id }, { $push: { salons: salon._id } })
            return salon  
    }

    patchSalon = async (id:string,vendor_id:string,d)=> {
            const salon = await Salon.findOneAndUpdate({ _id: id, vendor_id: vendor_id }, d, { new: true })
            return salon

      
    }

    salonSettings = async(salon_id:string,updates:Array<string>,vendor_id:string)=> {
         //TODO: Validate these in Validator.
         //TODO: Test this function
       
         const allowedupates = ["name", "location", "start_working_hours","insta_link","fb_link","end_working_hours"]
         const isvalid = updates.every((update) => allowedupates.includes(update))
         if (!isvalid) {
             const errMsg = "Error updating Salon"
             logger.error(errMsg)
            
             return
         }
            const salon = await Salon.findOne({_id:salon_id,vendor_id:vendor_id})
            updates.forEach((update) => {

                salon[update] = updates[update]

            })
            const updatedSalon = await salon.save()
            return updatedSalon

      
    }
    addSalonService = async (salon_id:string,vendor_id:string,d) => {
       
            const _id = mongoose.Types.ObjectId(salon_id)
            const newSalon = await Salon.findOneAndUpdate({_id,vendor_id}, { $push : {services  : {$each:d,$postion:0}}}, {new: true})
           return newSalon
       
    }
    deleteSalonService = async (_id:string,sid:string,vendor_id) => {
            const osid = mongoose.Types.ObjectId(sid)   
            const salon = await Salon.findOneAndUpdate({_id: _id,vendor_id:vendor_id}, { $pull: {services: { _id: osid }} }, { new: true })
            return salon
       
    }
    getService = async (id:string) => {
       
            const salonId = mongoose.Types.ObjectId(id)   
            const salon = await Salon.find({ _id: salonId}).select("services")
          
      
       
    }
    updateService = async (salonId:string,d,sid:string) => {
            const id = mongoose.Types.ObjectId(salonId)
            d._id =sid
            const salon  = await Salon.update({_id:id,"services._id": sid },{ "services.$":d },{new:true})      
            return salon

    }
    addSalonEmployee = async (d,_id:string) => {
        if(d.services){
            // @ts-ignore
          d.services = (d.services as string[]).map( (s: string, i: number) => mongoose.Types.ObjectId(s))
          }
            const emp = await Employee.create(d)
            const empId = mongoose.Types.ObjectId(emp._id)
            //@ts-ignore
            const newSalon = await Salon.findOneAndUpdate({_id, employees: {$nin: [empId]}}, { $push : {employees  : empId}}, {new: true}).populate("employees").exec()
            return newSalon
       
    }

    deleteSalonEmployee = async (_id:string,eid:string,vendorId:string) => {
    
            const emp = await Employee.findByIdAndDelete(eid)
            //@ts-ignore
            const newSalon = await Salon.findOneAndUpdate({_id,vendor_id:vendorId, employees: {$in: [eid]}}, { $pull : {employees  : eid}}, {new: true}).populate("employees").exec()
          
       
    }

    editSalonEmployee = async (v,salon_id:string,emp_id:string) => { 
            const emp = await Employee.findOneAndUpdate({_id:emp_id} , v, { new: true }).populate("services").exec()// to return the updated data do - returning: true
            return emp
       
    }

    putProfilePic = async (photoData:PhotoI,_id:string) => {
       
         
            // saving photos 
            const photo = await Photo.create(photoData)
            // adding it to event
            const newEvent = await this.model.findByIdAndUpdate({_id},  { profile_pic: photo._id }, { new: true }).populate("profile_pic").exec() // to return the updated data do - returning: true
            return newEvent
       
    }
    getOffer = async (id:string) => {
            const offers = await Offer.find({salon_id: id})
           return offers
    }

      //associating salons to events
      addSalonEvent = async (d) => {
       
        
            const eventid= mongoose.Types.ObjectId(d.event_id)
            const designerId= mongoose.Types.ObjectId(d.designer_id)
            const designerEventReq =  Event.findOneAndUpdate({_id: eventid, designers: { $nin: [designerId] } }, {$push: {designers: designerId}}, {new: true})
            
            const newSalonReq = Salon.findOneAndUpdate({_id: designerId, events: { $nin: [eventid] } }, {$push: {events: eventid}}, {new: true})
            const [designerEvent, newDesigner] = await Promise.all([designerEventReq, newSalonReq])
            return {designerEvent,newDesigner}
    
         
       
    }

   
}