import { Router, Request, Response } from "express";
import Admin, { AdminI } from "../models/admin.model";
import * as jwt from "jwt-then"
import CONFIG from "../config";
import * as crypto from "crypto"
import verifyToken from "../middleware/jwt";

const loginRouter = Router()

loginRouter.post("/", async (req: Request, res: Response) => {
    try{
        console.log(req.body);
        
        const { username, password } = req.body
        if(!username || !password){

            res.status(403)
            res.send({message: "Send all data"})
            return
        }
        const passwordHash = crypto.createHash("md5").update(password).digest("hex")


        const admin = await Admin.findOne({where: {username, password: passwordHash}})
        if(admin == null){
            res.status(403)
            res.send({message: "Username password does not match"})
            return
        }
        admin.password = ""
        const token = await jwt.sign({admin}, CONFIG.JWT_KEY)
        res.send({token})
    }catch(e){
        res.status(403)
        res.send({message: `${CONFIG.RES_ERROR} ${e.message}`})
    }
})

loginRouter.post("/create", async (req: Request, res: Response) => {
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
})

export default loginRouter