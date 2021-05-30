import Admin from "../models/admin.model";
import * as crypto from "crypto"
import AdminI, { AdminSI ,AdminRoleT } from "../interfaces/admin.interface";
import BaseService from "../service/base.service";
import mongoose from "../database";


export default class AdminService extends BaseService{

    post = async (admin: AdminI) => {
        const passwordHash = crypto.createHash("md5").update(admin.password).digest("hex")
        admin.password = passwordHash         
        const gotAdmin = await Admin.create(admin)
        gotAdmin.password = undefined
        return gotAdmin
    }

    login = async (username: string, password: string) => {
        // this.model is coming from the base service class
        const passwordHash = crypto.createHash("md5").update(password).digest("hex")
        
        return this.model.findOne({username, password: passwordHash})
    }

    updateFCM = async (id: string, fcm_token: any) => {

        const _id = mongoose.Types.ObjectId(id)
        //@ts-ignore
        const user = await this.model.findByIdAndUpdate(_id, { $addToSet: { fcm_token: fcm_token } }, { new: true })
        return user
    }
    deleteFCM = async (id: string, fcmToken: any) => {
        const _id = mongoose.Types.ObjectId(id)
        //@ts-ignore
        const user = await this.model.findOne(_id ) as AdminSI
        const fcmTokenIndex = user.fcm_token.indexOf(fcmToken)
        if(fcmTokenIndex >-1){
            user.fcm_token.splice(fcmTokenIndex,1)
            await user.save()    
        }else{
            throw new Error("Fcm token not found")
        }
        
        return user
    }
}
