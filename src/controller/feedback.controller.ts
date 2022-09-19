import { Request, Response } from 'express';
import controllerErrorHandler from '../middleware/controller-error-handler.middleware';
import { FeedbackRedis } from '../redis/index.redis';
import FeedbackService from '../service/feedback.service';
import BaseController from "./base.controller";

export default class FeedbackController extends BaseController {
    service: FeedbackService;
    constructor(service: FeedbackService) {
        super(service);
        this.service = service
    }

    getAll = controllerErrorHandler(
        async (req: Request, res: Response) => {
            const redisKey = "getAll"
            const cahce = await FeedbackRedis.get(redisKey, {});
            if(cahce == null){
                // get from network
                // save to redis
                // return response
                const out = await this.service.getAll();
                FeedbackRedis.set(redisKey, out, {});
                return res.status(200).send(out);
            }
            const out = JSON.parse(cahce);
            res.status(200).send(out);
        }
    )

    getPaginated = controllerErrorHandler(
        async (req: Request, res: Response) => {
            const out = await this.service.getPaginated(req.query);
            res.status(200).send(out);
        }
    )

    byRating = controllerErrorHandler(
        async (req: Request, res: Response) => { 
            const out = await this.service.byRating(req.query);
            res.status(200).send(out);
        }
    )

    byBookingId = controllerErrorHandler(
        async (req: Request, res: Response) => {
            const out = await this.service.get({ booking_id: req.params.id });
            res.status(200).send(out);
        }
    )

    infoById = controllerErrorHandler(
        async (req: Request, res: Response) => {
            const out = await this.service.get({_id : req.params.id});
            res.status(200).send(out);
        }
    )

    updateById = controllerErrorHandler(
        async (req: Request, res: Response) => {
            const out = await this.service.getAndUpdateByField({ _id : req.params.id }, req.body);
            res.status(200).send(out);
        }
    )

    deleteById = controllerErrorHandler(
        async (req: Request, res: Response) => {
            const out = await this.service.delete(req.params.id);
            res.status(200).send({message : 'success'});
        }
    )

}