import { Request, Response } from "express";
import { EmployeeI } from "../interfaces/employee.interface";
import EventDesignerI from "../interfaces/eventDesigner.model";
import { OfferI } from "../interfaces/offer.interface";
import OptionI from "../interfaces/options.interface";
import { PhotoI } from "../interfaces/photo.interface";
import { ReviewI } from "../interfaces/review.interface";
import SalonSI, { SalonI } from "../interfaces/salon.interface";
import ServiceI from "../interfaces/service.interface";
import UserSearchI from "../interfaces/user-search.interface";
import controllerErrorHandler from "../middleware/controller-error-handler.middleware";
import { SalonRedis } from "../redis/index.redis";
import SalonService from "../service/salon.service";
import UserSearchService from "../service/user-search.service";
import UserService from "../service/user.service";
import ErrorResponse from "../utils/error-response";
import logger from "../utils/logger";
import BaseController from "./base.controller";
import moment = require("moment");
import PromoCodeService from "../service/promo-code.service";
import { PromoCodeSI } from "../interfaces/promo-code.interface";
import mongoose from "../database";
import REDIS_CONFIG from "../utils/redis-keys";


export default class SalonController extends BaseController {

    service: SalonService
    userSearchService: UserSearchService
    userService: UserService
    promoCodeService: PromoCodeService
    constructor(service: SalonService, userSearchService: UserSearchService, userService: UserService, promoCodeService: PromoCodeService) {
        super(service)
        this.service = service
        this.userSearchService = userSearchService
        this.userService = userService
        this.promoCodeService = promoCodeService
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

            if (req.query.home === "true") {
                atHome = true
            }

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
        if (salonn === null) {
            throw new ErrorResponse({ message: "Salon not found." })
        }
        const salon = salonn.toObject() as SalonI

        const services = salon.services
        const filterService = services.filter((service: ServiceI) => {
            const { options } = service
            const filterOptions = options.filter((opt: OptionI) => {
                if (req.query.gender) {
                    if (opt.gender !== req.query.gender && req.query.gender !== "both" && opt.gender !== "both") {
                        return false
                    }
                }
                if (atHome !== undefined) {
                    if (opt.at_home !== atHome) {
                        return false
                    }
                }
                return true
            })
            if (filterOptions.length > 0) {
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
        const filter = {}
        const q = req.query
        let getDistance=false
        //@ts-ignore
        const id = req.userId


        //TODO: validator
        if (!salonId) {
            const errMsg = `id is missing from the params`
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return
        }
        if (req.query.gender) {
            filter["gender"] = req.query.gender
        }
        let atHome: boolean
        if (req.query.home) {
            if (req.query.home === "true") {
                atHome = true

            }
            filter["home"] = req.query.home
        }
        filter["page_number"] = req.query.page_number
        filter["page_length"] = req.query.page_length
      
        var centerPoint = {}
        //TODO: store location of User
        if (req.query.latitude != null && req.query.longitude != null) {

            //@ts-ignore
            centerPoint.lat = req.query.latitude
            //@ts-ignore
            centerPoint.lng = req.query.longitude
            getDistance=true
        }
        filter["distance"] = getDistance
        const sr: string = await SalonRedis.get(salonId, filter)
        if (sr !== null) return res.send(JSON.parse(sr))
        const salonReq = this.service.getSalonInfo(salonId, centerPoint,getDistance)
        const reviewsReq = this.service.getSalonReviews(salonId, q)
        const promoCodeReq = this.promoCodeService.getPromoBySalon(salonId)

        const userReq = this.userService.getFavourites(id,q)

        const [salon, reviews, user, promocodes] = await Promise.all([salonReq, reviewsReq, userReq, promoCodeReq])
        const services = salon.services
        const filterService = services.filter((service: ServiceI) => {
            const { options } = service
            const filterOptions = options.filter((opt: OptionI) => {
                if (req.query.gender) {
                    if (opt.gender !== req.query.gender && req.query.gender !== "both" && opt.gender !== "both") {
                        return false
                    }
                }
                if (atHome !== undefined) {
                    if (opt.at_home !== atHome) {
                        return false
                    }
                }
                return true
            })
            if (filterOptions.length > 0) {
                service.options = filterOptions
                return true
            }
            return false
        })
        salon.services = filterService
        SalonRedis.set(salonId, { salon, reviews, user, promocodes }, filter)
        res.status(200).send({ salon, reviews, user, promocodes })
    })
    clearASalonRedisById=controllerErrorHandler(async (req: Request, res: Response) => {
    await SalonRedis.remove(req.params.id)
      res.status(200).send({message:"Redis clear  for the salon"})
    })
    getHomePageSalon = controllerErrorHandler(async (req: Request, res: Response) => { 
        let salons
        let getDistance = false
        //  const sr = await SalonRedis.get('Salons')
        const q:any = req.query
        if (q.latitude && q.longitude) {
            getDistance = false
        }
        const pageNumber: number = parseInt(q.page_number || 1)
        let pageLength: number = parseInt(q.page_length || 8)
        const latitude = q.latitude
        const longitude = q.longitude
        pageLength = (pageLength > 100) ? 100 : pageLength
        const skipCount = (pageNumber - 1) * pageLength
        const filter = {
            pageNumber,
            pageLength,
            skipCount,
            longitude,
            latitude,
            getDistance

        }
        let type= "salon"
        if(q.type){
                type=q.type
        }
        const redisKey = `getHomePageData`
        let out
        const cahceGetSalon = await SalonRedis.get(redisKey, filter)
        if (cahceGetSalon == null) {
            const recommendedReq  =  this.service.getSalon(q, getDistance)
            const nearbyReq =  this.service.getSalonNearby(q)
            const homeReq =  this.service.getHomeServiceSalon(q)
            const [recommended,nearby,home] = await Promise.all([recommendedReq,nearbyReq,homeReq])
            SalonRedis.set(redisKey, {recommended,nearby,home}, filter)
            out = {recommended,nearby,home}
        } else {
            out = JSON.parse(cahceGetSalon)
        }
        return res.status(200).send(out)
    })
    getRecomendSalon = controllerErrorHandler(async (req: Request, res: Response) => {
        let salons
        let getDistance = false
        //  const sr = await SalonRedis.get('Salons')
        const q:any = req.query
        if (q.latitude && q.longitude) {
            getDistance = false
        }
        const pageNumber: number = parseInt(q.page_number || 1)
        let pageLength: number = parseInt(q.page_length || 8)
        const latitude = q.latitude
        const longitude = q.longitude
        pageLength = (pageLength > 100) ? 100 : pageLength
        const skipCount = (pageNumber - 1) * pageLength
        const filter = {
            pageNumber,
            pageLength,
            skipCount,
            longitude,
            latitude,
            getDistance

        }
        let type= "salon"
        if(q.type){
                type=q.type
        }
        const redisKey = `get${type}`
        let out
        const cahceGetSalon = await SalonRedis.get(redisKey, filter)
        if (cahceGetSalon == null) {
            out = await this.service.getSalon(q, getDistance)
            SalonRedis.set(redisKey, out, filter)
        } else {
            out = JSON.parse(cahceGetSalon)

        }
        res.status(200).send(out)

    })
    getHomeServiceSalon = controllerErrorHandler(async (req: Request, res: Response) => {
        let salons
        const q = req.query
        //TODO: store location of User
        salons = await this.service.getHomeServiceSalon(q)
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
        const userSearch: UserSearchI = {
            term: phrase,
            result: salon
        }
        await this.userSearchService.post(userSearch)
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
        const q = req.query
        const salon = await this.service.getSalonNearby(q)
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
        //@ts-ignore
        post.user_id = req.userId
        post.salon_id = _id

        const postReview = await this.service.postReviews(post)
        const getReviews = await this.service.getReviewsRating(_id)
        const totalRating = getReviews[0].totalRating
        const totalItemCount = getReviews[0].totalItemcount
        const avgRating = totalRating / totalItemCount
        const rating = await this.service.put(_id, { rating: avgRating })
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



    getSalonCategory= controllerErrorHandler(async (req: Request, res: Response) => {
        const phrase = req.query.phrase as string
        let home: boolean
        if (req.query.home) {
            home = (req.query.home === "true")
        }

        if (!phrase)
            return res.status(400).send({ message: 'Provide search phrase' })

        const result = await this.service.getSalonCategory(phrase)
        const userSearch: UserSearchI = {
            term: phrase,
            result: result
        }
        await this.userSearchService.post(userSearch)
        res.send(result)
    })

    getSearchedService = controllerErrorHandler(async (req: Request, res: Response) => {
        const phrase = req.query.phrase as string
        let home: boolean
        if (req.query.home) {
            home = (req.query.home === "true")
        }

        if (!phrase)
            return res.status(400).send({ message: 'Provide search phrase' })

        const result = await this.service. getSearchservice(phrase)
        const userSearch: UserSearchI = {
            term: phrase,
            result: result
        }
        await this.userSearchService.post(userSearch)
        res.send(result)
    })

    getRatings = controllerErrorHandler(async (req: Request, res: Response) => {
        const id = req.params.id
        const q = req.query
        //@ts-ignore
        const _id = req.userId
        const reviewsReq = this.service.getSalonReviews(id, q)
        const ratingReq = this.service.getReviewsRating(id)
        const userReq = this.userService.getId(_id)
        const [rating, reviews, user] = await Promise.all([ratingReq, reviewsReq, userReq])
        res.send({ rating, user, reviews, })

    })
    salonSlots = controllerErrorHandler(async (req: Request, res: Response) => {
        const id = req.params.id
        let gotSlotsDate = req.query.slots_date || moment.now()

        //TODO:validator
        if (!gotSlotsDate) {
            const msg = "Something went wrong"
            logger.error(msg)
            res.status(400).send({ success: false, message: msg });
            return
        }
        //@ts-ignore
        const slotsDate = new Date(gotSlotsDate)
       
        // if (moment(slotsDate).isBefore(moment().subtract(1, 'day'))) {
        //     const msg = "past booking not allowed"
        //     logger.error(msg)
        //     res.status(400).send({ success: false, message: msg });
        //     return
        // }

        const slots = await this.service.salonSlots(id, slotsDate)

        if (slots == null) {
            logger.error(`No Slots Found`)
            res.status(400)
            res.send({ message: `No Slots Found` })
            return
        }
        res.send(slots)

    })

    getNameandId = controllerErrorHandler(async (req: Request, res: Response) => {
        const salon = await this.service.getNameandId()
        res.status(200).send(salon)
    })

    getUnapprovedSalon = controllerErrorHandler(async (req: Request, res: Response) => {
        const q = req.query
        const salon = await this.service.getUnapprovedWithPagination(q)
        res.status(200).send(salon)
    })

    getSalonPhoto = controllerErrorHandler(async (req: Request, res: Response) => {
        const id = req.params.id
        const salon = await this.service.getSalonPhoto(id)
        res.status(200).send(salon)
    })

    clearRedisSalonByPromo =  controllerErrorHandler(async(req:Request,res:Response)=>{
        const key  = REDIS_CONFIG.getSalonByPromoCodes
        await SalonRedis.remove(key)
        res.status(200).send({message:"Redis clear for salons by promocode"})
    })
    getSalonByPromo = controllerErrorHandler(async (req: Request, res: Response) => {
        const id = req.params.id
        const q: any = req.query
        let getDistance = false
        const pageNumber: number = parseInt(q.page_number || 1)
        //TODO: remove the static length from here switch to default
        let pageLength = 20
        //number = parseInt(q.page_length || 8)
        pageLength = (pageLength > 100) ? 100 : pageLength
        const skipCount = (pageNumber - 1) * pageLength
        if (q.latitude && q.longitude) {
            getDistance = false
        }
        const latitude = q.latitude
        const longitude = q.longitude
        const filter = {
            latitude,
            longitude,
            pageLength,
            pageNumber,
            id,
            getDistance
        }

        const redisKey = REDIS_CONFIG.getSalonByPromoCodes
        const promoGetSalon = await SalonRedis.get(redisKey, filter)
        let out
        let salonReq

        if (promoGetSalon == null) {
            const promo = await this.promoCodeService.getPromoById(id) as PromoCodeSI

            const salon = await this.service.getSalonByIds(promo.salon_ids, q, getDistance)

            SalonRedis.set(redisKey, {salon,promo}, filter)
            res.status(200).send({salon,promo})
        } else {

            out = JSON.parse(promoGetSalon)
            res.status(200).send(out)
        }

    })

    getDistanceInPairs = controllerErrorHandler(async (req: Request, res: Response) => {
        const getDistance = await this.service.getDistanceInPairs()
        res.send(getDistance)
    })












}