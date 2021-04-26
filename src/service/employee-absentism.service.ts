import BaseService from "./base.service";
import mongoose from "../database";
import moment = require("moment");
import EmployeeAbsenteeismSI from "../interfaces/employeeAbsenteeism.interface";

export default class EmployeeAbsenteesmService extends BaseService{
    employeeAbsentismModel: mongoose.Model<any, any>
    constructor(employeeAbsentismModel: mongoose.Model<any, any>){
        super(employeeAbsentismModel)
        this.employeeAbsentismModel = employeeAbsentismModel
    }

    checkIfEmployeeAbsent=async(employee_ids:string[],dateTime:string)=>{
       console.log(dateTime)
       const absentDate  =  dateTime.split("T")[0]
       const startTime= moment(absentDate).format("YYYY-MM-DD").concat("T00:00:00.000Z")
       const endTime=moment(absentDate).format("YYYY-MM-DD").concat("T23:59:59.000Z")
        let empIdPresent = []
        for(var i =0;i<employee_ids.length;i++){
            const emp_id = employee_ids[i]
            console.log(emp_id)
          const absent = await this.employeeAbsentismModel.findOne({ "employee_id": mongoose.Types.ObjectId(emp_id), absenteeism_date: {$gt:startTime,$lt:endTime} })  as EmployeeAbsenteeismSI
            if(absent != undefined || absent != null){
                let empAbsent = false
                if(absent.absenteeism_times.length>0){
                    for (let empAbTime of absent.absenteeism_times) {
                        const utcformateTime =  moment(dateTime).format('hh:mm a')
                        console.log(utcformateTime)
                       
                        if (empAbTime ===  utcformateTime)  {
                            empAbsent = true
                            break
                        }
                    }
                }else{
                    empAbsent = true
                    console.log("employee is absent for whole day")
                    break
                }
            }else{
            empIdPresent.push(employee_ids)
            }
        }
        return  empIdPresent
        }
      
        checkIfEmployeeAbsentWithSlots=async(employee_id:string,dateTime:string)=>{
            console.log(dateTime)
            const absentDate  =  dateTime.split("T")[0]
            const startTime= moment(absentDate).format("YYYY-MM-DD").concat("T00:00:00.000Z")
            const endTime=moment(absentDate).format("YYYY-MM-DD").concat("T23:59:59.000Z")
             let empIdPresent = []
             let timeSlotAbsent = []
            
                 console.log(employee_id)
               const absent = await this.employeeAbsentismModel.findOne({ "employee_id": mongoose.Types.ObjectId(employee_id), absenteeism_date: {$gt:startTime,$lt:endTime} })  as EmployeeAbsenteeismSI
                 if(absent != undefined || absent != null){
                     let empAbsent = false
                     if(absent.absenteeism_times.length>0){
                         for (let empAbTime of absent.absenteeism_times) {
                             const utcformateTime =  moment(dateTime).format('hh:mm a')
                             console.log(utcformateTime)
                             timeSlotAbsent.push(empAbTime)
                             if (empAbTime ===  utcformateTime)  {
                                 empAbsent = true
                                 break
                             }
                         }
                     }else{
                         empAbsent = true
                         console.log("employee is absent for whole day")
                        
                     }
                 }else{
                 empIdPresent.push(employee_id)
                 }
             //if it return empIdPresent and timeSlotAbsent means the emp is absent whole day
             // if empIdPresent contains the empid means the employee is present
             // if timeSlotAbsent contains the time slots the user is absent
             return  {empIdPresent,timeSlotAbsent}
             }

}