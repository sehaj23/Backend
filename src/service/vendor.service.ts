import logger from "../utils/logger";
import * as crypto from "crypto"
import Vendor from "../models/vendor.model";
import { Router, Request, Response } from "express";
import * as jwt from "jwt-then";
import CONFIG from "../config";
import { VendorI } from "../interfaces/vendor.interface";
import { vendorJWTVerification } from "../middleware/VendorJwt"
import mongoose from "../database";
import { EmployeeAbsenteeismI } from "../interfaces/employeeAbsenteeism.interface"
import EmployeeAbsenteeism from "../models/employeeAbsenteeism.model"
import { Mongoose } from "mongoose";
import BaseService from "./base.service";
import { PhotoI } from "../interfaces/photo.interface";
import Photo from "../models/photo.model";
import Salon from "../models/salon.model";
import Employee from "../models/employees.model"
import moment = require("moment");
import { String } from "aws-sdk/clients/appstream";
import encryptData from "../utils/password-hash";
import { ReportVendorI } from "../interfaces/reportVendor.interface";
import { FeedbackI } from "../interfaces/feedback.interface";




export default class VendorService extends BaseService{
    employeeAbsenteeismModel : mongoose.Model<any, any>
    reportVendorModel : mongoose.Model<any, any>
    feedbackVendorModel : mongoose.Model<any, any>
    constructor(Vendor: mongoose.Model<any, any>, employeeAbsenteeismModel : mongoose.Model<any, any>,reportVendorModel : mongoose.Model<any, any>,feedbackVendorModel : mongoose.Model<any, any>) {
        super(Vendor)
        this.employeeAbsenteeismModel=employeeAbsenteeismModel
        this.reportVendorModel=reportVendorModel
        this.feedbackVendorModel=feedbackVendorModel
    }

    // vendorLogin  = async (email,password) => {
          
    //         const passwordHash = encryptData(password)
    //         const vendor = await this.model.findOne({ email, password: passwordHash })
    //         vendor.password=""
    //         const token = await jwt.sign(vendor.toJSON(), CONFIG.VENDOR_JWT, { expiresIn: "7 days" })
    //          return({ token })  //made change here for ID
       
    // }

    employeeAbsent = async (d:EmployeeAbsenteeismI) => {

            const absent = await (await this.employeeAbsenteeismModel.create(d)).populate("employee_id").execPopulate()
            return absent
    }

    employeeAbsentUpdate = async (d: EmployeeAbsenteeismI) => {

            //@ts-ignore
            const check = await EmployeeAbsenteeism.findOneAndUpdate({ employee_id: d.employee_id, absenteeism_date: d.absenteeism_date }, d, { new: true }).populate("employee_id").exec()
            return check

    }
    getVendor = async (vendorId) => {

            //@ts-ignore
            
            const vendor = await this.model.findOne({_id:vendorId}).populate("makeup_artists").populate("salons").populate("designers").populate("profile_pic").exec()
           
            return vendor

    }
    update = async (id:string,d:any) => {

            const _id = mongoose.Types.ObjectId(id)
            const vendor = await this.model.findByIdAndUpdate(_id, d, { new: true })
            return vendor
    }
    updateFCM = async (id:string,fcm_token:any) => {
        const _id = mongoose.Types.ObjectId(id)
        const vendor = await this.model.findByIdAndUpdate(_id, {$addToSet:{fcm_token:fcm_token}}, { new: true })
        return vendor
    }
    deleteFCM = async (id:string,fcm_token:any) => {
        const _id = mongoose.Types.ObjectId(id)
        const user = await this.model.findByIdAndUpdate(_id, {$pull:{fcm_token:[fcm_token]}}, { new: true })
        return user
    }
        updatePass = async (id:string,password:string,newpassword:String) => {
  
            //@ts-ignore
            const _id = mongoose.Types.ObjectId(id)
            const passwordHash = encryptData(password)
            const vendor = await this.model.findOne({ _id, password: passwordHash })
            const newpasswordHash = encryptData(newpassword)
            if (vendor) {
                const updatepass = await this.model.findByIdAndUpdate({ _id }, { password: newpasswordHash }, { new: true })
                return updatepass
            } else {
               return("Error Updating password")
            }

    }
    employeeSlots = async (id:string,timeSlots:string) => {
       

           
            //@ts-ignore
            const empId = mongoose.Types.ObjectId(id)
            console.log(empId)
            

            // getting the date from the frontend for which he needs the slots for
            

         
          
          
            //@ts-ignore
            const salonReq = Salon.findOne({ employees: [empId] })
            //@ts-ignore
            const employeesAbsenteeismReq = EmployeeAbsenteeism.findOne({ employee_id: empId, absenteeism_date: timeSlots })
            const [salon, employeesAbsenteeism] = await Promise.all([salonReq, employeesAbsenteeismReq])
            console.log(employeesAbsenteeism)
            const starting_hours = salon.start_working_hours
            var slots = starting_hours.map(function (val) {
                const storeDate = moment(val).format('hh:mm a')
                const employeeAbsentSlots = employeesAbsenteeism.absenteeism_times
                if (employeeAbsentSlots.length === 0) {
                    return {
                        store_date: storeDate,
                        absent: false
                    }
                }
                for (let slot of employeeAbsentSlots) {
                    slot = moment(slot).format('hh:mm a')
                    if (slot === storeDate) {
                        return {
                            store_date: storeDate,
                            absent: true
                        }
                    }
                }
                return {
                    store_date: storeDate,
                    absent: false
                }
            })
            return slots
      
    }
    slots = async (salonid:string,reqDate:string) => {

 
            const id = mongoose.Types.ObjectId(salonid) // salon id
            const date = moment() || moment(reqDate)
            const salon = await Salon.findById(id)
            
            const starting_hours = salon.start_working_hours
            var start_time = starting_hours.map(function (val) {
                return moment(val).format('YYYY-MM-DD hh:mm a');;
            })
            console.log(start_time)
            const end_hours = salon.end_working_hours
            var end_time = end_hours.map(function (val) {
                return moment(val).format('YYYY-MM-DD hh:mm a');;
            })
            const slots = []
            var time1 = start_time[date.day()]
            console.log(date)
            var time2 = end_time[date.day()]
            for (var m = moment(time1); m.isBefore(time2); m.add(30, 'minutes')) {
                slots.push(m.format('hh:mm a'));
            }
            return slots

    }
    employeebyId = async (id:string) => {
            const service = await Employee.findById(id).populate("services").populate("photo").exec()
            return service
    }
    

    report = async (data:ReportVendorI)=>{
        console.log(data)
        const report = await this.reportVendorModel.create(data)
        return report
    }
    feedback = async (data:FeedbackI)=>{
        console.log(data)
        const report = await this.feedbackVendorModel.create(data)
        return report
    }
    
    vendorDelete = async (id: string) => {
        const vendor = await this.model.findOneAndUpdate({_id:id},{blocked:true},{new:true})
        return vendor

    }

    vendorService = async(id:string,vendorId:string)=>{
        const _id=mongoose.Types.ObjectId(id)
        const service = await Salon.aggregate()
        .match({_id: _id})
        .project({
            name:1,
            services: {$size:"$services"}
        })
        return service
    }
    updateNotification = async (id:string,status:boolean)=>{
        const notification = await this.model.findByIdAndUpdate(id,{notification:status},{new:true})
        return notification
    }

    





}