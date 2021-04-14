import ReviewSI from "../interfaces/review.interface"
import Reviews from "../models/review.model"
import { Router, Request, Response } from "express";
import logger from "../utils/logger"
import mongoose from "../database"
import BaseService from "./base.service";
import { String } from "aws-sdk/clients/apigateway";
const review = Router()



export default class ReviewsServices extends BaseService {

        allReviews = async () => {

                const reviews = await Reviews.find({})
                return reviews

        }

        postReviews = async (v: any) => {
                const reviews = await Reviews.create(v)
                return reviews
        }

        newReviews = async () => {

                const reviews = await Reviews.find({}, {}, { sort: { 'createdAt': -1 } })
                return reviews

        }

        replyReviews = async (review_id: String) => {
                //@ts-ignore
                const review = await Reviews.findByIdAndUpdate(review_id, { $push: { reply: review_id } }, { new: true })
                return review

        }
        reportReviews = async (review_id: string) => {

                const review = await Reviews.findByIdAndUpdate(review_id, { flagged: true }, { new: true })
                return review

        }

        getReviewsbySalon = async(id:string,q:any)=>{
                const pageNumber: number = parseInt(q.page_number || 1)
                let pageLength: number = parseInt(q.page_length || 25)
                pageLength = (pageLength > 100) ? 100 : pageLength
                const skipCount = (pageNumber - 1) * pageLength
                const reviewReq =  this.model.find({salon_id:id}).skip(skipCount).limit(pageLength).populate('salon_id','name')
               const  reviewsCountReq= this.model.aggregate([
                    { "$count": "count" }
                ])
                const [reviews,count] =  await Promise.all([reviewReq,reviewsCountReq])
                return {reviews,count}
        }
        getReviewsbyUser= async(id:string,q:any)=>{
                const pageNumber: number = parseInt(q.page_number || 1)
                let pageLength: number = parseInt(q.page_length || 25)
                pageLength = (pageLength > 100) ? 100 : pageLength
                const skipCount = (pageNumber - 1) * pageLength
                const reviewReq =  this.model.find({user_id:id}).populate('salon_id',"name").skip(skipCount).limit(pageLength)
                const reviewsCountReq = this.model.count({user_id:id})
                const [reviews,count] =  await Promise.all([reviewReq,reviewsCountReq])
                return {reviews,count}
        }

        getById = async(id:string,)=>{
               const review = await this.model.findById(id).populate("user_id","name")
               return review
        }



}