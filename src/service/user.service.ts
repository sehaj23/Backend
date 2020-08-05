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
import encryptData from "../utils/password-hash";

export default class UserService extends BaseService {
    bookingModel: mongoose.Model<any, any>
    constructor(User: mongoose.Model<any, any>,bookingModel:mongoose.Model<any,any>) {
        super(User)
        this.bookingModel=bookingModel
    }

    getUser = async (userId) => {
        //@ts-ignore
        const user = await this.model.findOne({_id:userId})
        console.log(user)
        user.password=""
        return user
    }
    update = async (id: string,d: any) => {
        const _id = mongoose.Types.ObjectId(id)
        const user = await this.model.findByIdAndUpdate(_id, d, { new: true })
        return user
    }
    updatePass = async (id: string, password: string, newpassword: String) => {
        //@ts-ignore
        const _id = mongoose.Types.ObjectId(id)
        const passwordHash = encryptData(password)
        const user = await this.model.findOne({ _id, password: passwordHash })
        const newpasswordHash = encryptData(newpassword)
        if (user !== null) {
            const updatepass = await this.model.findByIdAndUpdate({ _id }, { password: newpasswordHash }, { new: true })
            return updatepass
        } 
        return null
    }

    pastBooking = async(id:string)=>{
        const booking = await this.bookingModel.find({user_id:id}).populate("employee_id")
        return booking
    }
    addAddress = async(id:string,d:any)=>{
        const user = await this.model.findByIdAndUpdate({_id:id},d,{new:true}).select("address")
        return user
    }

    getAddress = async(id:string)=>{
        const address = await this.model.findById({_id:id}).select("address")
        return address
    }
    updateProfilePic = async (req: Request, res: Response) => {
        try {
           
            //@ts-ignore
            const _id = req.vendorId
            const photoData: PhotoI = req.body
            // saving photos 
            const photo = await Photo.create(photoData)
            // adding it to event
            const newEvent = await this.model.findByIdAndUpdate({ _id }, { photo: photo._id }, { new: true }).populate("photo").exec() // to return the updated data do - returning: true
            res.send(newEvent)
        } catch (e) {
            logger.error(`User Put Photo ${e.message}`)
            res.status(400)
            res.send({ message: `${CONFIG.RES_ERROR} ${e.message}` })
        }
    }


}