import BaseService from "./base.service";

import { OfferI } from "../../interfaces/offer.interface"
import logger from "../../utils/logger";
import { Router, Request, Response } from "express";
import mongoose from "../../database";
import Offer from "../../models/offer.model";

const offer = Router()


export default class OfferService {

    // createOffer = async (req: Request, res: Response) => {
    //     try {
    //         const serviceid = req.params.id;
    //         const e: OfferI = req.body

    //         if (!e.start_date || !e.end_date || !e.updated_price) {
    //             res.status(403)
    //             res.send({ message: "Send all data" })
    //             return

    //         }
    //         if (!serviceid) {
    //             const errMsg = "Service id not found"
    //             logger.error(errMsg)
    //             res.status(400)
    //             res.send({ message: errMsg })
    //             return
    //         }
    //         const service = await Service.findById(serviceid)

    //         if (!service) {
    //             const errMsg = "Service not found"
    //             logger.error(errMsg)
    //             res.status(400)
    //             res.send({ message: errMsg })
    //             return
    //         }
    //         const uniquecode = (service.name).slice(0, 4).toLocaleUpperCase().concat(e.updated_price.toLocaleString())
    //         req.body.unique_code = uniquecode



    //         const offer = await Offer.create(req.body)

    //         const services = await Service.findByIdAndUpdate(serviceid, { $push: { offers: offer._id } }, { new: true })
    //         res.send(offer)

    //     } catch (error) {
    //         const errMsg = "Unable to create Offer"
    //         logger.error(errMsg)
    //         res.status(400)
    //         res.send({ message: errMsg })

    //     }


    // }

    updateOffer = async (req: Request, res: Response) => {
        try {
            const offerid = req.params.id
            const s: OfferI = req.body
            const date = new Date()

            if (!offerid) {
                const errMsg = "Offer not found"
                logger.error(errMsg)
                res.status(400)
                res.send({ message: errMsg })

            }
            const offer = await Offer.findById(offerid)

            const odate = offer.start_date.toLocaleDateString()
            console.log(odate)
            console.log(date.toLocaleDateString())
            if (offer.start_date.valueOf() > date.valueOf()) {
                const offer = await Offer.findByIdAndUpdate({ _id: offerid }, { s }, { new: true })
                res.send(offer)
            }
            res.status(200).send("you cannot update")

        } catch (error) {
            const errMsg = "Offer not found"
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })

        }


    }
    allOffer = async (req: Request, res: Response) => {
        try {

            const offer = await Offer.find({})
            if (!offer) {
                const errMsg = "No Offer dound"
                logger.error(errMsg)
                res.send("No offer Found")
                return

            }
            res.send(offer)

        } catch (error) {
            const errMsg = "Offer not found"
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })


        }
    }

    disableOffer = async (req: Request, res: Response) => {
        try {
            const offerid = req.params.id
            if (!offerid) {
                const errMsg = "Offer not found"
                logger.error(errMsg)
                res.status(400)
                res.send({ message: errMsg })

            }

            const offer = await Offer.findByIdAndUpdate(offerid, { disable: true }, { new: true }).populate("services").exec()
            res.send(offer)
        } catch (error) {

        }

    }




}