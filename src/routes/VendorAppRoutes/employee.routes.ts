import { Router } from "express";
import Employeeverifytoken from "../../middleware/Employee.Jwt";
import EmployeeService from "../../service/VendorAppService/employee.service";
const employeeRouter = Router()


employeeRouter.post("/",EmployeeService.Employeepost)



export default employeeRouter