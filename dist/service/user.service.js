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
const user_model_1 = require("../models/user.model");
const photo_model_1 = require("../models/photo.model");
const logger_1 = require("../utils/logger");
const config_1 = require("../config");
const crypto = require("crypto");
class UserService extends base_service_1.default {
    constructor() {
        super(user_model_1.default);
        this.post = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const v = req.body;
                const passwordHash = crypto.createHash("md5").update(v.password).digest("hex");
                v.password = passwordHash;
                const vendor = yield user_model_1.default.create(v);
                res.send(vendor);
            }
            catch (e) {
                logger_1.default.error(`${e.message}`);
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
                const newEvent = yield user_model_1.default.findByIdAndUpdate({ _id }, { photo: photo._id }, { new: true }).populate("photo_ids").exec(); // to return the updated data do - returning: true
                res.send(newEvent);
            }
            catch (e) {
                logger_1.default.error(`User Put Photo ${e.message}`);
                res.status(403);
                res.send({ message: `${config_1.default.RES_ERROR} ${e.message}` });
            }
        });
        this.getPhoto = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const _id = req.params.id;
                const eventPhotos = yield user_model_1.default.findById(_id).select("photo").populate("photo").exec();
                res.send(eventPhotos);
            }
            catch (e) {
                logger_1.default.error(`User Get Photo ${e.message}`);
                res.status(403);
                res.send(e.message);
            }
        });
    }
}
exports.default = UserService;
