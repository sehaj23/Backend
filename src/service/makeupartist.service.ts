import { Router, Request, Response } from "express";
import CONFIG from "../config";
import logger from "../utils/logger";

import { EventMakeupArtistI } from "../interfaces/eventMakeupArtist.interface";
import mongoose from "../database";

import BaseService from "./base.service";
import { EmployeeI } from "../interfaces/employee.interface";

import { MakeupArtistI } from "../interfaces/makeupArtist.interface";

import ServiceI from "../interfaces/service.interface";
import { vendorJWTVerification } from "../middleware/VendorJwt"

export default class MakeupartistService extends BaseService {
    employeeModel: mongoose.Model<any, any>
    vendorModel: mongoose.Model<any, any>
    eventModel: mongoose.Model<any, any>
    offerModel: mongoose.Model<any, any>


    constructor(muamodel: mongoose.Model<any, any>, employeeModel: mongoose.Model<any, any>, vendorModel: mongoose.Model<any, any>, eventModel: mongoose.Model<any, any>, offerModel: mongoose.Model<any, any>) {
        super(muamodel);
        this.employeeModel = employeeModel
        this.vendorModel = vendorModel
        this.eventModel = eventModel
        this.offerModel = offerModel

    }



    postMua = async (ma: MakeupArtistI) => {



        const makeupartist = await this.model.create(ma)
        //@ts-ignore
        const _id = mongoose.Types.ObjectId(ma.vendor_id)
        await this.vendorModel.findOneAndUpdate({ _id }, { $push: { makeup_artists: makeupartist._id } })
        return makeupartist



    }

    patchMakeupArtist = async (id: string, vendor_id: string, d) => {
        const makeupartist = await this.model.findOneAndUpdate({ _id: id, vendor_id: vendor_id }, d, { new: true })
        return makeupartist

    }
    makeupArtistSettings = async (makeupArtist_id: string, update: Array<string>, vendor_id: string) => {


        const mua = await this.model.findOneAndUpdate({ _id: makeupArtist_id, vendor_id: vendor_id },update,{new:true})
        
      
        //const updatedmua = await MakeupArtist.update({_id:makeupArtist_id},{$set:updates},{new:true})
        return mua


    }
    addMakeupArtistService = async (_id: string, vendor_id, d) => {
        const muaService = await this.model.findOneAndUpdate({ _id: _id, vendor_id: vendor_id }, { $push: { services: { $each: d, $postion: 0 } } }, { new: true })
        return muaService
    }

    deleteMakeupArtistService = async (id: string, sid: string, vendor_id: string) => {
        const _id = mongoose.Types.ObjectId(id)
        // @ts-ignore
        const deleteMuaService = await this.model.findOneAndUpdate({ _id: _id, vendor_id: vendor_id }, { $pull: { services: { _id: osid } } }, { new: true })
        return deleteMuaService
    }
    getService = async (id: string, vendor_id: string) => {


        const muaId = mongoose.Types.ObjectId(id)
        //@ts-ignore
        const muaService = await this.model.find({ _id: muaId, vendor_id: vendor_id }).select("services")
        return muaService


    }

    updateService = async (id: string, updates: Array<string>, sid: string, d) => {

        d._id = sid
        const mua = await this.model.update({ _id: id, "services._id": sid }, { "services.$": d }, { new: true })       //AndUpdate({"services._id":sid},{$set:{"services.$":d}},{new:true})
        return mua
    }
    addMakeupArtistEmployee = async (d: EmployeeI, id: string) => {

        const _id = mongoose.Types.ObjectId(id)
        if (d.services) {
            //@ts-ignore
            d.services = (d.services as string[]).map((s: string, i: number) => mongoose.Types.ObjectId(s))
        }
        const emp = await this.employeeModel.create(d)
        const empId = mongoose.Types.ObjectId(emp._id)
        //@ts-ignore
        const newMua = await this.model.findOneAndUpdate({ _id, employees: { $nin: [empId] } }, { $push: { employees: empId } }, { new: true }).populate("employees").exec()
        return newMua

    }

    deleteMakeupArtistEmployee = async (id: string, empid: string) => {

        const _id = mongoose.Types.ObjectId(id)
        const eid = mongoose.Types.ObjectId(empid)
        const emp = await this.employeeModel.findByIdAndDelete(eid)
        //@ts-ignore
        const delEmp = await this.model.findOneAndUpdate({ _id, employees: { $in: [eid] } }, { $pull: { employees: eid } }, { new: true }).populate("employees").exec()
        return delEmp
    }

    editMuaEmployee = async (emp_id: string, v) => {
        //TODO:check if employee exist in mua       
        const emp = await this.employeeModel.findOneAndUpdate({ _id: emp_id }, v, { new: true }).populate("services").exec()// to return the updated data do - returning: true
        return emp
    }

    addMakeupArtistEvent = async (data: any) => {
        const eventId = mongoose.Types.ObjectId(data.event_id)
        const makeupArtistId = mongoose.Types.ObjectId(data.makeup_artist_id)

        const eventReq = this.eventModel.findOneAndUpdate({ _id: eventId, makeup_artists: { $nin: [makeupArtistId] } }, { $push: { makeup_artists: makeupArtistId } }, { new: true })
        //@ts-ignore
        const muaReq = this.model.findOneAndUpdate({ _id: makeupArtistId, events: { $nin: [data.event_id] } }, { $push: { events: eventId } }, { new: true })
        const [e, mua] = await Promise.all([eventReq, muaReq])
        return { e, mua }

    }

    deleteMakeupArtistEvent = async (data: any) => {

        const eventId = mongoose.Types.ObjectId(data.event_id)
        const makeupArtistId = mongoose.Types.ObjectId(data.makeup_artist_id)
        const eventReq = this.eventModel.updateOne({ _id: eventId, makeup_artists: { $in: [makeupArtistId] } }, { $pull: { makeup_artists: makeupArtistId } })
        //@ts-ignore
        const muaReq = MakeupArtist.updateOne({ _id: makeupArtistId, events: { $in: [eventId] } }, { $pull: { events: eventId } })
        const [e, mua] = await Promise.all([eventReq, muaReq])
        return { e, mua }

    }

    createOffer = async (muaid: string, serviceId: string, e: any) => {

        const service = await this.model.findOne({ _id: muaid, "services._id": serviceId })
        const uniquecode = (service.name).slice(0, 4).toLocaleUpperCase().concat(e.updated_price.toLocaleString())
        e.unique_code = uniquecode
        const offer = await this.offerModel.create(e)
        const offerId = offer._id
        const salon = await this.model.findOneAndUpdate({ _id: muaid, "services._id": serviceId }, { $push: { "services.$.offers": offerId } }, { new: true })

        return salon

    }


}