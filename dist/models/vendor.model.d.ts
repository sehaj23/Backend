/// <reference types="mongoose" />
import mongoose from "../database";
import { VendorSI } from "../interfaces/vendor.interface";
declare const Vendor: mongoose.Model<VendorSI, {}>;
export default Vendor;
