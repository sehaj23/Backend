import Employee from "./models/employees.model";

enum CONFIG{
    ADMIN_JWT_KEY = "thisisaveryfescuredtokesss",
    VENDOR_JWT_KEY = "thisisVendorBRO!@34532@!2", 
    RES_ERROR = "Server Error:",
    VENDOR_JWT = "thisisasecretkey",
    EMP_JWT = "thisisemployeesecretkey"
}

export default CONFIG


/*import dotenv from 'dotenv';

const envFound = dotenv.config();

export default {
    jwt_key: process.env.JWT_KEY,
    res_error: process.env.RES_ERROR
};*/
