import Admin from "../models/admin.model";
import * as crypto from "crypto"
import AdminI, { AdminSI ,AdminRoleT } from "../interfaces/admin.interface";
import BaseService from "../service/base.service";
import mongoose from "../database";


export default class LinkDeviceService extends BaseService{
    constructor(LinkDeviceModel: mongoose.Model<any, any>){
        super(LinkDeviceModel);
    }
}