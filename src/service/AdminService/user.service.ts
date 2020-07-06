import { Router, Request, Response } from "express";
import BaseService from "./base.service";
import User from "../../models/user.model";
import { PhotoI } from "../../interfaces/photo.interface";
import Photo from "../../models/photo.model";
import logger from "../../utils/logger";
import CONFIG from "../../config";
import UserI from "../../interfaces/user.interface";
import * as crypto from "crypto"

export default class UserService extends BaseService{
    constructor(){
        super(User)
    }

    post = async (req: Request, res: Response) => {
        try {
            const v: UserI = req.body

            const passwordHash = crypto.createHash("md5").update(v.password!).digest("hex")
            v.password = passwordHash

            const user = await User.create(v)

            res.send(user)
        } catch (e) {
            logger.error(`${e.message}`)
            res.status(403)
            res.send({ message: `${CONFIG.RES_ERROR} ${e.message}` })
        }
    }

    putPhoto = async (req: Request, res: Response) => {
        try {
            const photoData: PhotoI = req.body
            const _id = req.params.id
            // saving photos 
            const photo = await Photo.create(photoData)
            // adding it to event
            const newEvent = await User.findByIdAndUpdate({_id},  { photo: photo._id }, { new: true }).populate("photo_ids").exec() // to return the updated data do - returning: true
            res.send(newEvent)
        } catch (e) {
            logger.error(`User Put Photo ${e.message}`)
            res.status(403)
            res.send({ message: `${CONFIG.RES_ERROR} ${e.message}` })
        }
    }

    
    getPhoto = async (req: Request, res: Response) => {
        try {
            const _id = req.params.id
            const eventPhotos = await User.findById(_id).select("photo").populate("photo").exec()
            res.send(eventPhotos);
        } catch (e) {
            logger.error(`User Get Photo ${e.message}`)
            res.status(403)
            res.send(e.message)
        }
    }

}