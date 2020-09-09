import { Router } from "express";
import EmployeeService from "../../service/employee.service";
import EmployeeverifyToken, { employeeJWTVerification } from "../../middleware/Employee.jwt";
import EmployeeAbsenteeism from "../../models/employeeAbsenteeism.model";
import Employee from "../../models/employees.model";
import Salon from "../../models/salon.model";
import EmployeeController from "../../controller/employee.controller";
import FeedbackVendor from "../../models/feedbackVendor.model"
import ReportVendor from "../../models/reportVendor.model"



const employeeRouter = Router()
const es = new  EmployeeService(Employee,EmployeeAbsenteeism,Salon,FeedbackVendor,ReportVendor)
const employeeController  = new EmployeeController(es)


employeeRouter.post("/",employeeController.employeeLogin)
employeeRouter.post("/absent",EmployeeverifyToken,employeeController.employeeAbsent)
employeeRouter.post("/absent/update",EmployeeverifyToken,employeeController.employeeAbsentUpdate)
employeeRouter.get("/",EmployeeverifyToken ,employeeController.get)
employeeRouter.put("/", EmployeeverifyToken, employeeController.updateEmployee)
employeeRouter.put("/profile-pic", EmployeeverifyToken, employeeController.addProfilePic)
employeeRouter.get("/info",EmployeeverifyToken,employeeController.getEmp)
employeeRouter.get("/info/:id",EmployeeverifyToken,employeeController.getId)
employeeRouter.get("/employee-slots", EmployeeverifyToken, employeeController.employeeSlots)
employeeRouter.patch("/delete",EmployeeverifyToken,employeeController.employeeDelete)
employeeRouter.post("/feedback",EmployeeverifyToken,employeeController.feedback)
employeeRouter.post("/report",EmployeeverifyToken,employeeController.report)
employeeRouter.get("/service",EmployeeverifyToken,employeeController.empService)
employeeRouter.patch("/notification",EmployeeverifyToken,employeeController.notificationUpdate)

export default employeeRouter