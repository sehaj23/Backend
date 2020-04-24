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
const config_1 = require("../config");
const logger_1 = require("../utils/logger");
const makeupArtist_model_1 = require("../models/makeupArtist.model");
const vendor_model_1 = require("../models/vendor.model");
const database_1 = require("../database");
const event_model_1 = require("../models/event.model");
const base_service_1 = require("./base.service");
class MakeupartistServiceC extends base_service_1.default {
    constructor() {
        super(makeupArtist_model_1.default);
        this.post = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const ma = req.body;
                const makeupartist = yield makeupArtist_model_1.default.create(ma);
                const _id = makeupartist.vendor_id;
                yield vendor_model_1.default.findOneAndUpdate({ _id }, { $push: { makeup_artists: makeupartist._id } });
                res.send(makeupartist);
            }
            catch (e) {
                logger_1.default.error(`${e.message}`);
                res.status(400);
                res.send({ message: `${config_1.default.RES_ERROR} ${e.message}` });
            }
        });
        //associating designers to events
        this.addMakeupArtistEvent = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                if (!data.event_id || !data.makeup_artist_id) {
                    logger_1.default.error(`not comeplete data Refer EventMakeupArtistI Interface. event_id: ${data.event_id} & makeup_artist_id: ${data.makeup_artist_id}`);
                    res.status(400);
                    res.send({ message: `not comeplete data Refer EventMakeupArtistI Interface. event_id: ${data.event_id} & makeup_artist_id: ${data.makeup_artist_id}` });
                    return;
                }
                const eventId = database_1.default.Types.ObjectId(data.event_id);
                const makeupArtistId = database_1.default.Types.ObjectId(data.makeup_artist_id);
                const eventReq = event_model_1.default.findOneAndUpdate({ _id: eventId, makeup_artists: { $nin: [makeupArtistId] } }, { $push: { makeup_artists: makeupArtistId } }, { new: true });
                //@ts-ignore
                const muaReq = makeupArtist_model_1.default.findOneAndUpdate({ _id: makeupArtistId, events: { $nin: [data.event_id] } }, { $push: { events: eventId } }, { new: true });
                const [e, mua] = yield Promise.all([eventReq, muaReq]);
                if (e === null || mua === null) {
                    logger_1.default.error(`Not able to update event`);
                    res.status(400);
                    res.send({ message: `Not able to update event: e -  ${e} & mua ${mua}` });
                    return;
                }
                res.send(e);
            }
            catch (e) {
                logger_1.default.error(`${e.message}`);
                res.status(400);
                res.send({ message: `${config_1.default.RES_ERROR} ${e.message}` });
            }
        });
        this.deleteMakeupArtistEvent = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                if (!data.event_id || !data.makeup_artist_id) {
                    logger_1.default.error(`Not comeplete data Refer EventMakeupArtistI Interface. event_id: ${data.event_id} & makeup_artist_id: ${data.makeup_artist_id}`);
                    res.status(400);
                    res.send({ message: `not comeplete data Refer EventMakeupArtistI Interface. event_id: ${data.event_id} & makeup_artist_id: ${data.makeup_artist_id}` });
                    return;
                }
                const eventId = database_1.default.Types.ObjectId(data.event_id);
                const makeupArtistId = database_1.default.Types.ObjectId(data.makeup_artist_id);
                const eventReq = event_model_1.default.updateOne({ _id: eventId, makeup_artists: { $in: [makeupArtistId] } }, { $pull: { makeup_artists: makeupArtistId } });
                //@ts-ignore
                const muaReq = makeupArtist_model_1.default.updateOne({ _id: makeupArtistId, events: { $in: [eventId] } }, { $pull: { events: eventId } });
                const [e, mua] = yield Promise.all([eventReq, muaReq]);
                if (e.nModified === 0 || mua.nModified === 0) {
                    logger_1.default.error(`IDs do not match`);
                    res.status(400);
                    res.send({ message: `IDs do not match` });
                    return;
                }
                res.status(204);
                res.send(true);
            }
            catch (e) {
                logger_1.default.error(`${e.message}`);
                res.status(400);
                res.send({ message: `${config_1.default.RES_ERROR} ${e.message}` });
            }
        });
    }
}
exports.default = MakeupartistServiceC;
