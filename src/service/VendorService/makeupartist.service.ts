import { Router, Request, Response } from "express";
import CONFIG from "../../config";
import logger from "../../utils/logger";
import MakeupArtist from "../../models/makeupArtist.model";
import { EventMakeupArtistI } from "../../interfaces/eventMakeupArtist.interface";
import mongoose from "../../database";
import Event from "../../models/event.model";
import BaseService from "./base.service";
import { EmployeeI } from "../../interfaces/employee.interface";
import Employee from "../../models/employees.model";
import { MakeupArtistI } from "../../interfaces/makeupArtist.interface";
import Vendor from "../../models/vendor.model";
import Service from "../../models/service.model";
import ServiceI from "../../interfaces/service.interface";
import { vendorJWTVerification } from "../../middleware/VendorJwt"

export default class MakeupartistServiceC extends BaseService {

    constructor() {
        super(MakeupArtist)
    }

    post = async (req: Request, res: Response) => {
        try {
            const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
            if (!token) {
                logger.error("No token provided.")
                res.status(401).send({ success: false, message: 'No token provided.' });
                return
            }
            const decoded = await vendorJWTVerification(token)
            if (decoded === null) {
                logger.error("Something went wrong")
                res.status(401).send({ success: false, message: 'Something went wrong' });
                return
            }
            //@ts-ignore
            req.body.vendor_id = decoded._id
            const ma: MakeupArtistI = req.body
            const makeupartist = await MakeupArtist.create(ma)
            //@ts-ignore
            const _id = mongoose.Types.ObjectId(decoded._id)
            await Vendor.findOneAndUpdate({ _id }, { $push: { makeup_artists: makeupartist._id } })

            res.send(makeupartist)
        } catch (e) {
            logger.error(`${e.message}`)
            res.status(400)
            res.send({ message: `${CONFIG.RES_ERROR} ${e.message}` })
        }
    }

    patchMakeupArtist = async (req: Request, res: Response) => {

        try {
            const id = req.params.id
            const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
            if (!token) {
                logger.error("No token provided.")
                res.status(401).send({ success: false, message: 'No token provided.' });
                return
            }
            const decoded = await vendorJWTVerification(token)
            if (decoded === null) {
                logger.error("Something went wrong")
                res.status(401).send({ success: false, message: 'Something went wrong' });
                return
            }
            //@ts-ignore
            const vendor_id = decoded._id
            if (!id) {
                const errMsg = "MakeupArtist ID not found"
                logger.error(errMsg)
                res.status(400)
                res.send({ message: errMsg })
                return

            }

            const d = req.body

            const makeupartist = await MakeupArtist.findOneAndUpdate({_id:id,vendor_id:vendor_id}, d, { new: true })
            res.send(makeupartist)


        } catch (error) {
            const errMsg = "MakeupArtist ID not found"
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return

        }


    }
    makeupArtistSettings = async (req: Request, res: Response) => {
        try {
            const makeupArtist_id = req.params.id

            if (!makeupArtist_id) {
                const errMsg = "MakeupArtist ID not found"
                logger.error(errMsg)
                res.status(400)
                res.send({ message: errMsg })
                return
            }
            const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
            if (!token) {
                logger.error("No token provided.")
                res.status(401).send({ success: false, message: 'No token provided.' });
                return
            }
            const decoded = await vendorJWTVerification(token)
            if (decoded === null) {
                logger.error("Something went wrong")
                res.status(401).send({ success: false, message: 'Something went wrong' });
                return
            }
            //@ts-ignore
            const vendor_id = decoded._id
            const updates = Object.keys(req.body)
            const allowedupates = ["name", "location", "start_working_hours"]
            const isvalid = updates.every((update) => allowedupates.includes(update))



            if (!isvalid) {
                const errMsg = "Error updating MakeupArtist"
                logger.error(errMsg)
                res.status(400)
                res.send({ message: errMsg })
                return
            }
            const mua = await MakeupArtist.findById(makeupArtist_id)
            updates.forEach((update) => {

                mua[update] = req.body[update]

            })
            const updatedmua = await mua.save()
            //const updatedmua = await MakeupArtist.update({_id:makeupArtist_id},{$set:updates},{new:true})
            res.send(updatedmua)



        } catch (error) {
            const errMsg = "Error updating Makeupartist"
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return

        }


    }
    addMakeupArtistService = async (req: Request, res: Response) => {
        try {
            const d: ServiceI = req.body.services
            const _id = mongoose.Types.ObjectId(req.params.id)
            if (!_id) {
                logger.error(`Salon Id is missing salon_id: ${d.salon_id} & mua_id: ${d.mua_id}`)
                res.status(403)
                res.send({ message: `Salon Id is missing salon_id: ${d.salon_id} & mua_id: ${d.mua_id}` })
                return
            }
            const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
            if (!token) {
                logger.error("No token provided.")
                res.status(401).send({ success: false, message: 'No token provided.' });
                return
            }
            const decoded = await vendorJWTVerification(token)
            if (decoded === null) {
                logger.error("Something went wrong")
                res.status(401).send({ success: false, message: 'Something went wrong' });
                return
            }
            //@ts-ignore
            const vendor_id = decoded._id

            const service = await Service.create(d)
            const service_id = mongoose.Types.ObjectId(service._id)
            console.log(service)
            //@ts-ignore
            var result = service.map(service_id => ({ _id: mongoose.Types.ObjectId(service_id.id) }));
            console.log(result)



            //@ts-ignore
            const newSalon = await MakeupArtist.findOneAndUpdate({ _id,vendor_id, services: { $nin: [service_id] } }, { $push: { services: { $each: result } } }, { new: true }).populate("services").exec()
            if (newSalon === null) {
                const errMsg = `Add Services: no data with this _id and service was found`
                logger.error(errMsg)
                res.status(403)
                res.send({ message: errMsg })
                return
            }
            //   console.log(newSalon)
            res.send(newSalon)
        } catch (e) {
            logger.error(`${e.message}`)
            res.status(403)
            res.send({ message: `${CONFIG.RES_ERROR} ${e.message}` })
        }
    }
    deleteMakeupArtistService = async (req: Request, res: Response) => {
        try {
            const sid = req.params.sid
            const _id = req.params.id
            if (!_id || !sid) {
                logger.error(`Salon Id is missing salon_id:  & mua_id: `)
                res.status(403)
                res.send({ message: `Salon Id is missing salon_id: ` })
                return
            }
            const osid = mongoose.Types.ObjectId(sid)
            const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
            if (!token) {
                logger.error("No token provided.")
                res.status(401).send({ success: false, message: 'No token provided.' });
                return
            }
            const decoded = await vendorJWTVerification(token)
            if (decoded === null) {
                logger.error("Something went wrong")
                res.status(401).send({ success: false, message: 'Something went wrong' });
                return
            }
            //@ts-ignore
            const vendor_id = decoded._id


            // @ts-ignore
            const newSalon = await MakeupArtist.findOneAndUpdate({ _id,vendor_id, services: { $in: [osid] } }, { $pull: { services: osid } }, { new: true })
            if (newSalon === null) {
                const errMsg = `Delete Service: no data with this _id and service was found`
                logger.error(errMsg)
                res.status(403)
                res.send({ message: errMsg })
                return
            }
            res.send(newSalon)
        } catch (e) {
            logger.error(`${e.message}`)
            res.status(403)
            res.send({ message: `${CONFIG.RES_ERROR} ${e.message}` })
        }

    }
    getService = async (req: Request, res: Response) => {
        try {
            const id = req.params.id
            if (!id) {
                const errMsg = `id is missing from the params`
                logger.error(errMsg)
                res.status(400)
                res.send({ message: errMsg })
                return
            }
            const monogId = mongoose.Types.ObjectId(id)
            const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
            if (!token) {
                logger.error("No token provided.")
                res.status(401).send({ success: false, message: 'No token provided.' });
                return
            }
            const decoded = await vendorJWTVerification(token)
            if (decoded === null) {
                logger.error("Something went wrong")
                res.status(401).send({ success: false, message: 'Something went wrong' });
                return
            }
            //@ts-ignore
            const vendor_id = decoded._id
            //@ts-ignore
            const mua = await MakeupArtist.find({ _id: monogId,vendor_id:vendor_id }).select("services").populate("services").exec()
            //  const services = await Service.find({mua_id: monogId})
            if (mua === null) {
                const errMsg = `no service found`
                logger.error(errMsg)
                res.status(400)
                res.send({ message: errMsg })
                return
            }
            res.send(mua)
        } catch (e) {
            logger.error(`Booking service ${e.message}`)
            res.status(403)
            res.send({ message: `${e.message}` })
        }
    }

    updateService = async (req: Request, res: Response) => {

        try {
            const d = req.body
        
            const id = mongoose.Types.ObjectId(req.params.id)
            //id is salon id
            const sid = mongoose.Types.ObjectId(req.params.sid)
            // const service = req.body
            if (!id || !sid) {
                logger.error(`sid and id not found`)
                res.status(403)
                res.send({ message: "SID and ID not found" })


            }
            const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
            if (!token) {
                logger.error("No token provided.")
                res.status(401).send({ success: false, message: 'No token provided.' });
                return
            }
            const decoded = await vendorJWTVerification(token)
            if (decoded === null) {
                logger.error("Something went wrong")
                res.status(401).send({ success: false, message: 'Something went wrong' });
                return
            }
            //@ts-ignore
            const vendor_id = decoded._id
            console.log(vendor_id)
            console.log(id)
            console.log(sid)
            //@ts-ignore
            const mua = await Service.findByIdAndUpdate(sid,d,{new:true})
            // const salon  = await Salon.findOneAndUpdate({_id:id,sid:{$in:service}},{service},{new:true}).select("service").populate("service").exec()
            res.send(mua)

        } catch (error) {
            logger.error(`error while updating`)
            res.status(403)
            res.send({ message: "unable to update" })

        }

    }

}