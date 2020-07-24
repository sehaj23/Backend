import { Router, Request, Response } from "express";
import CONFIG from "../config";
import logger from "../utils/logger";

import EventDesignerI from "../interfaces/eventDesigner.model";
import mongoose from "../database";
import BaseService from "../service/base.service";
import { DesignersI } from "../interfaces/designer.interface";
import { SalonI } from "../interfaces/salon.interface";
import ServiceI from "../interfaces/service.interface";
import { EmployeeI } from "../interfaces/employee.interface";
import Offer from "../models/offer.model";
import { vendorJWTVerification } from "../middleware/VendorJwt"
import { PhotoI } from "../interfaces/photo.interface";
import Photo from "../models/photo.model";
import { Model } from "mongoose";
import { OfferI } from "../interfaces/offer.interface";
import { arePointsNear } from "../utils/location";



export default class SalonService extends BaseService {
        employeeModel: mongoose.Model<any, any>
        vendorModel: mongoose.Model<any, any>
        eventModel: mongoose.Model<any, any>
        offerModel: mongoose.Model<any, any>

        // constructor(model: mongoose.Model<any, any>) {
        //     this.model = model
        //     this.modelName = model.modelName
        // }

        constructor(salonmodel: mongoose.Model<any, any>, employeeModel: mongoose.Model<any, any>, vendorModel: mongoose.Model<any, any>, eventModel: mongoose.Model<any, any>, offerModel: mongoose.Model<any, any>) {
                super(salonmodel);
                this.employeeModel = employeeModel
                this.vendorModel = vendorModel
                this.eventModel = eventModel
                this.offerModel = offerModel
        }


        postSalon = async (vendorId: string, d: SalonI) => {
                const salon = await this.model.create(d)
                //@ts-ignore
                const _id = mongoose.Types.ObjectId(vendorId)
                await this.vendorModel.findOneAndUpdate({ _id }, { $push: { salons: salon._id } })
                return salon
        }

        patchSalon = async (id: string, vendor_id: string, d) => {
                const salon = await this.model.findOneAndUpdate({ _id: id, vendor_id: vendor_id }, d, { new: true })
                return salon
        }

        addSalonService = async (_id: string, vendor_id: string, d) => {

                const newSalon = await this.model.findOneAndUpdate({ _id, vendor_id }, { $push: { services: { $each: d, $postion: 0 } } }, { new: true })
                return newSalon

        }
        deleteSalonService = async (_id: string, sid: string, vendor_id) => {
               
                const salon = await this.model.findOneAndUpdate({ _id: _id, vendor_id: vendor_id }, { $pull: { services: { _id: sid } } }, { new: true })
                return salon

        }
        getService = async (id: string) => {
                
                const salon = await this.model.find({ _id: id }).select("services")
                return salon
        }
        updateService = async (salonId: string, d, sid: string) => {
                
                d._id = sid
                const salon = await this.model.update({ _id: salonId, "services._id": sid }, { "services.$": d }, { new: true })
                return salon

        }
        addSalonEmployee = async (d: EmployeeI, _id: string) => {
                if (d.services) {
                        // @ts-ignore
                        d.services = (d.services as string[]).map((s: string, i: number) => mongoose.Types.ObjectId(s))
                }
                const emp = await this.employeeModel.create(d)
                const empId = mongoose.Types.ObjectId(emp._id)
                //@ts-ignore
                const newSalon = await this.model.findOneAndUpdate({ _id, employees: { $nin: [empId] } }, { $push: { employees: empId } }, { new: true }).populate("employees").exec()
                return newSalon

        }

        deleteSalonEmployee = async (_id: string, eid: string, vendorId: string) => {
                
                const emp = await this.employeeModel.findByIdAndDelete(eid)
               // console.log(emp)
                //@ts-ignore
                const newSalon = await Salon.findOneAndUpdate({ _id:_id, vendor_id: vendorId }, { $pull: { employees: eid } }, { new: true }).populate("employees").exec()
              //  const salon = await this.model.findOneAndUpdate({ _id: _id, vendor_id: vendorId }, { $pull: { services: { _id: sid } } }, { new: true })
               
                return emp


        }

        editSalonEmployee = async (v, salon_id: string, emp_id: string) => {
                //TODO:check if employee exist in salon
                const emp = await this.employeeModel.findOneAndUpdate({ _id: emp_id }, v, { new: true }).populate("services").exec()// to return the updated data do - returning: true
                return emp

        }


        getOffer = async (id: string) => {
                const offers = await this.offerModel.find({ salon_id: id })
                return offers
        }

        //associating salons to events
        addSalonEvent = async (d) => {
                const eventid = mongoose.Types.ObjectId(d.event_id)
                const designerId = mongoose.Types.ObjectId(d.designer_id)
                const designerEventReq = this.eventModel.findOneAndUpdate({ _id: eventid, designers: { $nin: [designerId] } }, { $push: { designers: designerId } }, { new: true })
                const newSalonReq = this.model.findOneAndUpdate({ _id: designerId, events: { $nin: [eventid] } }, { $push: { events: eventid } }, { new: true })
                const [designerEvent, newDesigner] = await Promise.all([designerEventReq, newSalonReq])
                return { designerEvent, newDesigner }


        }
        createOffer = async (salon_id: string, serviceId: string, e: any) => {

                const service = await this.model.findOne({ _id: salon_id, "services._id": serviceId })
                const uniquecode = (service.name).slice(0, 4).toLocaleUpperCase().concat(e.updated_price.toLocaleString())
                e.unique_code = uniquecode
                const offer = await this.offerModel.create(e)
                const offerId = offer._id
                const salon = await this.model.findOneAndUpdate({ _id: salon_id, "services._id": serviceId }, { $push: { "services.$.offers": offerId } }, { new: true })

                return salon

        }
        getSalonInfo = async (salonId: string) => {
                const salon = await this.model.findById(salonId)
                return salon

        }

        // Salon names
        getSalonNames = async (data: any) => {
                const salons = await this.model.find()
                //@ts-ignore
                for (let [key, value] of Object.entries(salons)) data.push(value.name)
                return data

        }

        // Sort salon : rating-wise
        getSalonsRw = async (rating: any, data: any) => {


                const salons = await this.model.find({})


                const val1 = rating === 'asc' ? -1 : 1
                const val2 = -val1
                for (let [key, value] of Object.entries(salons)) data.push(value)
                data.sort((a, b) => (a.rating < b.rating ? val1 : val2))
                return data


        }

        // Search by salon/location/service
        getSearchResult = async (phrase: string) => {

                const data = await this.model.find(
                        { $text: { $search: phrase } },
                        { score: { $meta: 'textScore' } }
                ).sort({ score: { $meta: 'textScore' } })
                return data

        }

        //get Salons nearby
        getSalonNearby = async (centerPoint: any, km: string) => {
                var checkPoint = {}
                var salonLocation = new Array()

                const salon = await this.model.find()
                for (var a = 0; a < salon.length; a++) {
                        if (salon[a].longitude != null && salon[a].latitude != null) {
                                //@ts-ignore
                                checkPoint.lng = salon[a].longitude
                                //@ts-ignore
                                checkPoint.lat = salon[a].latitude
                                var n = await arePointsNear(checkPoint, centerPoint, km)
                                if (n.bool) {
                                        salonLocation.push(salon[a])
                                }
                        }
                }
                return salonLocation

        }
        //get salon distancewise
        getSalonDistance = async (centerPoint: any, km: string) => {

                var checkPoint = {}
                var salonLocation = new Array()

                //@ts-ignore
                centerPoint.lat = req.query.latitude
                //@ts-ignore
                centerPoint.lng = req.query.longitude

                const salon = await this.model.find({}).lean()
                for (var a = 0; a < salon.length; a++) {
                        if (salon[a].longitude != null && salon[a].latitude != null) {
                                //@ts-ignore
                                checkPoint.lng = salon[a].longitude
                                //@ts-ignore
                                checkPoint.lat = salon[a].latitude
                                var n = await arePointsNear(checkPoint, centerPoint, km)
                                if (n.bool) {
                                        const s = salon[a]
                                        // @ts-ignore
                                        s.difference = n.difference
                                        salon[a] = s
                                        //@ts-ignore
                                        salonLocation.push(salon[a])
                                }
                        }
                }
                salonLocation.sort((a, b) => {
                        if (a.difference < b.difference) return -1
                        else if (a.difference > b.difference) return 1
                        return 0
                })
                return salonLocation

        }



}