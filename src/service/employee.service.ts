import * as jwt from "jwt-then";
import CONFIG from "../config";
import EmployeeSI, { EmployeeI } from "../interfaces/employee.interface";
import * as crypto from "crypto"
import { Router, Request, Response } from "express";


import { EmployeeAbsenteeismI } from "../interfaces/employeeAbsenteeism.interface"
import logger from "../utils/logger"
import mongoose from "../database"

import BaseService from "./base.service";
import { PhotoI } from "../interfaces/photo.interface";

import moment = require("moment");
import SalonSI from "../interfaces/salon.interface";
import ServiceI from "../interfaces/service.interface";
import { FeedbackVendorI } from "../interfaces/feedbackVendor.interface";
import { ReportVendorI } from "../interfaces/reportVendor.interface";
import Photo from "../models/photo.model";



export default class EmployeeService extends BaseService {
    employeeAbsenteeismModel: mongoose.Model<any, any>
    salonModel: mongoose.Model<any, any>
    feedbackVendorModel : mongoose.Model<any, any>
    reportVendorModel : mongoose.Model<any, any>
    constructor(employeeModel: mongoose.Model<any, any>, employeeAbsenteeismModel: mongoose.Model<any, any>, salonModel: mongoose.Model<any, any>, feedbackVendorModel : mongoose.Model<any, any>,reportVendorModel : mongoose.Model<any, any>) {
        super(employeeModel)
        this.employeeAbsenteeismModel = employeeAbsenteeismModel
        this.salonModel = salonModel
        this.feedbackVendorModel=feedbackVendorModel
    }

    // ovveride getId to populate the services
    getByIdWithService = async (employeeId: string) => {
        const employee = await this.model.findOne({_id: mongoose.Types.ObjectId(employeeId)}).lean()
        console.log("employee getId employee:", employee)
        if(employee === null) throw new Error(`Employee not found with id: ${employeeId}`)
        if(employee.services && employee.services.length > 0){
            const salon = await this.salonModel.findOne({'services._id': { $in:  employee.services }}).lean()
            if(salon === null) throw new Error(`Salon not found with service ids: ${employee.services}`)
            console.log("employee getId salon:", salon)
            const populatedEmployeeService = salon.services.filter((s: any) => {
                for(let es of employee.services){
                    console.log("es", es)
                    console.log("s._id", s._id)
                    console.log("(es === s._id)", (es.toString() === s._id.toString()))
                    if(es.toString() === s._id.toString()) return true
                }
                return false
            })
            console.log("populatedEmployeeService:", populatedEmployeeService)
            //@ts-ignore
            employee.services = []
            populatedEmployeeService.forEach((s: any) => {
                //@ts-ignore
                employee.services.push(s)
            })
            console.log("employee.services:", employee.services)
        }
        
        return employee
    }

    employeeLogin = async (phone: string, otp: string) => {
        console.log(phone)
        const employee = await this.model.findOne({ phone: phone })
    
        return employee

    }
    employeeAbsent = async (d: any) => {
        const absent = await this.employeeAbsenteeismModel.create(d)
        return absent
    }



    employeeAbsentUpdate = async (d: EmployeeAbsenteeismI) => {



        const absent = await this.employeeAbsenteeismModel.findOneAndUpdate({ employee_id: d.employee_id, absenteeism_date: d.absenteeism_date }, d, { new: true })
        return absent

    }
    getEmp = async (_id: string) => {

        const outlets = await this.model.findById(_id).populate("services").populate("photo").exec()
        return outlets
    }
    updateEmp = async (_id: string, d: any) => {
        const emp = await this.model.findByIdAndUpdate(_id, d, { new: true })
        return emp

    }


    employeeSlots = async (empId: any, slotsDate: Date) => {
        const salonReq =  this.salonModel.findOne({ employees: [empId] })
        
        const employeesAbsenteeismReq = this.employeeAbsenteeismModel.findOne({ employee_id: empId, absenteeism_date: slotsDate })
        const [salon, employeesAbsenteeism] = await Promise.all([salonReq, employeesAbsenteeismReq])
        const starting_hours = salon.start_working_hours

        // getting the day from the date
        let day = moment(slotsDate).day() - 1
        if(day < 0 ) day = 6
        if(starting_hours.length < day) throw Error(`starting hours not found for day number ${day} `)
        const selectedStartingHour = moment(starting_hours[day])
        if(salon.end_working_hours.length < day )throw Error(`ending hours not found for day number ${day} `)
        const selectedEndHour = moment(salon.end_working_hours[day])
        const slots = []
        for(let i = selectedStartingHour; i.isBefore(selectedEndHour); i.add(30, 'minutes')){
            
            const time = moment(i).format('hh:mm a')
            const theSlot = {
                store_date: time,
                absent: false
            }
            if(employeesAbsenteeism !== null){
                const employeeAbsentSlots = employeesAbsenteeism.absenteeism_times
                for (let slot of employeeAbsentSlots) {
                    slot = moment(slot).format('hh:mm a')
                    if (slot === time) {
                            theSlot.absent =  true
                    }
                }
            }
            slots.push(theSlot)
        }
        return slots

    }

    // to add employee in empabs model
    employeeSelectSlot = async (data: any) => {
        const empAbsent = this.employeeAbsenteeismModel.create(data)
        return empAbsent
    }

    // add services by category names
    addServicesByCatgoryNames = async (salonId: string, employeeId: string, selectedCategoryNames: string[]) => {
        const employee = await this.getId(employeeId) as EmployeeSI
        const salon = await this.salonModel.findOne({_id: mongoose.Types.ObjectId(salonId) }) as SalonSI
        if(salon === null) throw new Error(`Salon not found with this id: ${salonId}`)
        const services = salon.services.filter((s: ServiceI) => selectedCategoryNames.includes(s.category))
        console.log("addServicesByCatgoryNames servies:", services)
        employee.services = []
        services.forEach((s: any) => {
            employee.services.push(s._id)
        })
        console.log("employee.services", employee.services)
        await employee.save()
        return employee
    }

    employeeDelete = async (id: any) => {
        const employee = await this.model.findOneAndUpdate({_id:id},{blocked:true},{new:true})
        return employee


    }
    report = async (data:ReportVendorI)=>{
        console.log(data)
        const report = await this.reportVendorModel.create(data)
        return report
    }
    feedback = async (data:FeedbackVendorI)=>{
        console.log(data)
        const report = await this.feedbackVendorModel.create(data)
        return report
    }

    employeeService = async(id:string)=>{
        console.log("******");
        console.log(id)
        const _id=mongoose.Types.ObjectId(id)
        const service = await this.model.aggregate()
        .match({_id: _id})
        .project({
            name:1,
            services: {$size:"$services"}
        })
        return service
    }

    addProfilePic = async (photoData:PhotoI,_id:string) => {
        // saving photos 
        const photo = await Photo.create(photoData)
        // adding it to event
        const newEvent = await this.model.findByIdAndUpdate({_id},  { photo: photo._id }, { new: true }).populate("profile_pic").exec() // to return the updated data do - returning: true
        return newEvent 
}   

        updateNotification = async (id:string,status:boolean)=>{
            const notification = await this.model.findByIdAndUpdate(id,{notification:status},{new:true})
            return notification
        }
    




}