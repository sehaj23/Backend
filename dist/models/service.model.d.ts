/// <reference types="mongoose" />
import mongoose from "../database";
import { ServiceSI } from "../interfaces/service.interface";
declare const Service: mongoose.Model<ServiceSI, {}>;
export default Service;
