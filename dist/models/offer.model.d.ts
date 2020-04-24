/// <reference types="mongoose" />
import mongoose from "../database";
import OfferSI from "../interfaces/offer.interface";
declare const Offer: mongoose.Model<OfferSI, {}>;
export default Offer;
