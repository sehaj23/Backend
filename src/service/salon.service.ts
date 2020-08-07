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
import ReviewSI, { ReviewI } from "../interfaces/review.interface";



export default class SalonService extends BaseService {
        employeeModel: mongoose.Model<any, any>
        vendorModel: mongoose.Model<any, any>
        eventModel: mongoose.Model<any, any>
        offerModel: mongoose.Model<any, any>
        reviewModel: mongoose.Model<any, any>
        bookingModel: mongoose.Model<any, any>
        brandModel: mongoose.Model<any, any>


        // constructor(model: mongoose.Model<any, any>) {
        //     this.model = model
        //     this.modelName = model.modelName
        // }

        constructor(salonmodel: mongoose.Model<any, any>, employeeModel: mongoose.Model<any, any>, vendorModel: mongoose.Model<any, any>, eventModel: mongoose.Model<any, any>, offerModel: mongoose.Model<any, any>, reviewModel: mongoose.Model<any, any>, bookingModel: mongoose.Model<any, any>, brandModel: mongoose.Model<any, any>) {
                super(salonmodel);
                this.employeeModel = employeeModel
                this.vendorModel = vendorModel
                this.eventModel = eventModel
                this.offerModel = offerModel
                this.reviewModel = reviewModel
                this.bookingModel = bookingModel
                this.brandModel = brandModel
        }


        postSalon = async (vendorId: string, d: SalonI) => {
                const salon = await this.model.create(d)
                const _id = mongoose.Types.ObjectId(vendorId)
                //@ts-ignore
                await this.vendorModel.findOneAndUpdate({ _id }, { "$push": { "salons": salon._id } })
                return salon
        }

        patchSalon = async (id: string, vendor_id: string, d) => {
                const salon = await this.model.findOneAndUpdate({ _id: id, vendor_id: vendor_id }, d, { new: true })
                return salon
        }

        addSalonService = async (_id: string, d: any) => {
                //@ts-ignore
                const newSalon = await this.model.findOneAndUpdate({ _id }, { $push: { services: { $each: d, $postion: 0 } } }, { new: true })
                return newSalon

        }
        deleteSalonService = async (_id: string, sid) => {
                //@ts-ignore
                const salon = await this.model.findOneAndUpdate({ _id: _id }, { $pull: { services: { _id: sid } } }, { new: true })
                return salon

        }
        getService = async (id: string, filter: any) => {

                console.log(filter)

                const salon = await this.model.findOne({ _id: id, services: { $elemMatch: filter } }).select("services")
                return salon
        }
        // getService = async (id: string) => {
        //         return this.model.findById({ _id: id }).select("services")
        // }

        getServiceByServiceId = async (id: string) => this.model.findOne({ "services._id": id })

        getServicesByServiceIds = async (ids: string[]) => this.model.find({ "services._id": ids })

        // TEST IT
        getServiceByOptionId = async (id: string) => this.model.findOne({ "services.*.options._id": id })

        // TEST IT
        getServicesByOptionIds = async (ids: string[]) => this.model.find({ "services.*.options._id": ids })

        updateService = async (salonId: string, d, sid: string) => {

                d._id = sid
                const salon = await this.model.findOneAndUpdate({ _id: salonId, "services._id": sid }, { "services.$": d }, { new: true })
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

        getSalonEmployeeById = async (id: string) => this.model.findOne({ "employees": id })
        getSalonEmployeesByIds = async (ids: string[]) => this.model.find({ "employees": ids })

        deleteSalonEmployee = async (_id: string, eid: string, vendorId: string) => {

                const emp = await this.employeeModel.findByIdAndDelete(eid)
                // console.log(emp)
                //@ts-ignore
                const newSalon = await Salon.findOneAndUpdate({ _id: _id, vendor_id: vendorId }, { $pull: { employees: eid } }, { new: true }).populate("employees").exec()
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
                //@ts-ignore
                const designerEventReq = this.eventModel.findOneAndUpdate({ _id: eventid, designers: { $nin: [designerId] } }, { $push: { designers: designerId } }, { new: true })
                //@ts-ignore
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
                //@ts-ignore
                const salon = await this.model.findOneAndUpdate({ _id: salon_id, "services._id": serviceId }, { $push: { "services.$.offers": offerId } }, { new: true })
                return offer

        }
        getSalonInfo = async (salonId: string) => {
                const salon = await this.model.findById(salonId)
                return salon

        }

        // Salon Rating-Wise  Recommended.
        getSalon = async () => {
                //TODO: send salon with rating 5
                const salons = await this.model.find().sort([['rating', -1], ['createdAt', -1]])
                //@ts-ignore
                //   for (let [key, value] of Object.entries(salons)) data.push(value.name)
                return salons

        }
        getHomeServiceSalon = async (centerPoint: any, km: string) => {
                var checkPoint = {}
                var salonLocation = new Array()
                const salon = await this.model.find({ "services": { $elemMatch: { at_home: true } } })
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
                //@ts-ignore
                //   for (let [key, value] of Object.entries(salons)) data.push(value.name)
                return salonLocation

        }

        // Sort salon : rating-wise
        // getSalonsRw = async (rating: any, data: any) => {
        //         const salons = await this.model.find({})

        //         const val1 = rating === 'asc' ? -1 : 1
        //         const val2 = -val1
        //         for (let [key, value] of Object.entries(salons)) data.push(value)
        //         data.sort((a, b) => (a.rating < b.rating ? val1 : val2))
        //         return data


        // }

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


        getSalonCategories = async (_id: string, data: any) => {
                const categories = await this.model.findOne({ _id: _id })
                //@ts-ignore
                for (let [key, value] of Object.entries(categories.services)) data.push(value.category)
                return data


        }

        getSalonReviews = async (_id: string, q: any) => {
                const pageNumber: number = parseInt(q.page_number || 1)
                let pageLength: number = parseInt(q.page_length || 10)
                pageLength = (pageLength > 100) ? 100 : pageLength
                const skipCount = (pageNumber - 1) * pageLength
                const reviewsAll = this.reviewModel.find({ salon_id: _id }).skip(skipCount).limit(pageLength).sort('-createdAt').populate("user_id")
                const reviewsPage = this.reviewModel.find({ salon_id: _id }).count();

                const [reviews, pageNo] = await Promise.all([reviewsAll, reviewsPage])
                const totalPages = Math.ceil(pageNo / pageLength)
                return { reviews, totalPages, pageNumber }
        }


        postReviews = async (post: ReviewI) => {
                const reviews = await this.reviewModel.create(post)
                return reviews
        }
        checkpostReview = async (userId: string, salon_id: string) => {
                const check = await this.bookingModel.find({ user_id: userId, salon_id: salon_id, status: "Completed" })
                return check
        }

        getBrand = async () => {
                const brand = await this.brandModel.find({})
                return brand

        }

        getBrandbyId = async (id: string) => {
                const brand = await this.brandModel.findOne({ _id: id }).populate("salon_id").exec()
                return brand
        }

        addBrand = async (d: any) => {
                const brand = await this.brandModel.create(d)
                return brand
        }

        searchFilter = async (q:any) => {

       
                // if(!q.makeup_artist_id && !q.designer_id && !q.salon_id){
                //     const message = 'None id provided'
                //     res.status(400)
                //     res.send({message})
                //     return
                // }
        
                // pagination
                const pageNumber: number = parseInt( q.page_number || 1)
                let pageLength: number = parseInt(q.page_length || 25)
                pageLength = (pageLength > 100) ? 100 : pageLength
                const skipCount = (pageNumber - 1) * pageLength
                console.log(pageLength)
                console.log(skipCount)
                
                const keys = Object.keys(q)
                const filters = {}
                
                for (const k of keys) {
                    switch(k){
                        case "end_price":
                            filters["end_price"] = {
                               $lt:q[k],
                        
                            } 
                            break
                        case "start_price":
                                filters["start_price"] = {
                                   $gt:q[k],
                            
                                } 
                            break
                        case "gender":
                                filters["services"]={
                                        $elemMatch:{"options.gender" :q[k]}

                                }    
                                break
                        case "brand":
                                filters["brand"]= q[k]
                                break
                        case "when":
                                filters["start_working_hours"]={
                                        
                                }
                                
                        case "page_number":
                        case "page_length":
                            break
                        default:
                            filters[k] = q[k]
                    }
                }
              
                console.log(filters);
            
                
               
                    const salonFilter =  this.model.find(filters).skip(skipCount).limit(pageLength)
                    const salonPagesReq = this.model.count(filters)
                    
                    const [salonDetails,  salonPages] = await Promise.all([salonFilter,salonPagesReq])
                    const totalPages = Math.ceil(salonPages / pageLength)
                    return ({salonDetails, totalPages, currentPage: pageNumber})
                  
        
            }


}