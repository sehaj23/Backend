import { Router } from "express";
import EmployeeService from "../../service/VendorAppService/employee.service";
import EmployeeverifyToken, { employeeJWTVerification } from "../../middleware/Employee.jwt";
const employeeRouter = Router()
const es = new EmployeeService()


employeeRouter.post("/",es.employeeLogin)
employeeRouter.post("/absent",EmployeeverifyToken,es.employeeAbsent)
employeeRouter.post("/absent/update",EmployeeverifyToken,es.employeeAbsentUpdate)





export default employeeRouter