/// <reference types="mongoose" />
import mongoose from "../database";
import SalonSI from "../interfaces/salon.interface";
declare const Salon: mongoose.Model<SalonSI, {}>;
export default Salon;
