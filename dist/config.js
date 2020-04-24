"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CONFIG;
(function (CONFIG) {
    CONFIG["JWT_KEY"] = "thisisaveryfescuredtokesss";
    CONFIG["RES_ERROR"] = "Server Error:";
})(CONFIG || (CONFIG = {}));
exports.default = CONFIG;
/*import dotenv from 'dotenv';

const envFound = dotenv.config();

export default {
    jwt_key: process.env.JWT_KEY,
    res_error: process.env.RES_ERROR
};*/
