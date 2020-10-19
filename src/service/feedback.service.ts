import { Router, Request, Response } from "express";
import feedback from "../models/feedback.model"

import BaseService from "./base.service";
import mongoose from "../database";


export default class FeedbackService extends BaseService{

    constructor(feedbackModel: mongoose.Model<any, any>){
        super(feedbackModel)
    }

 


}
