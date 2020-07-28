import BaseController from "./base.controller";
import ReviewsService from "../service/reviews.service";
import { Request, Response } from "express";
import controllerErrorHandler from "../middleware/controller-error-handler.middleware";

import logger from "../utils/logger";
import Review from "../models/review.model";
import RevenueService from "../service/revenue.service";
import ReviewSI from "../interfaces/review.interface";


export default class ReviewsController extends BaseController{
    service: ReviewsService
    constructor(service: ReviewsService) {
        super(service)
        this.service = service
    }

    allReviews =controllerErrorHandler( async (req: Request, res: Response) => {
        const review = await this.service.allReviews()
        if(review ==null){
            const errMsg = "Unable to get Review";
            logger.error(errMsg);
            res.status(400);
            res.send({ message: errMsg });
        }
        res.send(review)


    })
    postReviews =controllerErrorHandler( async (req: Request, res: Response) => {
        const v: ReviewSI = req.body
        if (!v.message || !v.rating) {
            const errMsg = "Send all data"
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return

        }
        const review = await this.service.postReviews(v)
        res.status(201).send(review)
    })

    newReviews = async (req: Request, res: Response) => {
        const reviews = await this.service.newReviews()
    
        if (reviews==null) {
            const errMsg = "Reviews  not found"
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return
        }
        res.send(reviews)
    }

    replyReviews = async (req: Request, res: Response) => {
        const review_id = req.params.id
        const  reviews = await this.service.replyReviews(review_id)
        if (reviews==null) {
            const errMsg = "Reviews  not found"
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return
        }
        res.send(reviews)
    }

    reportReviews = async (req: Request, res: Response) => {
        const review_id = req.params.id
        
        if (!review_id) {
            const errMsg = "Reviews  not found"
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
        }
        const reviews = await this.service.reportReviews(review_id)
        if (reviews==null) {
            const errMsg = "Reviews  not found"
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return
        }
        res.send(reviews)

    }

}