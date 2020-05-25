import { Router } from "express";
import EmployeeService from "../../service/VendorAppService/employee.service";
const employeeRouter = Router()


employeeRouter.post("/",EmployeeService.employeeLogin)



export default employeeRouter