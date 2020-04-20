import { Router, Request, Response } from "express";
import Admin from "../models/admin.model";
import * as jwt from "jwt-then"
import CONFIG from "../config";
import * as crypto from "crypto"
import verifyToken from "../middleware/jwt";
import AdminI, { AdminSI } from "../interfaces/admin.interface";
import logger from "../utils/logger";


export default class AdminService{

    static post = async (req: Request, res: Response) => {
        try{
            const { username, password, role } = req.body
            if(!username || !password || !role){
                res.status(403)
                res.send({message: "Send all data"})
                return
            }
    
            const passwordHash = crypto.createHash("md5").update(password).digest("hex")
    
            const adminData: AdminI = {
                username,
                password: passwordHash,
                role
            } 
    
            const admin = await Admin.create(adminData)
            admin.password = ""
            res.send(admin)
        }catch(e){
            res.status(403)
            res.send({message: `${CONFIG.RES_ERROR} ${e.message}`})
        }
    }

    static get = async (req: Request, res: Response) => {
        try{
            const admins = await Admin.find().select("-password`") //Admin.findAll({attributes: {exclude: ["password"]}})
            res.send(admins)      
        }catch(e){
            logger.error(e.message)
            res.status(403)
            res.send(e.message)
        }
    }

    static put = async (req: Request, res: Response) => {
        try{
            const { id, username, role } = req.body
            if(!username || !id || !role){
                res.status(403)
                res.send({message: "Send all data"})
                return
            }
    
            const adminData: AdminI = {
                username,
                role
            }

            const [num,  admin] = await Admin.update(adminData, {where : {_id: id}}) // to return the updated data do - returning: true
            
            res.send(adminData)
        }catch(e){
            res.status(403)
            res.send({message: `${CONFIG.RES_ERROR} ${e.message}`})
        }
    }

}
