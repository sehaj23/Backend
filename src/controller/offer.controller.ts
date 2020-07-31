import BaseController from "./base.controller";
import OfferService from "../service/offer.service";
import { Request, Response } from "express";
import controllerErrorHandler from "../middleware/controller-error-handler.middleware";
import { OfferI } from "../interfaces/offer.interface";
import logger from "../utils/logger";

export default class OfferController extends BaseController {

    service: OfferService
    constructor(service: OfferService) {
        super(service)
        this.service = service
    }

    updateOffer =controllerErrorHandler( async (req: Request, res: Response) => {
       //TODO:validator
        const offerid = req.params.id
        const s: OfferI = req.body
        const date = new Date()

        if (!offerid) {
            const errMsg = "Offer not found"
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })

        }
        const offer = await this.service.updateOffer(offerid,date,s)
        if(offer==null){
            const errMsg = "unable to update offer";
            logger.error(errMsg);
            res.status(400);
            res.send({ message: errMsg });
        }
        res.send(offer)

    })

    allOffer =controllerErrorHandler( async (req: Request, res: Response) => {
        const offer = await this.service.allOffer
        if (!offer) {
            const errMsg = "No Offer found"
            logger.error(errMsg)
            res.send("No offer Found")
            return

        }
        res.send(offer)

    })
    disableOffer =controllerErrorHandler(   async (req: Request, res: Response) => {
        const offerid = req.params.id
       // TODO:validator
        if (!offerid) {
            const errMsg = "Offer not found"
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })

        }
        const offer = await this.service.disableOffer(offerid)
        if (!offer) {
            const errMsg = "No Offer found"
            logger.error(errMsg)
            res.send("No offer Found")
            return

        }
        res.send(offer)

    })
}