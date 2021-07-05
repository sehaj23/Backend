import { Types } from "mongoose";
import mongoose from "../database";
import { UserSI } from "../interfaces/user.interface";
import { UserRedis } from "../redis/index.redis";
import encryptData from "../utils/password-hash";
import REDIS_CONFIG from "../utils/redis-keys";
import sendNotificationToDevice from "../utils/send-notification";
import BaseService from "./base.service";


export default class UserService extends BaseService {
    bookingModel: mongoose.Model<any, any>
    constructor(User: mongoose.Model<any, any>, bookingModel: mongoose.Model<any, any>) {
        super(User)
        this.bookingModel = bookingModel
    }

    getId = async (id: string) => {
        const redisUser = await UserRedis.get(id, { type: REDIS_CONFIG.userinfo })
        if (redisUser === null) {
            const user = await this.model.findOne({ _id: mongoose.Types.ObjectId(id) }).select("-password").populate("profile_pic").populate({ path: "employees", populate: { path: 'photo' } }).populate("user_id").populate("salon_id").populate("designer_id").populate("makeup_artist_id").populate("events").populate("salons").populate("services.employee_id").lean()
            UserRedis.set(id, user, { type:REDIS_CONFIG.userinfo})
            return user
        }
        return JSON.parse(redisUser)
    }

    getUser = async (userId) => {
        //@ts-ignore
        const user = await this.model.findOne({ _id: userId })
        console.log(user)
        user.password = ""
        return user
    }
    update = async (id: string, d: any) => {
        const _id = mongoose.Types.ObjectId(id)
        const redisUser = await UserRedis.remove(id, { type: REDIS_CONFIG.userinfo })
        const user = await this.model.findOneAndUpdate({ _id: _id }, d, { new: true })
        UserRedis.set(id, user, { type: REDIS_CONFIG.userinfo})
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

    updateFCM = async (id: string, fcm_token: any) => {

        const _id = mongoose.Types.ObjectId(id)
        //@ts-ignore
        const user = await this.model.findByIdAndUpdate(_id, { $addToSet: { fcm_token: fcm_token } }, { new: true })
        return user
    }
    deleteFCM = async (id: string, fcmToken: any) => {
        const _id = mongoose.Types.ObjectId(id)
        //@ts-ignore
        const user = await this.model.findOne(_id) as UserSI
        const fcmTokenIndex = user.fcm_token.indexOf(fcmToken)
        if (fcmTokenIndex > -1) {
            user.fcm_token.splice(fcmTokenIndex, 1)
            await user.save()
        } else {
            throw new Error("Fcm token not found")
        }

        return user
    }


    pastBooking = async (id: string) => {
        const booking = await this.bookingModel.find({ user_id: id }).populate("employee_id")
        return booking
    }
    addAddress = async (id: string, d: any) => {
        const user = await this.model.findOne({ _id: id }) as UserSI
        user.address.push(d)
        await user.save()
        return user.address
    }

    updateAddress = async (userId: string, addressId: string, d: Object) => {
        const user = await this.model.findOne({ _id: userId, "address._id": mongoose.Types.ObjectId(addressId) }) as UserSI
        if (user === null) throw new Error("User with this address id not found")
        for (let add of user.address) {
            //@ts-ignore
            if (add._id.toString() === addressId) {
                for (let key of Object.keys(d)) add[key] = d[key]
                await user.save()
                return user.address
            }
        }
        throw new Error("Address not found. Hence, not updated")
    }

    deleteAddress = async (userId: string, addressId: string) => {
        const user = await this.model.findOne({ _id: userId, "address._id": mongoose.Types.ObjectId(addressId) }) as UserSI
        if (user === null) throw new Error("User with this address id not found. Delete")
        for (let i = 0; i < user.address.length; i++) {
            const add = user.address[i]
            //@ts-ignore
            if (add._id.toString() === addressId) {
                user.address.splice(i, 1)
                await user.save()
                return user.address
            }
        }
        throw new Error("Address not found. Hence, not deleted")
    }

    getAddress = async (id: string) => {
        const address = await this.model.findById({ _id: id }).select("address")
        return address
    }


    addToFavourites = async (id: string, salon_id: string) => {
        UserRedis.remove(id, { type: "favourites" })
        const salonid = mongoose.Types.ObjectId(salon_id)
        //@ts-ignore 
        const user = await this.model.update({ _id: id }, { $push: { favourites: [salonid] } }, { new: true })

        return user

    }
    getFavourites = async (id: string, q: any) => {
        const pageNumber: number = parseInt(q.page_number || 1)
        let pageLength: number = parseInt(q.page_length || 25)
        pageLength = (pageLength > 100) ? 100 : pageLength
        const skipCount = (pageNumber - 1) * pageLength
        const redisUser = await UserRedis.get(id, { type: "favourites" })
        if (redisUser === null) {
            const user = await this.model.findOne({ _id: id }).limit(pageLength).skip(skipCount).select("favourites").populate({
                path: "favourites", select: {
                    name: 1, rating: 1, location: 1
                    , profile_pic: 1
                },
                populate: {
                    path: 'profile_pic'
                }
            })
            UserRedis.set(id, JSON.stringify(user), { type: "favourites" })
            return user
        }
        return JSON.parse(redisUser)
    }
    removeFavourites = async (id: string, salon_id: string) => {
        UserRedis.remove(id, { type: "favourites" })
        //@ts-ignore
        const user = await this.model.findByIdAndUpdate({ _id: id }, { $pull: { favourites: salon_id } }, { new: true })
        return user
    }
    sendNotification = async (fcm_token: string, message: any) => {
        var messageee = {
            notification: {
                title: '$FooCorp up 1.43% on the day',
                body: '$FooCorp gained 11.80 points to close at 835.67, up 1.43% on the day.'
            },
        };


        const notification = sendNotificationToDevice(fcm_token, message)
        return notification
    }


    searchUsersByEmail = async (q) => {

        const pageNumber: number = parseInt(q.page_number || 1)
        let pageLength: number = parseInt(q.page_length || 25)
        pageLength = (pageLength > 100) ? 100 : pageLength
        const skipCount = (pageNumber - 1) * pageLength
        const keys = Object.keys(q)
        const filters = {}

        for (const k of keys) {
            switch (k) {
                case "email":
                    filters["email"] = {
                        $regex: `.*${q.email}.*`, $options: 'i'
                    }
                    break
                case "name":
                    filters["name"] = {
                        $regex: `.*${q.name}.*`, $options: 'i'
                    }
                    break
                default:
                    filters[k] = q[k]
            }
        }
        console.log(filters)
        const userDetailsReq = this.model.find(filters).skip(skipCount).limit(pageLength).sort('-createdAt')
        const userPagesReq = this.model.count(filters)
        //const userStatsReq = this.model.find(filters).skip(skipCount).limit(pageLength).sort('-createdAt')


        const [userDetails, userPages] = await Promise.all([userDetailsReq, userPagesReq])
        return ({ userDetails, userPages })


    }
    updateNewPass = async (id: string, email: string, password: string) => {
        const passwordHash = encryptData(password)
        return await this.model.findOneAndUpdate({ _id: id, email: email }, { password: passwordHash }, { new: true })

    }

    // this is to add balance to wallet
    addBalance = async (userId: string, amount: number) => {
        const user: UserSI = await this.model.findOne({ _id: Types.ObjectId(userId) })
        if (user.balance === undefined) {
            user.balance = 0
        }
        const strAmount = amount.toFixed(2)
        const floatAmount = parseFloat(strAmount)
        user.balance += floatAmount
       
      
       const redisUser = await UserRedis.remove(userId, { type: REDIS_CONFIG.userinfo })
         await  Promise.all([user.save(),redisUser])
         UserRedis.set(userId, user, { type: REDIS_CONFIG.userinfo })
        return user
    }

    // this is to minus balance to wallet
    minusBalance = async (userId: string, amount: number) => {
        if (amount > 0) throw new Error(`To minus transction amount should be less than 0: ${amount}`)
        const user: UserSI = await this.model.findOne({ _id: Types.ObjectId(userId) })
        if (user.balance === undefined) {
            user.balance = 0
        }
        const strAmount = amount.toFixed(2)
        const floatAmount = parseFloat(strAmount)
        if (floatAmount > user.balance) throw new Error(`User balance is less: ${user.balance}`)
        user.balance += floatAmount
        await user.save()
        UserRedis.set(userId, user, { type: REDIS_CONFIG.userinfo })
        return user
    }
    createRefferal = async (name: string, id: string) => {
        const refferal = name.toUpperCase().substr(0, 4) + id.substr(0, 4)
        return refferal
    }



}