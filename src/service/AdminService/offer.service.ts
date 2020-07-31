import BaseService from "./base.service";
import Offer from "../../models/offer.model";
import { Request, Response } from "express";
import { salonInfoChecks } from "../../validators/salon-validator";
import Salon from "../../models/salon.model";



export default class OfferService extends BaseService{

    constructor(){
        super(Offer)
    }

    post = async (req: Request, res: Response) => {
        try {
            const id = req.params.id
            const serviceId = req.params.serviceId || req.body.service_id
            if(!serviceId){
                const errMsg = `Service Id is missing`
                res.status(400)
                res.send({errMsg})
                return
            }
            const offerData = req.body
            const offer = await Offer.create(offerData)
            if(offer === null){
                const errMsg = `Not able to create offer`
                res.status(400)
                res.send({errMsg})
                return
            }
            const offerId = offer._id
            const salon = await Salon.findOneAndUpdate({ _id: id, "services._id": serviceId },{$push: { "services.$.offers": offerId }}, { new: true })  
          //  const updatedService = await Service.findByIdAndUpdate(serviceId, {$push: {offers: offerId}}, {new: true})
            res.send(salon)
        } catch (error) {
            const errMsg = `Error: ${error.message}`
                res.status(400)
                res.send({errMsg})
        }
    }

}