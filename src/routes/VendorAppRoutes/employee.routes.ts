import { Router } from "express";
import EmployeeService from "../../service/VendorAppService/employee.service";
import EmployeeverifyToken, { employeeJWTVerification } from "../../middleware/Employee.jwt";
const employeeRouter = Router()
const es = new EmployeeService()


employeeRouter.post("/",es.employeeLogin)
employeeRouter.post("/absent",EmployeeverifyToken,es.employeeAbsent)
employeeRouter.post("/absent/update",EmployeeverifyToken,es.employeeAbsentUpdate)
employeeRouter.get("/",EmployeeverifyToken ,es.get)
employeeRouter.put("/", EmployeeverifyToken, es.update)
employeeRouter.put("/profile-pic", EmployeeverifyToken, es.putProfilePic)





export default employeeRouter