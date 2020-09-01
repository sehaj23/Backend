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



export default class EmployeeService extends BaseService {
    employeeAbsenteeismModel: mongoose.Model<any, any>
    salonModel: mongoose.Model<any, any>
    constructor(employeeModel: mongoose.Model<any, any>, employeeAbsenteeismModel: mongoose.Model<any, any>, salonModel: mongoose.Model<any, any>) {
        super(employeeModel)
        this.employeeAbsenteeismModel = employeeAbsenteeismModel
        this.salonModel = salonModel
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
        const salonReq = this.salonModel.findOne({ employees: [empId] })
        const employeesAbsenteeismReq = this.employeeAbsenteeismModel.findOne({ employee_id: empId, absenteeism_date: slotsDate })
        const [salon, employeesAbsenteeism] = await Promise.all([salonReq, employeesAbsenteeismReq])
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




}