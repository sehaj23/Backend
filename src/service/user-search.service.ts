import mongoose from "../database";
import BaseService from "./base.service";

export default class UserSearchService extends BaseService{

    constructor(UserSearch: mongoose.Model<any, any>){
        super(UserSearch)
    }

}