import Employee from "./models/employees.model";

enum CONFIG{
    JWT_KEY = "thisisaveryfescuredtokesss",
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
