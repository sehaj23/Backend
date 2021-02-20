import mongoose from "../database";

import BaseService from "./base.service";

export default class ReportsSalonService extends BaseService {

    constructor(model: mongoose.Model<any, any>) {
        super(model)
    }
    getId = async (id: string) => {
        return this.model.findOne({ _id: mongoose.Types.ObjectId(id) }).populate("user_id")
    }
}
