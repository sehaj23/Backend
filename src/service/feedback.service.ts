import BaseService from "./base.service";
import mongoose from "../database";

export default class FeedbackService extends BaseService {
    constructor(feedbackModel: mongoose.Model<any, any>) {
        super(feedbackModel)
    }

    getAll = async () => { 
        // couldve done mongooseModel.find({}) but 
        // used parentClass function to get data
        const feedback = await this.getNopopulate();
        return feedback;
    }

    getPaginated = async(q: any) => {
        // not working
        // const feedback = await this.getWithPagination(q);
        
        const pageNumber: number = parseInt(q.page_number || 1)
        let pageLength: number = parseInt(q.page_length || 25)
        pageLength = (pageLength > 100) ? 100 : pageLength
        const skipCount = (pageNumber - 1) * pageLength
        
        const feedback = await this.model.find().limit(pageLength).skip(skipCount)
        return feedback;
    }

    byRating = async(q: any) => {
        const rating: number = parseInt(q.rating || 0)
        const filter = { rating: rating };
        const feedback = await this.model.find({ rating: rating }).populate("booking_id")
        return feedback;
    }

}
