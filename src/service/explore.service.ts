import mongoose from "../database";
import Explore from "../models/explore.model";
import BaseService from "../service/base.service";

export default class ExploreService extends BaseService{
    constructor(exploreModel: mongoose.Model<any, any>){
        super(exploreModel);
    }
}