import ReviewSI from "../interfaces/review.interface"
import Reviews from "../models/review.model"
import { Router, Request, Response } from "express";
import logger from "../utils/logger"
import mongoose from "../database"
import BaseService from "./base.service";
import { String } from "aws-sdk/clients/apigateway";
const review = Router()



export default class ReviewsServices extends BaseService{

    allReviews = async () => {
        
            const reviews = await Reviews.find({})
            return reviews

    }

    postReviews = async (v:any) => {
            const reviews = await Reviews.create(v)
            return reviews
    }

    newReviews = async () => {
       
            const reviews = await Reviews.find({}, {}, { sort: { 'createdAt': -1 } })
            return reviews
      
    }

    replyReviews = async ( review_id:String) => {
       
            const review = await Reviews.findByIdAndUpdate(review_id, { $push: { reply: review_id } }, { new: true })
            return review

    }
    reportReviews = async (review_id:string) => {


            const review = await Reviews.findByIdAndUpdate(review_id, { flagged: true }, { new: true })
            return review

    }



}