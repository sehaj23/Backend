import BaseController from "./base.controller";
import SalonService from "../service/salon.service";
import { Request, Response } from "express";
import controllerErrorHandler from "../middleware/controller-error-handler.middleware";
import SalonSI, { SalonI } from "../interfaces/salon.interface";
import logger from "../utils/logger";
import ServiceI from "../interfaces/service.interface";
import { EmployeeI } from "../interfaces/employee.interface";
import { PhotoI } from "../interfaces/photo.interface";
import EventDesignerI from "../interfaces/eventDesigner.model";
import { OfferI } from "../interfaces/offer.interface";
import { SalonRedis } from "../redis/index.redis";
import { keys } from "../seeds/data/admin/admins";
import { ReviewI } from "../interfaces/review.interface";
import Salon from "../models/salon.model";
import moment = require("moment");
import OptionI from "../interfaces/options.interface";


export default class SalonController extends BaseController {

    service: SalonService
    constructor(service: SalonService) {
        super(service)
        this.service = service
    }

    postSalon = controllerErrorHandler(async (req: Request, res: Response) => {
        const d: SalonI = req.body

        //@ts-ignore
        d.vendor_id = req.vendorId
        //@ts-ignore
        const salon = await this.service.postSalon(req.vendorId, d)
        if (salon === null) {
            const errMsg = `salon not found`;
            logger.error(errMsg);
            res.status(400);
            res.send({ message: errMsg });
        }
        res.status(201).send(salon)

    })
    patchSalon = controllerErrorHandler(async (req: Request, res: Response) => {
        const d = req.body
        const id = req.params.id

        //@ts-ignore
        const vendor_id = req.vendorId
        console.log(vendor_id)
        console.log(id)


        const salon = await this.service.patchSalon(id, vendor_id, d)
        if (salon === null) {
            const errMsg = `salon not found`;
            logger.error(errMsg);
            res.status(400);
            res.send({ message: errMsg });
        }
        res.send(salon)
    })
    salonSettings = controllerErrorHandler(async (req: Request, res: Response) => {

        const salon_id = req.params.id
        //@ts-ignore
        const vendor_id = req.vendorId
        const updates = Object.keys(req.body)
        const d = req.body
        const allowedupates = ["name", "location", "start_working_hours", "insta_link", "fb_link", "end_working_hours"]
        const isvalid = updates.every((update) => allowedupates.includes(update))
        console.log(isvalid)
        if (!isvalid) {
            const errMsg = `Sorry ${updates} cannot be updated!`
            logger.error(errMsg)
            res.send({ message: errMsg })
            return
        }
        const salon = await this.service.patchSalon(salon_id, vendor_id, d)
        if (salon === null) {
            const errMsg = `salon not found`;
            logger.error(errMsg);
            res.status(400);
            res.send({ message: errMsg });
        }
        res.send(salon)


    })
    addSalonService = controllerErrorHandler(async (req: Request, res: Response) => {
        const d = req.body
        const salon_id = req.params.id
        console.log(d)
        const newSalon = await this.service.addSalonService(salon_id, d)
        if (newSalon === null) {
            const errMsg = `Add Services: no data with this _id and service was found`
            logger.error(errMsg)
            res.status(403)
            res.send({ message: errMsg })
            return
        }
        res.send(newSalon)

    })
    deleteSalonService = controllerErrorHandler(async (req: Request, res: Response) => {
        const sid = req.params.sid
        const _id = req.params.id
        //@ts-ignore
        const vendor_id = req.vendorId
        //TODO: validator
        if (!_id || !sid) {
            logger.error(`salon Id is missing salon_id:  & mua_id: `)
            res.status(403)
            res.send({ message: `salon Id is missing mua_id:` })
            return
        }
        const salon = await this.service.deleteSalonService(_id, sid)

        if (salon === null) {
            const errMsg = `Delete Service: no data with this _id and service was found`
            logger.error(errMsg)
            res.status(403)
            res.send({ message: errMsg })
            return
        }
        res.send(salon)


    })
    getService = controllerErrorHandler(async (req: Request, res: Response) => {
        const id = req.params.id
        const filter = {}
        if (req.query.gender) {
            filter["gender"] = req.query.gender
        }
        let atHome: boolean
        if (req.query.home) {
            atHome = (req.query.gender === "true")
            filter["at_home"] = atHome
        }
        //TODO: validator
        if (!id) {
            const errMsg = `id is missing from the params`
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return
        }
        const salonn = await this.service.getService(id, filter) as SalonSI
        const salon = salonn.toObject() as SalonI
        if (salon === null) {
            const errMsg = `no service found`
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return
        }
        const services = salon.services
        const filterService = services.filter((service: ServiceI) => {
            const { options } = service
            const filterOptions = options.filter((opt: OptionI) => {
                if (req.query.gender) {
                    if (opt.gender !== req.query.gender && req.query.gender !== "both") {
                        return false
                    }
                }
                if (req.query.home !== undefined) {
                    if (opt.at_home !== atHome) {
                        return false
                    }
                }
                return true
            })
            if(filterOptions.length > 0){
                service.options = filterOptions
                return true
            }
            return false
        })
        salon.services = filterService
        res.send(salon)
    })

    updateService = controllerErrorHandler(async (req: Request, res: Response) => {
        const d = req.body
        const id = req.params.id
        const sid = req.params.sid
        //@ts-ignore
        const vendor_id = req.vendorId
        //TODO:validator

        if (!id || !sid) {
            logger.error(`sid and id not found`)
            res.status(403)
            res.send({ message: "SID and ID not found" })
        }

        const salon = await this.service.updateService(id, d, sid)
        if (salon === null) {
            const errMsg = `no service found`
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return
        }
        res.send(salon)
    })
    addSalonEmployee = controllerErrorHandler(async (req: Request, res: Response) => {
        const d: EmployeeI = req.body
        const _id = req.params.id
        //TODO:validator
        if (!_id) {
            const errMsg = `Add Emp: no data with this _id and service was found`
            logger.error(errMsg)
            res.status(403)
            res.send({ message: errMsg })
            return
        }
        const newSalon = await this.service.addSalonEmployee(d, _id)

        if (newSalon === null) {
            const errMsg = `Add Emp: no data with this _id and service was found`
            logger.error(errMsg)
            res.status(403)
            res.send({ message: errMsg })
            return
        }
        res.send({ message: "Employee Added", success: "true" })

    })
    deleteSalonEmployee = controllerErrorHandler(async (req: Request, res: Response) => {
        const _id = req.params.id
        const eid = req.params.eid
        //@ts-ignore
        const vendor_id = req.vendorId

        //:TODO:validator
        if (!_id || !eid) {
            const errMsg = `delete Emp: no data with this _id and service was found`
            logger.error(errMsg)
            res.status(403)
            res.send({ message: errMsg })
            return
        }

        const newSalon = await this.service.deleteSalonEmployee(_id, eid, vendor_id)
        if (newSalon === null) {
            const errMsg = `delete Emp: no data with this _id and service was found`
            logger.error(errMsg)
            res.status(403)
            res.send({ message: errMsg })
            return
        }
        res.send({ message: "Employee Removed", success: "true" })

    })
    editSalonEmployee = controllerErrorHandler(async (req: Request, res: Response) => {
        const v = req.body
        const salon_id = req.params.id
        const emp_id = req.params.eid
        const emp = await this.service.editSalonEmployee(v, salon_id, emp_id)
        if (emp == null) {
            const errMsg = `Employee Not Found`
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return

        }
        res.send(emp)
    })

    putProfilePic = controllerErrorHandler(async (req: Request, res: Response) => {

        const photoData: PhotoI = req.body
        const _id = req.params.id

        const newEvent = await this.service.putProfilePic(photoData, _id)
        if (newEvent == null) {
            const errMsg = `Profile pic not updated!`
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return

        }
        res.send(newEvent)
    })

    getOffer = controllerErrorHandler(async (req: Request, res: Response) => {
        const id = req.params.id
        //TODO:validator
        if (!id) {
            const errMsg = `id is missing from the params`
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return
        }
        const offers = await this.service.getOffer(id)
        if (offers === null) {
            const errMsg = `no offers found`
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return
        }
        res.status(200).send(offers)
    })

    addSalonEvent = controllerErrorHandler(async (req: Request, res: Response) => {

        const d: EventDesignerI = req.body
        const designerEvent = await this.service.addSalonEvent(d)
        if (designerEvent === null) {
            logger.error(`Not able to update event`)
            res.status(400)
            res.send({ message: `Not able to update event: eventid -, event_id: ${d.event_id}` })
            return
        }

        res.status(201).send(designerEvent)
    })

    createOffer = controllerErrorHandler(async (req: Request, res: Response) => {
        //TODO:validator
        const id = req.params.id
        const serviceId = req.params.sid || req.body.service_id
        if (!serviceId) {
            const errMsg = `Service Id is missing`
            res.status(400)
            res.send({ errMsg })
            return
        }
        const e: OfferI = req.body
        const salon = await this.service.createOffer(id, serviceId, e)
        if (salon == null) {
            logger.error(`Not able to create offer`)
            res.status(400)
            res.send({ message: `Unable to create offer` })
            return
        }
        res.status(201).send(salon)

    })

    getSalonInfo = controllerErrorHandler(async (req: Request, res: Response) => {
        //TODO:validator
        const salonId = req.params.id;


        var centerPoint = {}
        //TODO: store location of User
        if (req.query.latitude && req.query.longitude) {

            //@ts-ignore
            centerPoint.lat = req.query.latitude
            //@ts-ignore
            centerPoint.lng = req.query.longitude
        }
        //  const sr: string = await SalonRedis.get(salonId)
        //  if (sr !== null) return res.send(JSON.parse(sr))
        const salon = await this.service.getSalonInfo(salonId, centerPoint)
        // SalonRedis.set(salonId, salon)
        res.status(200).send(salon)
    })

    getRecomendSalon = controllerErrorHandler(async (req: Request, res: Response) => {
        let salons

        //  const sr = await SalonRedis.get('Salons')
        const q = req.query
        //   if (sr !== null) { salons = JSON.parse(sr)
        //    }
        //   else {
        salons = await this.service.getSalon(q)
        //      SalonRedis.set('Salons', salons)
        // }
        res.status(200).send(salons)

    })
    getHomeServiceSalon = controllerErrorHandler(async (req: Request, res: Response) => {
        let salons
        var centerPoint = {}
        //TODO: store location of User
        //@ts-ignore
        centerPoint.lat = req.query.latitude
        //@ts-ignore
        centerPoint.lng = req.query.longitude
        const km = req.query.km || 2
        //    const sr = await SalonRedis.get('HomeSalons')
        //    if (sr !== null) { 
        //        salons = JSON.parse(sr)
        //     }
        //   else {
        console.log("not redis")
        salons = await this.service.getHomeServiceSalon(centerPoint, km.toString())
        SalonRedis.set('HomeSalons', salons)
        //   }
        res.status(200).send(salons)

    })
    // getSalonsRw = controllerErrorHandler(async (req: Request, res: Response) => {
    //     const rating = req.query.rating
    //     if (rating !== 'asc' && rating !== 'dsc')
    //         return res.status(400).send({ message: 'Send valid sorting order' })
    //     const data = new Array()
    //     let salons
    //     const sr = await SalonRedis.get('Salons')
    //     if (sr !== null) salons = JSON.parse(sr)
    //     else {
    //         salons = await this.service.getSalonsRw(rating, data)
    //         SalonRedis.set('Salons', salons)
    //     }
    //     res.status(200).send(salons)

    // })
    getSearchResult = controllerErrorHandler(async (req: Request, res: Response) => {
        //TODO:Validato
        const phrase = req.query.phrase as string
        if (!phrase)
            return res.status(400).send({ message: 'Provide search phrase' })
        const salon = await this.service.getSearchResult(phrase)
        res.status(200).send(salon)
    })
    // getSearchservice= controllerErrorHandler(async (req: Request, res: Response) => {
    //     //TODO:Validator
    //     const phrase = req.query.phrase as string

    //     if (!phrase)
    //         return res.status(400).send({ message: 'Provide search phrase' })
    //     const salon = await this.service.getSearchservice(phrase)
    //     res.status(200).send(salon)
    // })
    getSalonNearby = controllerErrorHandler(async (req: Request, res: Response) => {
        var centerPoint = {}
        //TODO: store location of User
        //@ts-ignore
        centerPoint.lat = req.query.latitude
        //@ts-ignore
        centerPoint.lng = req.query.longitude
        const km = (req.query.km || 2).toString()
        let salon
        const sr = await SalonRedis.get('Salons')
        if (sr !== null) salon = JSON.parse(sr)
        else {
            salon = await this.service.getSalonNearby(centerPoint, km)
            SalonRedis.set('Salons', salon)
        }
        res.status(200).send(salon)
    })

    getSalonDistance = controllerErrorHandler(async (req: Request, res: Response) => {
        var centerPoint = {}
        //TODO: store location of User
        //@ts-ignore
        centerPoint.lat = req.query.latitude
        //@ts-ignore
        centerPoint.lng = req.query.longitude
        const km = (req.query.km || 2).toString()
        const salonLocation = await this.service.getSalonDistance(centerPoint, km)
        res.status(200).send(salonLocation)

    })

    getSalonCategories = controllerErrorHandler(async (req: Request, res: Response) => {
        const _id = req.params.id
        const data = new Array()

        const category = await this.service.getSalonCategories(_id, data)
        res.send(category)

    })

    getSalonReviews = controllerErrorHandler(async (req: Request, res: Response) => {
        const _id = req.params.id
        const q = req.query
        const reviews = await this.service.getSalonReviews(_id, q)
        if (reviews === null) {
            logger.error(`No Reviews Found`)
            res.status(400)
            res.send({ message: `No Reviews Found` })
            return
        }
        res.send(reviews)

    })

    postSalonReviews = controllerErrorHandler(async (req: Request, res: Response) => {

        const _id = req.params.id
        const post: ReviewI = req.body
        console.log(req.body)
        //@ts-ignore
        post.user_id = req.userId
        post.salon_id = _id
       
        const postReview = await this.service.postReviews(post)
        const getReviews = await this.service.getReviewsRating(_id)
        const totalRating = getReviews[0].totalRating
        const totalItemCount = getReviews[0].totalItemcount
        const avgRating = totalRating/totalItemCount
        const rating = await this.service.put(_id,{rating:avgRating})
        if (postReview === null) {
            logger.error(`Unable to post`)
            res.status(400)
            res.send({ message: `Unable to post review` })
            return
        }
        res.send(postReview)


    })
    checkPostReviews = controllerErrorHandler(async (req: Request, res: Response) => {
        const _id = req.params.id
        //@ts-ignore
        const user_id = req.userId
        //@ts-ignore
        const check = await this.service.checkpostReview(user_id, _id)
        console.log(check)
        if (check == null) {
            res.status(400)
            res.send({ message: `User Cant Post Review,No Previous Bookings Found`, success: "false" })
            return

        }
        res.send({ success: "true" })



    })

    getBrands = controllerErrorHandler(async (req: Request, res: Response) => {

        const brand = await this.service.getBrand()
        if (brand === null) {
            res.status(400)
            res.send({ message: `No Brands Found` })
            return
        }
        res.send(brand)


    })
    getBrandbyId = controllerErrorHandler(async (req: Request, res: Response) => {

        const id = req.params.id
        const brand = await this.service.getBrandbyId(id)
        if (brand === null) {
            res.status(400)
            res.send({ message: `No Brands Found` })
            return
        }
        res.send(brand)
    })

    addBrand = controllerErrorHandler(async (req: Request, res: Response) => {
        const d = req.body
        const brand = await this.service.addBrand(d)
        if (brand === null) {
            res.status(400)
            res.send({ message: `Unable to create Brand` })
            return
        }
        res.send(brand)

    })
    searchFilter = controllerErrorHandler(async (req: Request, res: Response) => {
        const q = req.query

        const search = await this.service.searchFilter(q)
        if (search == null) {
            const errMsg = "No search Result";
            logger.error(errMsg);
            res.status(400);
            res.send({ message: errMsg });
            return
        }
        res.send(search)

    })

    reportSalon = controllerErrorHandler(async (req: Request, res: Response) => {
        var q = req.body
        //@ts-ignore
        q.user_id = req.userId
        if (!q.salon_id) {
            const errMsg = "send salon_id";
            logger.error(errMsg);
            res.status(400);
            res.send({ message: errMsg });
        }
        const report = await this.service.reportError(q)
        if (report === null) {
            const errMsg = "unable to report";
            logger.error(errMsg);
            res.status(400);
            res.send({ message: errMsg });
            return
        }
        res.status(200).send({ message: "Report submitted", success: "true" })


    })


    getSearchservice = controllerErrorHandler(async (req: Request, res: Response) => {
        const phrase = req.query.phrase as string

        if (!phrase)
            return res.status(400).send({ message: 'Provide search phrase' })

        const result = await this.service.getSalonService(phrase)
        res.send(result)
    })

    getRatings = controllerErrorHandler(async (req: Request, res: Response) => {
        const id = req.params.id
        const rating = await this.service.getReviewsRating(id)
        res.send(rating)

    })
    salonSlots =controllerErrorHandler ( async (req: Request, res: Response)=>{
        const id = req.params.id
        let gotSlotsDate =   req.query.slots_date || moment.now()
        
        //TODO:validator
        if (!gotSlotsDate) {
            const msg = "Something went wrong"
            logger.error(msg)
            res.status(400).send({ success: false, message: msg });
            return
        }
        const slotsDate = new Date(gotSlotsDate)
        if(moment(slotsDate).isBefore(moment().subtract(1,'day'))){
            const msg = "past booking not allowed"
            logger.error(msg)
            res.status(400).send({ success: false, message: msg });
            return
        }
      
        const slots = await this.service.salonSlots(id, slotsDate)
  
        if(slots==null){
            logger.error(`No Slots Found`)
            res.status(400)
            res.send({ message: `No Slots Found` })
            return
        }
        res.send(slots)

    })


}