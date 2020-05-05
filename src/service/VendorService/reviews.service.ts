import ReviewSI from "../../interfaces/review.interface"
import Reviews from "../../models/review.model"
import { Router, Request, Response } from "express";
import logger from "../../utils/logger"
import mongoose from "../../database"
const review = Router()



export default class ReviewsServices {

    AllReviews = async (req: Request, res: Response) => {
        try {
            const reviews = await Reviews.find({})
            res.send(reviews)
            if (!reviews) {
                const errMsg = "Reviews  not found"
                logger.error(errMsg)
                res.status(400)
                res.send({ message: errMsg })
                return
            }
        } catch (error) {
            const errMsg = "Reviews  not found"
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })
            return


        }

    }

    PostReviews = async (req: Request, res: Response) => {
        try {
            const v: ReviewSI = req.body
            if (!v.message || !v.rating) {
                const errMsg = "Send all data"
                logger.error(errMsg)
                res.status(400)
                res.send({ message: errMsg })
                return

            }

            const reviews = await Reviews.create(v)
            res.send(reviews)

        } catch (error) {

        }
    }

    NewReviews = async (req: Request, res: Response) => {

        try {
            const reviews = await Reviews.find({}, {}, { sort: { 'createdAt': -1 } })
            res.send(reviews)
            if (!reviews) {
                const errMsg = "Reviews  not found"
                logger.error(errMsg)
                res.status(400)
                res.send({ message: errMsg })
                return
            }
        } catch (error) {

        }
    }

    ReplyReviews = async (req: Request, res: Response) => {
        try {
            const review_id = req.params.id
            const review = await Reviews.findByIdAndUpdate(review_id, { $push: { reply: review_id } }, { new: true })
            res.send(review)

        } catch (error) {
            const errMsg = "Unable to reply"
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })

        }


    }
    ReportReviews = async (req: Request, res: Response) => {
        try {
            const review_id = req.params.id
            if (!review_id) {
                const errMsg = "Reviews  not found"
                logger.error(errMsg)
                res.status(400)
                res.send({ message: errMsg })
            }
            const review = await Reviews.findByIdAndUpdate(review_id, { flagged: true }, { new: true })
            res.send(review)

        } catch (error) {
            const errMsg = "Reviews  not found"
            logger.error(errMsg)
            res.status(400)
            res.send({ message: errMsg })

        }

    }



}