import BaseService from "./base.service"
import Booking from "../models/booking.model"


export default class BookinkService extends BaseService{

    constructor(){
        super(Booking)
    }

}