import Salon from "../../models/salon.model"
import Service from "../../models/service.model"
import { Request, Response } from "express"
import CONFIG from "../../config"
import BaseService from "./base.service"
import { arePointsNear, compare } from "../../utils/location"

export default class SalonInfoService extends BaseService {
    constructor() {
        super(Salon)
    }

    // Salon Info
    getSalonInfo = async (req: Request, res: Response) => {
        try {
            const salonId = req.params.id
            if (!salonId)
                return res.status(400).send({
                    message: "Id not provided",
                })
            const salon = await Salon.findById(salonId)
            if (!salon)
                return res.status(404).send({
                    message: "Salon not found",
                })
            res.status(200).send(salon)
        } catch (e) {
            res.status(500).send({
                message: `${CONFIG.RES_ERROR} ${e.message}`,
            })
        }
    }

    //   isEmpty = (obj) => {
    //     for (var key in obj) {
    //       if (obj.hasOwnProperty(key)) return false
    //     }
    //     return true
    //   }

    // Search by salon/location/service
    getSalon = async (req: Request, res: Response) => {
        try {
            const phrase = req.query.phrase
            let result1, result2

            if (!phrase)
                return res.status(400).send({ message: "Provide search phrase" })

            result1 = await Salon.find(
                { $text: { $search: phrase } },
                { score: { $meta: "textScore" } }
            ).sort({ score: { $meta: "textScore" } })

            result2 = await Service.find(
                { $text: { $search: phrase } },
                { score: { $meta: "textScore" } }
            ).sort({ score: { $meta: "textScore" } })

            // TODO Discuss and change Salon-Service schema
            //   for (let [key, value] of Object.entries(result2)) {
            //     const salon = await Salon.find({ _id: { $in: key["salon_id"] } })
            //     value.salon = salon
            //   }

            const data = { ...result1, ...result2 }
            res.status(200).send(data)
        } catch (e) {
            res.status(500).send({
                message: `${CONFIG.RES_ERROR} ${e.message}`,
            })
        }
    }

    //Search by service
    //   getService = async (req: Request, res: Response) => {
    //     try {
    //       const service = req.query.service
    //       if (!service)
    //         return res.status(400).send({ message: "Provide service name" })
    //       const result = await Service.find(
    //         { $text: { $search: service } },
    //         { score: { $meta: "textScore" } }
    //       ).sort({ score: { $meta: "textScore" } })
    //       res.status(200).send(result)
    //     } catch (e) {
    //       res.status(500).send({
    //         message: `${CONFIG.RES_ERROR} ${e.message}`,
    //       })
    //     }
    //   }

    //get Salons nearby
    getSalonNearby = async (req: Request, res: Response) => {
        try {
            //git TODO: store location of User
            var centerPoint = {}
            var checkPoint = {}
            var salonLocation = new Array();
            //@ts-ignore
            centerPoint.lat = req.query.latitude,
                //@ts-ignore
                centerPoint.lng = req.query.longitude
            const km = req.query.km || 2;
            const salon = await Salon.find({})
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
            res.send(salonLocation);


        } catch (error) {
            res.status(500).send({
                message: `${CONFIG.RES_ERROR} ${error.message}`

            })
        }
    }
    //get salon distancewise
    getSalonDistance = async (req: Request, res: Response) => {
        try {
            //git TODO: store location of User
            var centerPoint = {}
            var checkPoint = {}
            var salonLocation = new Array();
            var sortedSalonLocation = new Array();
            var temp;
            var mapped;
            //@ts-ignore
            centerPoint.lat = req.query.latitude,
                //@ts-ignore
                centerPoint.lng = req.query.longitude
            const km = req.query.km || 2;
            const salon = await Salon.find({})
            for (var a = 0; a < salon.length; a++) {
                if (salon[a].longitude != null && salon[a].latitude != null) {
                    //@ts-ignore
                    checkPoint.lng = salon[a].longitude
                    //@ts-ignore
                    checkPoint.lat = salon[a].latitude
                    var n = await arePointsNear(checkPoint, centerPoint, km)
                    if (n.bool) {
                        //@ts-ignore
                        salonLocation.push(salon[a], salon[a].difference = n.difference)
                    }
                }
            }
            res.send(salonLocation)
        } catch (error) {
            res.status(500).send({
                message: `${CONFIG.RES_ERROR} ${error.message}`

            })
        }
    }
}


