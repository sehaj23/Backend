import { Request, Response } from "express";
import CONFIG from "../config";
import * as crypto from "crypto"
import logger from "../utils/logger";
import Designer from "../models/designers.model";
import Vendor from "../models/vendor.model";
import MakeupArtist from "../models/makeupArtist.model";
import Salon from "../models/salon.model";
import { VendorI, VendorSI } from "../interfaces/vendor.interface";
import BaseService from "./base.service";

export default class VendorService extends BaseService{

    constructor(){
        super(Vendor)
    }

    
}

