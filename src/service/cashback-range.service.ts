import mongoose from "../database";

import BaseService from "./base.service";

export default class CashbackRangeService extends BaseService {

    randomIntFromInterval(min, max) { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min)
      }

}