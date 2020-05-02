import { Router } from "express";
import VendorverifyToken from "../../middleware/jwt";
import EmployeeService from "../../service/VendorService/employee.service";
const employeeRouter = Router()
const es = new EmployeeService()


employeeRouter.post("/",VendorverifyToken,es.createEmployee)
employeeRouter.put("/edit/:id",VendorverifyToken,es.editEmployee)
employeeRouter.delete("/delete/:id",VendorverifyToken,es.deleteEmployee)


export default employeeRouter