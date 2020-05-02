import { Router, Request, Response } from "express";
import CONFIG from "../../config";
import verifyToken from "../../middleware/jwt";
import * as crypto from "crypto"
import logger from "../../utils/logger";
import Designer from "../../models/designers.model";
import Event from "../../models/event.model";
import EventI, { EventSI } from "../../interfaces/event.interface";
import { PhotoI } from "../../interfaces/photo.interface";
import Photo from "../../models/photo.model";
import BaseService from "./base.service";


export default class EventService extends BaseService{

    constructor(){
        super(Event)
    }


}
