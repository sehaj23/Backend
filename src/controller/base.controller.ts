import BaseService from "../service/base.service";
import { Request, Response } from "express";
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
            const resource = this.service.putPhoto(id, data)
            res.send(resource)
        } catch (e) {
            res.status(403).send({ message: e.message })
        }
    }

    getPhoto = async (req: Request, res: Response) => {
        try {
            const id = req.params.id
            const resource = this.service.getPhoto(id)
            res.send(resource)
        } catch (e) {
            res.status(403).send({ message: e.message })
        }
    }

}