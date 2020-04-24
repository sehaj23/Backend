"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_service_1 = require("./base.service");
const booking_model_1 = require("../models/booking.model");
const logger_1 = require("../utils/logger");
const database_1 = require("../database");
const service_model_1 = require("../models/service.model");
const offer_model_1 = require("../models/offer.model");
class BookinkService extends base_service_1.default {
    constructor() {
        super(booking_model_1.default);
        this.post = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const e = req.body;
                if (!e.salon_id && !e.makeup_artist_id && !e.designer_id) {
                    const errMsg = `Atleast one provider is is reqired out of 3`;
                    logger_1.default.error(errMsg);
                    res.status(400);
                    res.send({ message: errMsg });
                    return;
                }
                // if(e.salon_id){
                //     e.salon_id = mongoose.Types.ObjectId(e.salon_id.toString())
                // }
                // if(e.makeup_artist_id){
                //     e.makeup_artist_id = mongoose.Types.ObjectId(e.makeup_artist_id.toString())
                // }
                // if(e.designer_id){
                //     e.designer_id = mongoose.Types.ObjectId(e.designer_id.toString())
                // }
                const { services } = e;
                if (!services) {
                    const errMsg = `Services not defined`;
                    logger_1.default.error(errMsg);
                    res.status(400);
                    res.send({ message: errMsg });
                    return;
                }
                if (services.length === 0) {
                    const errMsg = `Atleast one services is required. Length is 0`;
                    logger_1.default.error(errMsg);
                    res.status(400);
                    res.send({ message: errMsg });
                    return;
                }
                const serviceIds = [];
                for (let s of services) {
                    if (s.service_id) {
                        if (!s.service_time) {
                            const errMsg = `Service time not found for id: ${s.service_id}`;
                            logger_1.default.error(errMsg);
                            res.status(400);
                            res.send({ message: errMsg });
                            return;
                        }
                        serviceIds.push(database_1.default.Types.ObjectId(s.service_id));
                    }
                    else {
                        const errMsg = `Service Id not found: 22`;
                        logger_1.default.error(errMsg);
                        res.status(400);
                        res.send({ message: errMsg });
                        return;
                    }
                }
                if (serviceIds.length === 0) {
                    const errMsg = `Service Ids not found`;
                    logger_1.default.error(errMsg);
                    res.status(400);
                    res.send({ message: errMsg });
                    return;
                }
                const serviceInfoReq = service_model_1.default.find({ _id: { $in: serviceIds } });
                const offerInfoReq = offer_model_1.default.find({ service_id: { $in: serviceIds } });
                const [serviceInfo, offerInfo] = yield Promise.all([serviceInfoReq, offerInfoReq]);
                if (serviceInfo.length === 0) {
                    const errMsg = `serviceInfo not found`;
                    logger_1.default.error(errMsg);
                    res.status(400);
                    res.send({ message: errMsg });
                    return;
                }
                for (let offer of offerInfo) {
                    for (let service of serviceInfo) {
                        if (offer._id === service._id) {
                            // TODO: 
                        }
                    }
                }
                const event = yield booking_model_1.default.create(e);
                res.send(event);
            }
            catch (e) {
                logger_1.default.error(`Post ${e.message}`);
                res.status(403);
                res.send({ message: `${e.message}` });
            }
        });
    }
}
exports.default = BookinkService;
