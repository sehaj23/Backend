import { Router, Request, Response } from "express";
import BaseService from "./base.service";
import User from "../models/user.model";
import { PhotoI } from "../interfaces/photo.interface";
import Photo from "../models/photo.model";
import logger from "../utils/logger";
import CONFIG from "../config";
import UserI, { UserSI } from "../interfaces/user.interface";
import * as crypto from "crypto"
import mongoose from "../database";
import encryptData from "../utils/password-hash";
import { MigrationHubConfig } from "aws-sdk";
import { Mongoose } from "mongoose";
import ErrorResponse from "../utils/error-response";
import { userJWTVerification } from "../middleware/User.jwt";

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
        const user = await this.model.findOne({_id:id}) as UserSI
        user.address.push(d)
        await user.save()
        return user.address
    }

    updateAddress = async(userId:string, addressId: string, d:Object)=>{
        const user = await this.model.findOne({_id:userId, "address._id": mongoose.Types.ObjectId(addressId)}) as UserSI
        if(user === null) throw new Error("User with this address id not found")
        for(let add of user.address){
            //@ts-ignore
            if(add._id.toString() === addressId){
                for(let key of  Object.keys(d)) add[key] = d[key]
                await user.save()
                return user.address
            }
        }
        throw new Error("Address not found. Hence, not updated")
    }

    deleteAddress = async(userId:string, addressId: string)=>{
        const user = await this.model.findOne({_id:userId, "address._id": mongoose.Types.ObjectId(addressId)}) as UserSI
        if(user === null) throw new Error("User with this address id not found. Delete")
        for(let i = 0; i < user.address.length; i++){
            const add = user.address[i]
            //@ts-ignore
            if(add._id.toString() === addressId){
                user.address.splice(i, 1)
                await user.save()
                return user.address
            }
        }
        throw new Error("Address not found. Hence, not deleted")
    }

    getAddress = async(id:string)=>{
        const address = await this.model.findById({_id:id}).select("address")
        return address
    }
    

    addToFavourites = async (id:string,salon_id:string) => {
       const salonid = mongoose.Types.ObjectId(salon_id)
       console.log("salon id",salonid)
       console.log("user",id)
      // const user = await this.model.findOne({_id:id})
    
      //  const user = await this.model.findById({_id:id}) 
      //@ts-ignore 
          const user = await this.model.update({_id:id},{$push:{favourites:[salonid]}},{new:true})

            return user

    }
    getFavourites = async (id:string,) => {
        
           const user = await this.model.findOne({_id:id}).select("favourites").populate({path:"favourites" ,select:{name:"name",rating:"rating",location:"location"}})
 
            return user
 
     }
 


}