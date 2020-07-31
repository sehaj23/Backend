import { Router, Request, Response } from "express";
import BaseService from "./base.service";
import User from "../models/user.model";
import { PhotoI } from "../interfaces/photo.interface";
import Photo from "../models/photo.model";
import logger from "../utils/logger";
import CONFIG from "../config";
import UserI from "../interfaces/user.interface";
import * as crypto from "crypto"
import mongoose from "../database";

export default class UserService extends BaseService {
    constructor(User: mongoose.Model<any, any>) {
        super(User)
    }

    postUser = async (req: Request, res: Response) => {
        try {
            const v: UserI = req.body

            const passwordHash = crypto.createHash("md5").update(v.password!).digest("hex")
            v.password = passwordHash

            const vendor = await this.model.create(v)

            res.send(vendor)
        } catch (e) {
            logger.error(`${e.message}`)
            res.status(403)
            res.send({ message: `${CONFIG.RES_ERROR} ${e.message}` })
        }
    }

    

}