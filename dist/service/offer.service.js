"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_service_1 = require("./base.service");
const offer_model_1 = require("../models/offer.model");
class OfferService extends base_service_1.default {
    constructor() {
        super(offer_model_1.default);
    }
}
exports.default = OfferService;
