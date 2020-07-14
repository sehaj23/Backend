import Employee from "./models/employees.model";

enum CONFIG{
    ADMIN_JWT_KEY = "thisisaveryfescuredtokesss",
    VENDOR_JWT_KEY = "thisisVendorBRO!@34532@!2", 
    USER_JWT_KEY = "expelliarmus-8541#9%",
    RES_ERROR = "Server Error:",
    VENDOR_JWT = "thisisasecretkey",
    USER_JWT = 'expectopatronum$499.99^78',
    EMP_JWT = "thisisemployeesecretkey",
    SALT = 'abrakadabra#6582@0216'
}

export default CONFIG


/*import dotenv from 'dotenv';

const envFound = dotenv.config();

export default {
    jwt_key: process.env.JWT_KEY,
    res_error: process.env.RES_ERROR
};*/
