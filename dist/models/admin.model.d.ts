/// <reference types="mongoose" />
import mongoose from "../database";
import { AdminSI } from "../interfaces/admin.interface";
declare const Admin: mongoose.Model<AdminSI, {}>;
export default Admin;
