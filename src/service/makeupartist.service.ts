import { Router, Request, Response } from "express";
import CONFIG from "../config";
import verifyToken from "../middleware/jwt";
import * as crypto from "crypto"
import logger from "../utils/logger";
import Designer, { DesignersI } from "../models/designers.model";
import EventDesigner, {EventDesignerI} from "../models/eventDesigner.model";
import MakeupArtist, { MakeupArtistI } from "../models/makeupArtist.model";

const designerRouter = Router()

export default class MakeupartistServiceC{

    static post = async (req: Request, res: Response) => {
        try {
            console.log(req.body);
            const ma: MakeupArtistI = req.body 
            const makeupartist = await MakeupArtist.create(ma)
            res.send(makeupartist)
        } catch (e) {
            logger.error(`${e.message}`)
            res.status(403)
            res.send({ message: `${CONFIG.RES_ERROR} ${e.message}` })
        }
    }

    static get = async (req: Request, res: Response) => {
        try {
            const events = await MakeupArtist.findAll()
            res.send(events)
        } catch (e) {
            res.status(403)
            res.send(e.message)
        }
    }

    static getId =  async (req: Request, res: Response) => {
            try {
            const id = req.params.id
            if(!id){
            const msg = 'Id not found for vendor.'
            logger.error(msg)
            res.status(403)
            res.send(msg)
        }
        const event = await MakeupArtist.findByPk(id)
        res.send(event)
        } catch (e) {
            res.status(403)
            res.send(e.message)
        }
    }

    static put = async (req: Request, res: Response) => {
        try {
            const ma: MakeupArtistI = req.body 

            const [num, vendor] = await MakeupArtist.update(ma, { where: { id: ma.id! } }) // to return the updated data do - returning: true
            ma.id = ma.id

            res.send(ma)
        } catch (e) {
            res.status(403)
            res.send({ message: `${CONFIG.RES_ERROR} ${e.message}` })
        }
    }

    //associating designers to events
    static addMakeupArtistEvent = async (req: Request, res: Response) => {
        try {
            const {
                event_id,
                designer_id
            }: EventDesignerI = req.body

            const d: EventDesignerI = {
                event_id,
                designer_id
            }

            const designerEvent = await EventDesigner.create(d)

            res.send(designerEvent)
        } catch (e) {
            logger.error(`${e.message}`)
            res.status(403)
            res.send({ message: `${CONFIG.RES_ERROR} ${e.message}` })
        }
    }

    //get data of associated
    static getMakeupArtistEvent = async (req: Request, res: Response) => {
        try {
            const designerEvent = await EventDesigner.findAll()
            res.send(designerEvent)
        } catch (e) {
            res.status(403)
            res.send(e.message)
        }
    }

}
