import { Router, Request, Response } from "express";
import CONFIG from "../../config";
import logger from "../../utils/logger";
import Designer from "../../models/designers.model";
import Event from "../../models/event.model";
import EventDesignerI from "../../interfaces/eventDesigner.model";
import mongoose from "../../database";
import BaseService from "./base.service";
import { DesignersI } from "../../interfaces/designer.interface";
import Vendor from "../../models/vendor.model";

export default class DesignerService extends BaseService{

    constructor(){
        super(Designer)
    }

    post = async (req: Request, res: Response) => {
        try {
            const d: DesignersI = req.body
            const designer = await Designer.create(d)
            const _id = designer.vendor_id
            await Vendor.findOneAndUpdate({_id}, {$push: {designers: designer._id}})
            res.send(designer)
        } catch (e) {
            logger.error(`${e.message}`)
            res.status(400)
            res.send({ message: `${CONFIG.RES_ERROR} ${e.message}` })
        }
    }
}