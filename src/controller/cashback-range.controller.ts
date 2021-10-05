import { Request, Response } from "express"
import controllerErrorHandler from "../middleware/controller-error-handler.middleware"
import CashbackRangeService from "../service/cashback-range.service"

import BaseController from "./base.controller"

export default class CashbackRangeController extends BaseController{
    
   cashbackRangeService : CashbackRangeService
    constructor(cashbackRangeService : CashbackRangeService){
        super(cashbackRangeService)
        this.cashbackRangeService= cashbackRangeService
    }

}