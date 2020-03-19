
import { Router, Request, Response } from "express";
import Admin, { AdminI } from "../models/admin.model";
import * as jwt from "jwt-then"
import CONFIG from "../config";
import * as crypto from "crypto"
import verifyToken from "../middleware/jwt";
import Event, { EventI } from "../models/event.model";

const eventRouter = Router()

eventRouter.post("/", verifyToken, async (req: Request, res: Response) => {
    try{
        const {
            name,
            description,
            entryProcedure,
            exhibitionHouse,
            startDate,
            endDate,
            location,
        } = req.body
        
        const e: EventI = {
            name,
            description,
            entry_procedure: entryProcedure,
            exhibition_house: exhibitionHouse,
            start_date: startDate,
            end_date: endDate,
            location
        }

        const event = await Event.create(e)
        
        res.send(event)
    }catch(e){
        res.status(403)
        res.send({message: `${CONFIG.RES_ERROR} ${e.message}`})
    }
})


eventRouter.get("/", verifyToken, async (req: Request, res: Response) => {
    console.log("C");
    
    try{
        const admins = await  Admin.findAll()
        const filter = admins.map((a) => {
            a.password = ""
            return a
        } )
        res.send(filter)      
    }catch(e){
        res.status(403)
        res.send(e.message)
    }
})

eventRouter.put("/", verifyToken, async (req: Request, res: Response) => {
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

        const [num,  admin] = await Admin.update(adminData, {where : {id}}) // to return the updated data do - returning: true
        adminData.id = id        
        
        res.send(adminData)
    }catch(e){
        res.status(403)
        res.send({message: `${CONFIG.RES_ERROR} ${e.message}`})
    }
})

export default eventRouter