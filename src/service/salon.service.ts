import { Router, Request, Response } from "express";
import CONFIG from "../config";
import logger from "../utils/logger";

import EventDesignerI from "../interfaces/eventDesigner.model";
import mongoose from "../database";
import BaseService from "../service/base.service";
import { DesignersI } from "../interfaces/designer.interface";
import SalonSI, { SalonI } from "../interfaces/salon.interface";
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
import moment = require("moment");
import OptionI from "../interfaces/options.interface";



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

        addSalonService = async (_id: string, da: any) => {
                const salon = await this.model.findOne({ _id }) as SalonSI
                if (salon === null) throw new Error("Salon not found")
                console.log("data", da)
                const data = da.services as any[]
                for (let di = 0; di < data.length; di++) {
                        const gotService = data[di]
                        let categoryFound = -1
                        let serviceFound = -1
                        for (let i = 0; i < salon.services.length; i++) {
                                const service = salon.services[i]
                                console.log("service.category", service.category)
                                console.log("da.category_name", da.category_name)
                                if (service.category === da.category_name) {
                                        categoryFound = i
                                        console.log("gotService.service_name", gotService.service_name)
                                        console.log("service.name", service.name)
                                        if (gotService.service_name === service.name) {
                                                serviceFound = i
                                                if (gotService.service_checked === false) {
                                                        console.log(`Deleting the service at ${i} ${service.name}`)
                                                        salon.services = salon.services.splice(i, 0)
                                                        break
                                                }
                                                // if service is checked
                                                console.log("Changing the location of the options")
                                                for (let opts of service.options) {
                                                        opts.at_home = gotService.service_loaction === "Home Only" ? true : false
                                                }
                                                console.log("Adding/ updating options")
                                                for (let gotOpt of gotService.options) {
                                                        let found = false
                                                        let menFound = -1
                                                        let womenFound = -1
                                                        for (let o = 0; o < service.options.length; o++) {
                                                                const opt = service.options[o]
                                                                console.log("opt.option_name", opt.option_name)
                                                                console.log("gotOpt.option_name", gotOpt.option_name)
                                                                if (opt.option_name === gotOpt.option_name) {
                                                                        found = true
                                                                        if (gotOpt.option_checked === false) {
                                                                                service.options = service.options.splice(o, 1)
                                                                        }else{

                                                                                opt.at_home = gotOpt.option_service_location === "Home Only" ? true : false
                                                                                if (opt.gender === "men") {
                                                                                        opt.duration = gotOpt.option_men_duration
                                                                                        opt.price = gotOpt.option_men_price
                                                                                        menFound = o
                                                                                } else if(opt.gender === "women"){
                                                                                        opt.duration = gotOpt.option_women_duration
                                                                                        opt.price = gotOpt.option_women_price
                                                                                        womenFound = o
                                                                                }
                                                                        }
                                                                }
                                                        }

                                                        // removing the gender
                                                        console.log("gotOpt.option_gender", gotOpt.option_gender)
                                                        console.log("menFound", menFound)
                                                        console.log("womenFound", womenFound)
                                                        if( gotOpt.option_gender === "Women" && menFound > -1){
                                                                console.log("Removing men")
                                                                service.options =  service.options.splice(menFound, 1)
                                                        }
                                                        if( gotOpt.option_gender === "Men" && womenFound > -1){
                                                                console.log("Removing women")
                                                                service.options =  service.options.splice(womenFound, 1)
                                                        }

                                                        // adding the missing gender
                                                        console.log("gotOpt.option_gender", gotOpt.option_gender)
                                                        console.log("menFound", menFound)
                                                        if( ( gotOpt.option_gender === "Men" || gotOpt.option_gender === "Both") && menFound === -1){
                                                                const option: OptionI = {
                                                                        option_name: gotOpt.option_name,
                                                                        price: gotOpt.option_men_price,
                                                                        gender: "men",
                                                                        duration: gotOpt.option_men_duration
                                                                }
                                                                service.options.push(option)
                                                        }
                                                        if( ( gotOpt.option_gender === "Women" || gotOpt.option_gender === "Both") && womenFound === -1){
                                                                const option: OptionI = {
                                                                        option_name: gotOpt.option_name,
                                                                        price: gotOpt.option_women_price,
                                                                        gender: "women",
                                                                        duration: gotOpt.option_men_duration
                                                                }
                                                                service.options.push(option)
                                                        }

                                                        


                                                        console.log("Found:", found)
                                                        if (found === false && gotOpt.option_checked === true) {
                                                                console.log("Adding the option")
                                                                if (gotOpt.option_gender === "Men" || gotOpt.option_gender === "Both") {
                                                                        const option: OptionI = {
                                                                                option_name: gotOpt.option_name,
                                                                                price: gotOpt.option_men_price,
                                                                                gender: "men",
                                                                                duration: gotOpt.option_men_duration
                                                                        }
                                                                        service.options.push(option)
                                                                }
                                                                if (gotOpt.option_gender === "Women" || gotOpt.option_gender === "Both") {
                                                                        const option: OptionI = {
                                                                                option_name: gotOpt.option_name,
                                                                                price: gotOpt.option_women_price,
                                                                                gender: "women",
                                                                                duration: gotOpt.option_men_duration
                                                                        }
                                                                        service.options.push(option)
                                                                }
                                                        }
                                                }
                                        }
                                }
                        }
                        console.log("serviceFound", serviceFound)
                        console.log("categoryFound", categoryFound)
                        // if(serviceFound === -1 && categoryFound > -1){
                        //         console.log("Service not found category found")
                        //         this.getTheOptions(gotService, salon.services[categoryFound])
                        // }
                        console.log("da.category_name", da.category_name)
                        if (categoryFound === -1 || serviceFound === -1) {
                                const service: ServiceI = {
                                        name: gotService.service_name,
                                        price: 0,
                                        category: da.category_name,
                                        duration: 15,
                                        gender: 'men',
                                        options: []
                                }

                                // getting the options
                                this.getTheOptions(gotService, service)

                                //@ts-ignore
                                salon.services.push(service)
                        }
                }
                await salon.save()
                return salon
        }

        protected getTheOptions(gotService: any, service: ServiceI) {
                for (let opt of gotService.options) {
                        if (opt.option_checked === true) {

                                if (opt.option_gender === "Men" || opt.option_gender === "Both") {
                                        const option: OptionI = {
                                                option_name: opt.option_name,
                                                price: opt.option_men_price,
                                                duration: opt.option_men_duration,
                                                gender: 'men'
                                        }
                                        service.options.push(option)
                                }
                                if (opt.option_gender === "Women" || opt.option_gender === "Both") {
                                        const option: OptionI = {
                                                option_name: opt.option_name,
                                                price: opt.option_women_price,
                                                duration: opt.option_women_duration,
                                                gender: 'women'
                                        }
                                        service.options.push(option)
                                }
                        }
                }
        }

        deleteSalonService = async (_id: string, sid) => {
                //@ts-ignore
                const salon = await this.model.findOneAndUpdate({ _id: _id }, { $pull: { services: { _id: sid } } }, { new: true })
                return salon

        }
        getService = async (id: string, filter: any) => {

                console.log(id)

                const salon = await this.model.findOne({ _id: id}).select("services")
                console.log(salon)

                return salon
        }
        // getService = async (id: string) => {
        //         return this.model.findById({ _id: id }).select("services")
        // }

        getServiceByServiceId = async (id: string) => this.model.findOne({ "services._id": id })

        getServicesByServiceIds = async (ids: string[]) => this.model.find({ "services._id": ids })

        // TEST IT
        getServiceByOptionId = async (id: string) => this.model.findOne({ "services.options._id": id })

        // TEST IT
        getServicesByOptionIds = async (ids: string[]) => this.model.find({ "services.options._id": ids })

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
        //TODO:ask preet to reduce data sent here certain field of employees onllyy
        getSalonInfo = async (salonId: string) => {
                const salon = await this.model.findById(salonId).populate("photo_ids").populate({path:"employees",name:"employees.name",populate: { path: 'photo' }}).exec()
                return salon

        }

        // Salon Rating-Wise  Recommended.
        getSalon = async (q: any) => {
                const pageNumber: number = parseInt(q.page_number || 1)
                let pageLength: number = parseInt(q.page_length || 8)
                pageLength = (pageLength > 100) ? 100 : pageLength
                const skipCount = (pageNumber - 1) * pageLength
                //TODO: send salon with rating 5
                const salons = await this.model.find().populate("photo_ids").skip(skipCount).limit(pageLength).sort([['rating', -1], ['createdAt', -1]])
                // const reviewsAll = this.reviewModel.find({ salon_id: _id }).skip(skipCount).limit(pageLength).sort('-createdAt').populate("user_id")
                const salonPage = this.reviewModel.find().count();

                const [salon, pageNo] = await Promise.all([salons, salonPage])
                const totalPages = Math.ceil(pageNo / pageLength)
                return { salon, totalPages, pageNumber }


                //@ts-ignore
                //   for (let [key, value] of Object.entries(salons)) data.push(value.name)
                return salons

        }
        //gives option with at_home=false
        getHomeServiceSalon = async (centerPoint: any, km: string) => {
                var checkPoint = {}
                //TODO:ask preet how to get only at_home=true option
                var salonLocation = new Array()
                const salon = await this.model.find({ "services.options": { $elemMatch: { at_home: true } } })
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



        //get Salons nearby
        getSalonNearby = async (centerPoint: any, km: string) => {
                var checkPoint = {}
                var salonLocation = new Array()

                const salon = await this.model.find().populate("photo_ids")
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

                const salon = await this.model.find({}).populate("photo_ids").lean()
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
        // Search by salon
        getSearchResult = async (phrase: string) => {

                const data = await this.model.find(
                        { $text: { $search: phrase } },
                        { score: { $meta: 'textScore' } }
                ).sort({ score: { $meta: 'textScore' } })
                return data

        }

        getSearchservice = async (phrase: string) => {

                const data = await this.model.find(
                        { $text: { $search: phrase } },
                        { score: { $meta: 'textScore' } }
                ).sort({ score: { $meta: 'textScore' } })
                return data

        }

        searchFilter = async (q: any) => {


                // if(!q.makeup_artist_id && !q.designer_id && !q.salon_id){
                //     const message = 'None id provided'
                //     res.status(400)
                //     res.send({message})
                //     return
                // }

                // pagination
                const pageNumber: number = parseInt(q.page_number || 1)
                let pageLength: number = parseInt(q.page_length || 25)
                pageLength = (pageLength > 100) ? 100 : pageLength
                const skipCount = (pageNumber - 1) * pageLength
                console.log(pageLength)
                console.log(skipCount)

                const keys = Object.keys(q)
                const filters = {}

                for (const k of keys) {
                        switch (k) {
                                case "end_price":
                                        filters["end_price"] = {
                                                $lt: q[k],

                                        }
                                        break
                                case "start_price":
                                        filters["start_price"] = {
                                                $gt: q[k],

                                        }
                                        break
                                case "gender":
                                        filters["services"] = {
                                                $elemMatch: { "options.gender": q[k] }

                                        }
                                        break
                                case "brand":
                                        filters["brand"] = q[k]
                                        break
                                case "time":
                                        // console.log(q[k])
                                        // var day =  moment(q[k]).set({hour:0,minute:0,second:1,millisecond:0}).format("YYYY-MM-DD, h:mm:ss a")
                                        //   var endDay =   moment(q[k]).set({hour:23,minute:59,second:59,millisecond:0}).format("YYYY-MM-DD, h:mm:ss a")  
                                        // var dayofweek =moment(day).day()
                                        // console.log(dayofweek)  
                                        // filters[`start_working_hours.[${dayofweek}]`]={
                                        //              $gt:day,
                                        //              $lt:endDay        
                                        // }
                                        break
                                //TODO: location
                                case "location":
                                        filters["location"] = q[k]
                                        break
                                case "page_number":
                                case "page_length":
                                        break
                                default:
                                        filters[k] = q[k]
                        }
                }

                console.log(filters);



                const salonFilter = this.model.find(filters).skip(skipCount).limit(pageLength)
                const salonPagesReq = this.model.count(filters)

                const [salonDetails, salonPages] = await Promise.all([salonFilter, salonPagesReq])
                const totalPages = Math.ceil(salonPages / pageLength)
                return ({ salonDetails, totalPages, currentPage: pageNumber })


        }

}