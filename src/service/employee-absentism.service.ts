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

    checkIfEmployeeAbsent=async(employee_ids:string[],dateTime:moment.Moment)=>{
       console.log(dateTime)
        let empIdPresent = []
        for(var i =0;i<employee_ids.length;i++){
            const emp_id = employee_ids[i]
            console.log(emp_id)
          const absent = await this.employeeAbsentismModel.findOne({ "employee_id": mongoose.Types.ObjectId(emp_id), absenteeism_date: dateTime })  as EmployeeAbsenteeismSI
            if(absent != undefined || absent != null){
                let empAbsent = false
                if(absent.absenteeism_times.length>0){
                    for (let empAbTime of absent.absenteeism_times) {
                        console.log("empAbTime", empAbTime)
                        console.log("dateTime.format('h:mm A')", moment(dateTime).format('h:mm A'))
                        if (empAbTime === moment(dateTime).format('h:mm A')) {
                            empAbsent = true
                            break
                        }
                    }
                }else{
                    empAbsent = true
                    console.log("employee is absent for whole day")
                    break
                }
            }
            empIdPresent.push(employee_ids)
        }
        return  empIdPresent
        
        }
      

}