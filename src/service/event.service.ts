import { Router, Request, Response } from "express";
import Event from "../models/event.model";

import BaseService from "./base.service";
import mongoose from "../database";


export default class EventService extends BaseService{

    constructor(eventModel: mongoose.Model<any, any>){
        super(eventModel)
    }


}
