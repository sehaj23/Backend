import mongoose from "../database";

import BaseService from "./base.service";

export default class ReportsSalonService extends BaseService {

    constructor(model: mongoose.Model<any, any>) {
        super(model)
    }
    getId = async (id: string) => {
        return this.model.findOne({ _id: mongoose.Types.ObjectId(id) }).populate("user_id")
    }
    getSalonReport =  async (id:string,q:any)=>{
        const pageNumber: number = parseInt(q.page_number || 1)
        let pageLength: number = parseInt(q.page_length || 25)
        pageLength = (pageLength > 100) ? 100 : pageLength
        const skipCount = (pageNumber - 1) * pageLength
        const reportReq =  this.model.find({salon_id:id}).skip(skipCount).limit(pageLength).populate('salon_id','name')
        const reportCountReq = this.model.aggregate([
            { "$count": "count" }
        ])
        const [report,count] =  await Promise.all([reportReq,reportCountReq])
        return {report,count}
}
getSalonReportbyUser =  async (id:string,q:any)=>{
    const pageNumber: number = parseInt(q.page_number || 1)
    let pageLength: number = parseInt(q.page_length || 25)
    pageLength = (pageLength > 100) ? 100 : pageLength
    const skipCount = (pageNumber - 1) * pageLength
    const reportReq =  this.model.find({user_id:id}).skip(skipCount).limit(pageLength).populate('salon_id','name')
    const reportCountReq = this.model.aggregate([
        { "$count": "count" }
    ])
    const [report,count] =  await Promise.all([reportReq,reportCountReq])
    return {report,count}
}

getById = async(id:string,)=>{
    const review = await this.model.findById(id).populate("user_id","name")
    return review
}


}
