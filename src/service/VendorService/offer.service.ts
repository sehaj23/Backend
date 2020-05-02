import BaseService from "./base.service";

import {OfferI} from "../../interfaces/offer.interface"
import logger from "../../utils/logger";
import { Router, Request, Response } from "express";
import mongoose from "../../database";
import Offer from "../../models/offer.model";
const offer = Router()


export default class OfferService{

    createOffer = async (req: Request, res: Response) => {
            try {
                const e :OfferI = req.body

                if(!e.start_date || !e.end_date || !e.updated_price){
                    res.status(403)
                    res.send({message: "Send all data"})
                    return
                       
                }
                const offer = await Offer.create(req.body)
                res.send(offer)
                
            } catch (error) {
                const errMsg = "Unable to create Offer"
                logger.error(errMsg)
                res.status(400)
                res.send({message: errMsg})
                
            }


    }

    updateOffer = async (req: Request, res: Response) => {
        try {
            const offerid = req.params.id
            const s:OfferI = req.body
            const date  = new Date()
            
            if(!offerid){
                const errMsg = "Offer not found"
                logger.error(errMsg)
                res.status(400)
                res.send({message: errMsg})

            }
            const offer =await  Offer.findById(offerid)
            
            const odate = offer.start_date.toLocaleDateString()
           console.log(odate)
           console.log(date.toLocaleDateString())
            if(offer.start_date.valueOf()>date.valueOf()){
               const offer = await Offer.findByIdAndUpdate({_id:offerid},{s},{new: true})
               res.send(offer)
            }
            res.send("you cannot update")
        } catch (error) {
            const errMsg = "Offer not found"
            logger.error(errMsg)
            res.status(400)
            res.send({message: errMsg})
            
        }
   
   
    }
    allOffer = async (req: Request, res: Response) => {
            try {
                const salon_id = req.params.id
                if(!salon_id){
                    const errMsg = "Salon not found"
                    logger.error(errMsg)
                    res.status(400)
                    res.send({message: errMsg})

                }
                const offer = await Offer.find({salon_id:salon_id}).populate("services").exec()
                if(!offer){
                    const errMsg = "No Offer dound"
                    logger.error(errMsg)
                    res.send("No offer Found")
                    return

                }
                res.send(offer)
                
            } catch (error) {
                const errMsg = "Salon not found"
                    logger.error(errMsg)
                    res.status(400)
                    res.send({message: errMsg})

                
            }
    }

    disableOffer = async (req: Request, res: Response) => {
            try {
                const offerid = req.params.id
                if(!offerid){
                    const errMsg = "Offer not found"
                    logger.error(errMsg)
                    res.status(400)
                    res.send({message: errMsg})

                }
                
                const offer = await Offer.findByIdAndUpdate(offerid,{disable:true},{new:true}).populate("services").exec()
                res.send(offer)
            } catch (error) {
                
            }

    }




}