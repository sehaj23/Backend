import { Router, Request, Response } from "express";
import CONFIG from "../../config";
import logger from "../../utils/logger";
import { ServiceSI } from "../../interfaces/service.interface";
import mongoose from "../../database";

import Service from "../../models/service.model";
import BaseService from "./base.service";
const service = Router()

export default class ServiceServices {

    createService = async (req: Request, res: Response) => {
        try {
            const v: ServiceSI = req.body
            if (!v.name || !v.price || !v.duration) {
                res.status(403)
                res.send({ message: "Send all data" })
                return
            }
            const ser = await Service.create(v)
            res.send(ser)



        } catch (e) {
            const errMsg = `Unable to Create Service`
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
        }

    }
    getService = async (req: Request, res: Response) => {
        try {

            const service = await Service.find().populate("photos").populate("salons").populate("makeup_artists").exec()
            res.send(service)



        } catch (e) {
            const errMsg = `Unable to fetch Service`
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
        }

    }
    updateService = async (req: Request, res: Response) => {
        try {
            const v: ServiceSI = req.body
            const _id = req.params.id
            const ser = await Service.findByIdAndUpdate({ _id }, v, { new: true, runValidators: true }).populate("photos").populate("salons").populate("makeup_artists").exec()
            if (!ser) {
                const errMsg = `Unable to Edit Service`
                logger.error(errMsg)
                res.status(400)
                res.send({ message: errMsg })


            }
            res.send(ser)





        } catch (e) {
            const errMsg = `Unable to Edit Service`
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
        }

    }
    deleteService = async (req: Request, res: Response) => {
        try {
            const _id = req.params.id
            const ser = await Service.findByIdAndDelete(_id)
            if (!ser) {
                const errMsg = `Unable to Find Service`
                logger.error(errMsg)
                res.status(400)
                res.send({ message: errMsg })

            }
            res.send(ser)



        } catch (e) {
            const errMsg = `Unable to delete Service`
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
        }
    }
}