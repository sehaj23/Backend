import BaseService from "./base.service";
import Offer from "../models/offer.model";


export default class OfferService extends BaseService{

    constructor(){
        super(Offer)
    }

}