import Admin from "../../models/admin.model";
import * as crypto from "crypto"
import AdminI, { AdminRoleT } from "../../interfaces/admin.interface";
import BaseService from "../base.service";


export default class AdminService extends BaseService{

    post = async (admin: AdminI) => {
        const passwordHash = crypto.createHash("md5").update(admin.password).digest("hex")
        admin.password = passwordHash         
        const gotAdmin = await Admin.create(admin)
        gotAdmin.password = undefined
        return gotAdmin
    }

    login = async (username: string, password: string) => {
        // this.model is coming from the base service class
        return this.model.find({username, password})
    }
}
