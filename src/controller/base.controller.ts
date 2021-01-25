import { Request, Response } from "express";
import { PhotoI } from "../interfaces/photo.interface";
import controllerErrorHandler from "../middleware/controller-error-handler.middleware";
import BaseService from "../service/base.service";
import logger from "../utils/logger";
export default class BaseController {

    service: BaseService

    constructor(service: BaseService) {
        this.service = service
    }

    post =  async (req: Request, res: Response) => {
        try {
            const resource = await this.service.post(req.body)
            res.status(201).send(resource)
        } catch (e) {
            res.status(400)
            res.send({ message: `${e.message}` })
        }
    }

    getWithPagination = controllerErrorHandler(async (req: Request, res: Response) => {
        const resource = await this.service.getWithPagination(req.query)
        res.send(resource)
    })

    get = async (req: Request, res: Response) => {
        try {
            const resource = await this.service.get()
            res.send(resource)
        } catch (e) {
            res.status(400)
            res.send({ message: `${e.message}` })
        }
    }

    getId = async (req: Request, res: Response) => {
        try {
            const id = req.params.id

            const resource = await this.service.getId(id)
            if (resource === null) {
                const msg = `No data found with this id `
                logger.error(msg)
                res.status(403)
                res.send(msg)
                return
            }
            res.send(resource)
        } catch (e) {
            res.status(403).send({ message: e.message })

        }
    }

    put = async (req: Request, res: Response) => {
        try {
            const id = req.params.id
            const data = req.body
            const resource = await this.service.put(id, data)
            res.send(resource)
        } catch (e) {
            res.status(403).send({ message: e.message })
        }
    }

    putPhoto = async (req: Request, res: Response) => {
        try {
            const id = req.params.id
            const data = req.body
            console.log(data)
            const resource = await this.service.putPhoto(id, data)
            res.send(resource)
        } catch (e) {
            res.status(403).send({ message: e.message })
        }
    }

    getPhoto = async (req: Request, res: Response) => {
        try {
            const id = req.params.id
            const resource = await this.service.getPhoto(id)
            res.send(resource)
        } catch (e) {
            res.status(403).send({ message: e.message })
        }
    }
    putProfilePic = async (req: Request, res: Response) => {
        try {
            const photoData: PhotoI = req.body
            //@ts-ignore
            const _id = req.params.id || req.userId || req.vendorId || req.empId
            // saving photos 
            const newEvent = await this.service.putProfilePic(photoData,_id)
           
            res.send(newEvent)
        } catch (e) {
            logger.error(`User Put Photo ${e.message}`)
            res.status(403).send(`${e.message}` )
        }
    }

    delete = async (req: Request, res: Response) => {
        const {id} = req.params
        try {
            // saving photos 
            const newEvent = await this.service.delete(id)
            res.send(newEvent)
        } catch (e) {
            logger.error(`User Put Photo ${e.message}`)
            res.status(403).send(`${e.message}` )
        }
    }

    getUnapproved = async(req: Request, res: Response)=>{
        const id =  req.params.id
        try {
            const newEvent = await this.service.get({_id:id,unapproved:false})
        } catch (error) {
            
        }
    }

}