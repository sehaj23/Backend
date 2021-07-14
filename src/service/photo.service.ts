import mongoose from "../database";
import BaseService from "./base.service";


export default class PhotoService extends BaseService {
    constructor(photoModel: mongoose.Model<any, any>,) {
        super(photoModel);
}

}