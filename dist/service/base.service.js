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
const logger_1 = require("../utils/logger");
const config_1 = require("../config");
const photo_model_1 = require("../models/photo.model");
class BaseService {
    constructor(model) {
        this.post = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const e = req.body;
                const event = yield this.model.create(e);
                res.send(event);
            }
            catch (e) {
                logger_1.default.error(`${this.modelName} Post ${e.message}`);
                res.status(403);
                res.send({ message: `${e.message}` });
            }
        });
        this.get = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                // let {limit, offset} = req.query;
                // const this.models = await this.model.findAndCountAll({offset, limit})
                const events = yield this.model.find().select("-password").populate("user_id").populate("salon_id").populate("designer_id").populate("makeup_artist_id").populate("salons").populate("designers").populate("makeup_artists").populate("photo_ids").exec();
                res.send(events);
            }
            catch (e) {
                logger_1.default.error(`${this.modelName} Get ${e.message}`);
                res.status(403);
                res.send(e.message);
            }
        });
        this.getId = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                if (!id) {
                    const msg = 'Id not found for vendor.';
                    logger_1.default.error(msg);
                    res.status(403);
                    res.send(msg);
                    return;
                }
                const event = yield this.model.findById(id).select("-password").populate("user_id").populate("salon_id").populate("designer_id").populate("makeup_artist_id").populate("services").populate('events').populate("salons").populate("designers").populate("makeup_artists").populate("photo_ids").exec();
                if (event === null) {
                    const msg = `${this.modelName} no data found with this id `;
                    logger_1.default.error(msg);
                    res.status(403);
                    res.send(msg);
                    return;
                }
                console.log(event);
                res.send(event);
            }
            catch (e) {
                logger_1.default.error(`${this.modelName} Get ${e.message}`);
                res.status(403);
                res.send(e.message);
            }
        });
        this.put = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const eventData = req.body;
                const _id = req.params.id;
                const newEvent = yield this.model.findByIdAndUpdate({ _id }, eventData, { new: true }); // to return the updated data do - returning: true
                res.send(newEvent);
            }
            catch (e) {
                logger_1.default.error(`${this.modelName} Put ${e.message}`);
                res.status(403);
                res.send({ message: `${config_1.default.RES_ERROR} ${e.message}` });
            }
        });
        this.putPhoto = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const photoData = req.body;
                const _id = req.params.id;
                // saving photos 
                const photo = yield photo_model_1.default.create(photoData);
                // adding it to event
                const newEvent = yield this.model.findByIdAndUpdate({ _id }, { $push: { photo_ids: photo._id } }, { new: true }).populate("photo_ids").exec(); // to return the updated data do - returning: true
                res.send(newEvent);
            }
            catch (e) {
                logger_1.default.error(`${this.modelName} Put Photo ${e.message}`);
                res.status(403);
                res.send({ message: `${config_1.default.RES_ERROR} ${e.message}` });
            }
        });
        this.getPhoto = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const _id = req.params.id;
                const eventPhotos = yield this.model.findById(_id).select("photo_ids").populate("photo_ids").exec();
                res.send(eventPhotos);
            }
            catch (e) {
                logger_1.default.error(`${this.modelName} Get Photo ${e.message}`);
                res.status(403);
                res.send(e.message);
            }
        });
        this.model = model;
        this.modelName = model.modelName;
    }
}
exports.default = BaseService;
