import mongoose from "../database";
import { EmployeeI } from "../interfaces/employee.interface";
import OptionI from "../interfaces/options.interface";
import { ReviewI } from "../interfaces/review.interface";
import SalonSI, { SalonI } from "../interfaces/salon.interface";
import ServiceI from "../interfaces/service.interface";
import { SalonRedis, SalonSearchRedis } from "../redis/index.redis";
import BaseService from "../service/base.service";
import { arePointsNear } from "../utils/location";
import distance = require('google-distance');

import moment = require("moment");
import e = require("express");
import { resolve } from "bluebird";
import SalonShortSI from "../interfaces/short-salon.interface";



export default class SalonService extends BaseService {
        employeeModel: mongoose.Model<any, any>
        vendorModel: mongoose.Model<any, any>
        eventModel: mongoose.Model<any, any>
        offerModel: mongoose.Model<any, any>
        reviewModel: mongoose.Model<any, any>
        bookingModel: mongoose.Model<any, any>
        brandModel: mongoose.Model<any, any>
        reportSalonModel: mongoose.Model<any, any>


        // constructor(model: mongoose.Model<any, any>) {
        //     this.model = model
        //     this.modelName = model.modelName
        // }

        constructor(salonmodel: mongoose.Model<any, any>, employeeModel: mongoose.Model<any, any>, vendorModel: mongoose.Model<any, any>, eventModel: mongoose.Model<any, any>, offerModel: mongoose.Model<any, any>, reviewModel: mongoose.Model<any, any>, bookingModel: mongoose.Model<any, any>, brandModel: mongoose.Model<any, any>, reportSalonModel: mongoose.Model<any, any>) {
                super(salonmodel);
                this.employeeModel = employeeModel
                this.vendorModel = vendorModel
                this.eventModel = eventModel
                this.offerModel = offerModel
                this.reviewModel = reviewModel
                this.bookingModel = bookingModel
                this.brandModel = brandModel
                this.reportSalonModel = reportSalonModel
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
                const data = da.services as any[]
                for (let di = 0; di < data.length; di++) {
                        // this is getting the data
                        const gotService = data[di]
                        let categoryFound = -1
                        let serviceFound = -1

                        for (let i = 0; i < salon.services.length; i++) {
                                const service = salon.services[i]
                                if (service.category === da.category_name) {
                                        categoryFound = i
                                        const newSercies = service
                                        if (gotService.service_name === service.name) {
                                                serviceFound = i
                                                if (gotService.service_checked === false) {
                                                        salon.services.splice(i, 1)
                                                        break
                                                }
                                                // if service is checked
                                                for (let opts of service.options) {
                                                        opts.at_home = gotService.service_loaction === "Home Only" ? true : false
                                                }
                                                for (let gotOpt of gotService.options) {
                                                        let found = false
                                                        let menFound = -1
                                                        let womenFound = -1
                                                        // this is an array to store the indexs of the elements to remove
                                                        const removeOptsIndexes = []
                                                        for (let o = 0; o < service.options.length; o++) {
                                                                const opt = service.options[o]
                                                                if (opt.option_name === gotOpt.option_name) {
                                                                        if (gotOpt.option_checked === false) {
                                                                                found = true
                                                                                if (!removeOptsIndexes.includes(o))
                                                                                        removeOptsIndexes.push(o)
                                                                        } else {
                                                                                opt.at_home = gotOpt.option_service_location === "Home Only" ? true : false
                                                                                if (opt.gender === "men") {
                                                                                        found = true
                                                                                        opt.duration = gotOpt.option_men_duration
                                                                                        opt.price = gotOpt.option_men_price
                                                                                        menFound = o
                                                                                } else if (opt.gender === "women") {
                                                                                        found = true
                                                                                        opt.duration = gotOpt.option_women_duration
                                                                                        opt.price = gotOpt.option_women_price
                                                                                        womenFound = o
                                                                                }
                                                                        }
                                                                }
                                                        }

                                                        // removing the gender
                                                        if (gotOpt.option_gender === "Women" && menFound > -1) {
                                                                if (!removeOptsIndexes.includes(menFound))
                                                                        removeOptsIndexes.push(menFound)
                                                        }
                                                        if (gotOpt.option_gender === "Men" && womenFound > -1) {
                                                                if (!removeOptsIndexes.includes(womenFound))
                                                                        removeOptsIndexes.push(womenFound)
                                                        }

                                                        // filtering the options
                                                        service.options = service.options.filter((v: OptionI, i: number) => {
                                                                if (removeOptsIndexes.includes(i)) {
                                                                        return false
                                                                }

                                                                return true
                                                        })

                                                        // adding the missing gender
                                                        if ((gotOpt.option_gender === "Men" || gotOpt.option_gender === "Both") && menFound === -1 && gotOpt.option_checked) {
                                                                const option: OptionI = {
                                                                        option_name: gotOpt.option_name,
                                                                        price: gotOpt.option_men_price,
                                                                        gender: "men",
                                                                        duration: gotOpt.option_men_duration,
                                                                        at_home: gotOpt.option_service_location === "Home Only" ? true : false
                                                                }
                                                                service.options.push(option)
                                                        }
                                                        if ((gotOpt.option_gender === "Women" || gotOpt.option_gender === "Both") && womenFound === -1 && gotOpt.option_checked) {
                                                                const option: OptionI = {
                                                                        option_name: gotOpt.option_name,
                                                                        price: gotOpt.option_women_price,
                                                                        gender: "women",
                                                                        duration: gotOpt.option_women_duration,
                                                                        at_home: gotOpt.option_service_location === "Home Only" ? true : false
                                                                }
                                                                service.options.push(option)
                                                        }





                                                        if (found === false && gotOpt.option_checked === true) {
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
                        // if(serviceFound === -1 && categoryFound > -1){
                        //         this.getTheOptions(gotService, salon.services[categoryFound])
                        // }

                        if ((categoryFound === -1 || serviceFound === -1) && gotService.service_checked === true) {
                                const service: ServiceI = {
                                        name: gotService?.service_name ?? da.category_name ?? "Some Service",
                                        price: 0,
                                        description:gotService?.description??"",
                                        photo:gotService?.photo??"",
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
                const salon = await this.model.findOne({ _id: id }).select("services")
                return salon
        }

        getServiceByServiceId = async (id: string) => this.model.findOne({ "services._id": id })

        getServicesByServiceIds = async (ids: string[]) => this.model.find({ "services._id": ids })

        // TEST IT
        getServiceByOptionId = async (id: string) => this.model.findOne({ "services.options._id": id })

        // TEST IT
        getServicesByOptionIds = async (ids: string[]) => this.model.find({ "services.options._id": ids }) as SalonSI[]

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
        getSalonInfo = async (salonId: string, centerPoint: any,getDistance:boolean) => {
                distance.apiKey = 'AIzaSyBQajUkgso9uGXbVrmbRxkMAkl8Z9mq0Q8';
                const salon = await this.model.findById(salonId).populate("photo_ids").populate({ path: "employees", name: "employees.name", populate: { path: 'photo' } }).populate("location_id").lean().exec()
                try {
                if (salon.coordinates != null && getDistance==true) {
                        if (salon.coordinates["coordinates"][0] != null && salon.coordinates["coordinates"][1] != null) {
                                const userLocation = `${centerPoint.lat}` + `,` + `${centerPoint.lng}`
                                const salonCoordinates = `${salon.coordinates["coordinates"][0].toString() + `,` + salon.coordinates["coordinates"][1].toString()}`
                                const newSalon = await new Promise<any>((resolve, reject) => {
                                        distance.get(
                                                {
                                                        index: 1,
                                                        origin: userLocation,
                                                        destination: salonCoordinates
                                                }, function (err, data) {
                                                        if (err) {
                                                                reject(salon);
                                                                return
                                                        }
                                                        salon.distance = data           
                                                        resolve(salon)
                                                });
                                })
                                return newSalon
                        }
                        return salon
                }
        } catch (error) {
                console.log(error)
                return salon         
        }
                return salon
        }

        // Salon Rating-Wise  Recommended.
        getSalon = async (q: any,getDistance:boolean=false) => {
                const pageNumber: number = parseInt(q.page_number || 1)
                let pageLength: number = parseInt(q.page_length || 8)
                let type= "salon"
                if(q.type){
                        type=q.type
                }
                pageLength = (pageLength > 100) ? 100 : pageLength
                const skipCount = (pageNumber - 1) * pageLength
                const filter = {
                        pageNumber,
                        pageLength,
                        skipCount,
                        getDistance
                }
               
               
                        //TODO: send salon with rating 5
                        const salons = this.model.find({approved:true,type:type}, {}, { skip: skipCount, limit: pageLength }).select("name").select("rating").select("location").select("start_price").select("coordinates").select("location_id").populate("location_id").populate("profile_pic").sort([['rating', -1], ['createdAt', -1]]).lean()
                        // const salons = this.model.find().skip(skipCount).limit(pageLength).populate("photo_ids").populate("profile_pic").sort([['rating', -1], ['createdAt', -1]])
                        // const reviewsAll = this.reviewModel.find({ salon_id: _id }).skip(skipCount).limit(pageLength).sort('-createdAt').populate("user_id")
                        const salonPage = this.model.aggregate([
                                {$match:{approved:true,type:type}},
                                { "$count": "count" }
                        ])

                        const [salon, pageNo] = await Promise.all([salons, salonPage])
                        let totalPageNumber = 0
                        if (pageNo.length > 0) {
                                totalPageNumber = pageNo[0].count
                        }
                        const totalPages = Math.ceil(totalPageNumber / pageLength)
                        if (getDistance) {
                               
                              
                                try {
                                        const salonCoordinates: string[] = salon.map((e) => {
                                                return `${e.coordinates.coordinates[0]}` + `,` + `${e.coordinates.coordinates[1]}`
        
                                        })
                                        const userLocation = [`${q.latitude}` + `,` + `${q.longitude}`]

                                        //  distance.apiKey = 'AIzaSyBQajUkgso9uGXbVrmbRxkMAkl8Z9mq0Q8';
                                        const newSalon = await new Promise<any>((resolve, reject) => {
        
                                                distance.apiKey = 'AIzaSyBQajUkgso9uGXbVrmbRxkMAkl8Z9mq0Q8';
                                                return distance.get(
                                                        {
                                                                origins: userLocation,
                                                                destinations: salonCoordinates
                                                        },
                                                        function (err, data) {
                                                                if (err) { console.log(err) 
                                                                 return reject(salon)
                                                                }
                                                               
                                                                
                                                                for (var i = 0; i < data.length; i++) {
                                                                        salon[i].distance = data[i]
                                                                }
                                                                //   salon.map((e)=>{
                                                                //           e.distance=data
                                                                //   })
                                                               return  resolve( salon)
                                                              
                                                        });
                                        })
                                        return newSalon
                                } catch (e) {
                                       console.log(e)
                                        return salon
                                }
                        }
                      
             

                return salon
        }

        //gives option with at_home=false
        getHomeServiceSalon = async (q) => {
                let getDistance=false
                const pageNumber: number = parseInt(q.page_number || 1)
                let pageLength: number = parseInt(q.page_length || 2)
                pageLength = (pageLength > 100) ? 100 : pageLength
                const skipCount = (pageNumber - 1) * pageLength
                if(q.latitude != null && q.longitude !=null){
                        getDistance=false
                }
                let type = "salon"
                if(q.type){
                        type=q.type
                }
                const latitude = q.latitude || 28.7041
                const longitude = q.longitude || 77.1025
        
                const filter = {
                        pageNumber,
                        pageLength,
                        skipCount,
                        getDistance,
                        type
                }
                const redisKey = `getHome${type}`
                const cahceGetSalon = await SalonRedis.get(redisKey, filter)
                if (cahceGetSalon === null) {
                        const salons = await this.model.find({
                                "approved":true,
                                "type":type,
                                "services.options.at_home": true, coordinates: {
                                        $near:
                                        {
                                                $geometry: { type: "Point", coordinates: [latitude, longitude] },
                                                $minDistance: 0,
                                                $maxDistance: 10000000
                                        }
                                }
                        }, {}, { skip: skipCount, limit: pageLength }).select("name").select("rating").select("location").select("start_price").populate("profile_pic").select("coordinates").select("location_id").populate("location_id").lean()

                        if (getDistance) {
                                console.log(salons.coordinates)

                                try {
                                        const salonCoordinates: string[] = salons.map((e) => {
                                                return `${e.coordinates.coordinates[0]}` + `,` + `${e.coordinates.coordinates[1]}`
        
                                        })
                                        const userLocation = [`${q.latitude}` + `,` + `${q.longitude}`]
                                        //  distance.apiKey = 'AIzaSyBQajUkgso9uGXbVrmbRxkMAkl8Z9mq0Q8';
                                        const newSalon = await new Promise<any>((resolve, reject) => {
        
                                                distance.apiKey = 'AIzaSyBQajUkgso9uGXbVrmbRxkMAkl8Z9mq0Q8';
                                                return distance.get(
                                                        {
                                                                origins: userLocation,
                                                                destinations: salonCoordinates
                                                        },
                                                        function (err, data) {
                                                                if (err) { console.log(err) 
                                                                 return reject(salons)
                                                                }
                                                            
                                                                
                                                                for (var i = 0; i < data.length; i++) {
                                                                        salons[i].distance = data[i]
                                                                }
                                                                //   salon.map((e)=>{
                                                                //           e.distance=data
                                                                //   })
                                                               return  resolve( salons)
                                                              
                                                        });
                                        })
                                        return newSalon
                                } catch (e) {
                                        console.log(e)
                                        return salons
                                }
                              
                }
                return salons 
        }
                return cahceGetSalon
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
        getSalonNearby = async (q) => {
                const pageNumber: number = parseInt(q.page_number || 1)
                let pageLength: number = parseInt(q.page_length || 8)
                pageLength = (pageLength > 100) ? 100 : pageLength
                const skipCount = (pageNumber - 1) * pageLength
                let getDistance=false
                if(q.latitude != null && q.longitude !=null){
                        getDistance=false
                }
                let type="salon"
                if(q.type){
                        type=q.type
                }
                const filter = {
                        pageNumber,
                        pageLength,
                        skipCount,
                        getDistance,
                        type
                }
                const redisKey = `get${type}Nearby`
                const latitude = q.latitude || 28.7041
                const longitude = q.longitude || 77.1025
                const cahceGetSalon = await SalonRedis.get(redisKey, filter)
                if (cahceGetSalon === null) {
                        const salons = await this.model.find({
                                approved:true,
                                type:type,
                                coordinates: {
                                        $near:
                                        {
                                                $geometry: { type: "Point", coordinates: [latitude, longitude] },
                                                $minDistance: 0,
                                                $maxDistance: 100000
                                        }
                                }
                        }, {}, { skip: skipCount, limit: pageLength }).select("name").select("rating").select("location").select("start_price").select("location_id").populate("location_id").populate("profile_pic").select("coordinates").lean()
                        if (getDistance) {

                                try {
                                        const salonCoordinates: string[] = salons.map((e) => {
                                                return `${e.coordinates.coordinates[0]}` + `,` + `${e.coordinates.coordinates[1]}`
        
                                        })
                                        const userLocation = [`${q.latitude}` + `,` + `${q.longitude}`]
                                        //  distance.apiKey = 'AIzaSyBQajUkgso9uGXbVrmbRxkMAkl8Z9mq0Q8';
                                        const newSalon = await new Promise<any>((resolve, reject) => {
        
                                                distance.apiKey = 'AIzaSyBQajUkgso9uGXbVrmbRxkMAkl8Z9mq0Q8';
                                                return distance.get(
                                                        {
                                                                origins: userLocation,
                                                                destinations: salonCoordinates
                                                        },
                                                        function (err, data) {
                                                                if (err) { console.log(err) 
                                                                 return reject(salons)
                                                                }
                                                            
                                                                
                                                                for (var i = 0; i < data.length; i++) {
                                                                        salons[i].distance = data[i]
                                                                }
                                                                //   salon.map((e)=>{
                                                                //           e.distance=data
                                                                //   })
                                                               return  resolve( salons)
                                                              
                                                        });
                                        })
                                        return newSalon
                                } catch (e) {
                                        console.log(e)
                                        return salons
                                }
                              
                }
                        return salons
                }
                return cahceGetSalon

        }
        //get salon distancewise
        getSalonDistance = async (centerPoint: any, km: string) => {

                var checkPoint = {}
                var salonLocation = new Array()

                //@ts-ignore
                centerPoint.lat = req.query.latitude
                //@ts-ignore
                centerPoint.lng = req.query.longitude

                const salon = await this.model.find({approved:true}).populate("photo_ids").populate("profile_pic").lean()
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
                 const reviewsAll = this.reviewModel.find({ salon_id: _id }).skip(skipCount).limit(pageLength).sort('-createdAt').populate({
                        path : 'user_id',
                        select: { '_id': 1,'name':1},
                        populate : {
                          path : 'profile_pic'
                        }
                      })
               
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
                const check = await this.bookingModel.findOne({ user_id: userId, salon_id: salon_id, status: "Completed" })
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
                // const data = await this.model.find(
                //         { $text: { $search: phrase, $caseSensitive: false } },
                //         { score: { $meta: 'textScore' } }
                // ).populate("profile_pic").sort({ score: { $meta: 'textScore' } })
                //   const data =  await this.model.find({name:{$regex: `.*${phrase}.*`, $options: 'i'}}).populate("profile_pic")
                var result1 = await this.model.aggregate([


                        {
                                $match: {
                                        approved:true,
                                        name: { $regex: `.*${phrase}.*`, $options: 'i' }
                                }
                        },
                        { $lookup: { from: 'photos', localField: 'profile_pic', foreignField: '_id', as: 'profile_pic' } },
                        { $lookup: { from: 'locations', localField: 'location_id', foreignField: '_id', as: 'location_id' } },
                        {$unwind:"$profile_pic"},
                        {$unwind:"$location_id"},

                        {
                                $project: {
                                        "_id": 1,
                                        name: 1,
                                        profile_pic: 1,
                                        rating: 1,
                                        area: 1,
                                        location_id:1
                                        // temporary_closed:1
                                        // service: { $addToSet: "$services" },


                                }
                        }
                        // {
                        //         $unwind: "$profile_pic"
                        // },


                ])
                return result1
        }

        getSearchservice = async (phrase: string) => {
                console.log(phrase)
                const data = await SalonSearchRedis.get(phrase)
                if(data==null){
                const data2 = await this.model.aggregate([
                       
                        {
                                $lookup:
                                {
                                        from: "photos",
                                        localField: "profile_pic",
                                        foreignField: "_id",
                                        as: "profile_pic",
                                },
                        },
                        {
                                $unwind: "$services"
                        },
                        { $match:  {
                                approved:true,
                                "services.name":phrase} },
                        {
                                $group: {
                                        "_id": "$_id",
                                        name: { $first: "$name" },
                                        profile_pic: { $first: "$profile_pic" },
                                        rating: { $first: "$rating" },
                                        service: { $first: "$services" },

                                }
                        },
                ])
                SalonSearchRedis.set(phrase, data2)
              
                return data2
        }
        return data
        }
        getSalonCategory = async (phrase: string) => {


                var result1 = await this.model.aggregate([


                        {
                                $lookup:
                                {
                                        from: "photos",
                                        localField: "profile_pic",
                                        foreignField: "_id",
                                        as: "profile_pic",
                                },
                        },
                        {
                                $unwind: "$services"
                        },
                        {

                                $match:
                                {
                                        "services.category": {
                                                $regex: `.*${phrase}.*`, $options: 'i'
                                        },
                                        "book_service":true,
                                        approved:true,


                                }

                        },
                        {
                                $group: {
                                        "_id": "$_id",
                                        name: { $first: "$name" },
                                        profile_pic: { $first: "$profile_pic" },
                                        rating: { $first: "$rating" },
                                        service: { $addToSet: "$services" },
                                        




                                }
                        },
                        // {
                        //         $project: {
                        //                 _id: 1,
                        //                 profile_pic: 1,
                        //                 name: 1,
                        //                 rating: 1,
                        //                 service: 1

                        //                 // 'filteredValue': {


                        //                 //         $filter: {
                        //                 //         input: "$services.options",
                        //                 //         as: "option",
                        //                 //         cond: { $eq: [ '$$option.at_home', false ] }
                        //                 //       }

                        //                 // }

                        //         }
                        // },
                ])
                return result1

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
                let type="salon"
                if(q.type){
                        type=q.type
                }
                const keys = Object.keys(q)
                const filters = {
                        type:type,
                        "approved":true,
                }

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
                                        // var day =  moment(q[k]).set({hour:0,minute:0,second:1,millisecond:0}).format("YYYY-MM-DD, h:mm:ss a")
                                        //   var endDay =   moment(q[k]).set({hour:23,minute:59,second:59,millisecond:0}).format("YYYY-MM-DD, h:mm:ss a")  
                                        // var dayofweek =moment(day).day()
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




                const salonFilter = this.model.find(filters).populate("profile_pic").skip(skipCount).limit(pageLength)
                const salonPagesReq = this.model.count(filters)

                const [salonDetails, salonPages] = await Promise.all([salonFilter, salonPagesReq])
                const totalPages = Math.ceil(salonPages / pageLength)
                return ({ salonDetails, totalPages, currentPage: pageNumber })


        }

        reportError = async (q) => {
                const report = await this.reportSalonModel.create(q)
                return report
        }




        getReviewsRating = async (_id: string) => {
                const id = mongoose.Types.ObjectId(_id)
                /**
                 * [
    {
        '$match': {
            'salon_id': ObjectId('5f1a9055e5b96f894112e5f8')
        }
    }, {
        '$group': {
            '_id': '$rating', 
            'count': {
                '$sum': 1
            }
        }
    }
]
                 */
                var reviews = [
                        {
                                "$match": {
                                        "salon_id": id,
                                }
                        },

                        {
                                "$group": {

                                        "_id": "$salon_id",

                                        "counts": { "$push": { "rating": "$rating", "count": "$counts" } },
                                        "totalItemcount": { "$sum": 1 },
                                        "totalRating": { "$sum": "$rating" },
                                        "5_star_ratings": {

                                                "$sum": {

                                                        "$cond": [{ "$eq": ["$rating", 5] }, 1, 0]
                                                }
                                        },
                                        "4_star_ratings": {
                                                "$sum": {
                                                        "$cond": [{ "$eq": ["$rating", 4] }, 1, 0]
                                                }
                                        },
                                        "3_star_ratings": {
                                                "$sum": {
                                                        "$cond": [{ "$eq": ["$rating", 3] }, 1, 0]
                                                }
                                        },
                                        "2_star_ratings": {
                                                "$sum": {
                                                        "$cond": [{ "$eq": ["$rating", 2] }, 1, 0]
                                                }
                                        },
                                        "1_star_ratings": {
                                                "$sum": {
                                                        "$cond": [{ "$eq": ["$rating", 1] }, 1, 0]
                                                }
                                        }
                                }
                        },

                ]

                const rating = await this.reviewModel.aggregate(reviews)

                return rating
        }
        salonSlots = async (id: any, slotsDate: Date) => {
                //  const redisKey = "slots"
                // const cahceGetSalon = await SalonRedis.get(redisKey, {id,slotsDate})
                // if(cahceGetSalon!=null){
                //       return cahceGetSalon  
                // }
                const salon = await this.model.findById(id)
                const starting_hours = salon.start_working_hours
                // getting the day from the date
                let day = moment(slotsDate).day() - 1
                if (day < 0) day = 6
                if (starting_hours.length < day) throw Error(`starting hours not found for day number ${day} `)
                const selectedStartingHour = moment(starting_hours[day])
                if (salon.end_working_hours.length < day) throw Error(`ending hours not found for day number ${day} `)
                const selectedEndHour = moment(salon.end_working_hours[day])
                const slots = []
                for (let i = selectedStartingHour; i.isBefore(selectedEndHour); i.add(30, 'minutes')) {
                        if (moment().format("DD/MM/YYYY") == moment(slotsDate).format("DD/MM/YYYY")) {
                                if (parseInt(i.format("HH")) > parseInt(moment().utcOffset(330).format("HH"))) {
                                      
                                        const slot  = moment(i).add(30, 'minutes').format('hh:mm a')
                                        slots.push(slot)
                                }
                        } else {
                                const slot = moment(i).format('hh:mm a')

                                slots.push(slot)

                        }
                }

                return slots

        }
        minutesOfDay = function (m) {
                return m.minutes() + m.hours() * 60;
        }

        getNameIDRatingProfile = async () => {
                const salon = await this.model.find({}).select({ "_id": 1, "name": 1, approved: 1,rating:1,profile_pic:1 }).populate("profile_pic")
                return salon
        }

        getUnapprovedWithPagination = async (q: any): Promise<any> => {
                const pageNumber: number = parseInt(q.page_number || 1)
                let pageLength: number = parseInt(q.page_length || 25)
                pageLength = (pageLength > 100) ? 100 : pageLength
                const skipCount = (pageNumber - 1) * pageLength

                const resourceQuery = this.model.find({ approved: false }, {}, { skip: skipCount, limit: pageLength }).select({ "_id": 1, "name": 1, approved: 1, location: 1, createdAt: 1,rating:1,profile_pic:1 }).populate("profile_pic")
                const resourceCountQuery = this.model.aggregate([
                        { "$count": "count" }
                ])

                const [salons, pageNo] = await Promise.all([resourceQuery, resourceCountQuery])
                let totalPageNumber = 0
                if (pageNo.length > 0) {
                        totalPageNumber = pageNo[0].count
                }
                const totalPages = Math.ceil(totalPageNumber / pageLength)
                return { salons, totalPages, pageNumber, pageLength }
        }

        getSalonPhoto = async (id: string) => {
                const salonPhoto = await this.model.findById(id).select("photo_ids").populate("photo_ids")
                return salonPhoto

        }
//check to redeploy

        getSalonByIds = async (ids: string[], q: any, getDistance: boolean = false) => {
                const pageNumber: number = parseInt(q.page_number || 1)
                let pageLength: number = parseInt(q.page_length || 8)
                pageLength = (pageLength > 100) ? 100 : pageLength
                const skipCount = (pageNumber - 1) * pageLength
                let salonReq
                let out
                if (ids.length != 0) {
                        salonReq = this.model.find({ _id: { $in: ids },approved:true }).skip(skipCount).limit(pageLength).select("name").select("rating").select("location").select("start_price").select("coordinates").select("area").select("location_id").populate("location_id").populate("profile_pic").sort([['rating', -1], ['createdAt', -1]]).lean()
                } else {
                        salonReq = this.model.find({approved:true}).skip(skipCount).limit(pageLength).select("name").select("rating").select("location").select("start_price").populate("profile_pic").select("coordinates").select("location_id").populate("location_id").select("area").sort([['rating', -1], ['createdAt', -1]]).lean()
                }
                // const salons = this.model.find().skip(skipCount).limit(pageLength).populate("photo_ids").populate("profile_pic").sort([['rating', -1], ['createdAt', -1]])
                // const reviewsAll = this.reviewModel.find({ salon_id: _id }).skip(skipCount).limit(pageLength).sort('-createdAt').populate("user_id")
                const salonPagesReq = this.model.aggregate([
                        { "$count": "count" }
                ])

                const [salon, pages] = await Promise.all([salonReq, salonPagesReq])
                if (getDistance) {
                        try {
                                const salonCoordinates: string[] = salon.map((e) => {
                                        return `${e.coordinates.coordinates[0]}` + `,` + `${e.coordinates.coordinates[1]}`

                                })
                                const userLocation = [`${q.latitude}` + `,` + `${q.longitude}`]
                                //  distance.apiKey = 'AIzaSyBQajUkgso9uGXbVrmbRxkMAkl8Z9mq0Q8';
                                const newSalon = await new Promise<any>((resolve, reject) => {

                                        distance.apiKey = 'AIzaSyBQajUkgso9uGXbVrmbRxkMAkl8Z9mq0Q8';
                                        return distance.get(
                                                {
                                                        origins: userLocation,
                                                        destinations: salonCoordinates
                                                },
                                                function (err, data) {
                                                        if (err) return console.log(err);
                                                    
                                                        for (var i = 0; i < data.length; i++) {
                                                                salon[i].distance = data[i]
                                                        }
                                                        //   salon.map((e)=>{
                                                        //           e.distance=data
                                                        //   })
                                                        return resolve({ salon, pages })
                                                });
                                })
                                return { salon, pages }
                        } catch (e) {
                                return { salon, pages }
                        }
                }
                out = { salon, pages }
                return out



        }
        getDistanceInPairs = async () => {
                const newSalon = await new Promise<any>((resolve, reject) => {

                        //distance.apiKey = 'AIzaSyBQajUkgso9uGXbVrmbRxkMAkl8Z9mq0Q8';
                        return distance.get(
                                {
                                        origins: [`28.584450,77.341812`],
                                        destinations: [`28.540331,77.342979`, `28.040331,77.342979`, `27.040331,77.342979`]
                                },
                                function (err, data) {
                                        if (err) return console.log(err);
                                   
                                        return resolve(data)
                                });
                        return newSalon

                })
        }

        getSalonbyLocation = async (subarea)=>{
                const salon = await this.model.findOne({}).populate({
                        path: 'location_id',
                        match: { city: "i" },
                        // Explicitly exclude `_id`, see http://bit.ly/2aEfTdB'
                      }).exec()
                      return salon
        }


}