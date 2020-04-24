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
const crypto = require("crypto");
const logger_1 = require("../utils/logger");
const vendor_model_1 = require("../models/vendor.model");
const base_service_1 = require("./base.service");
class VendorService extends base_service_1.default {
    constructor() {
        super(vendor_model_1.default);
        this.post = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const v = req.body;
                const passwordHash = crypto.createHash("md5").update(v.password).digest("hex");
                v.password = passwordHash;
                const vendor = yield vendor_model_1.default.create(v);
                res.send(vendor);
            }
            catch (e) {
                logger_1.default.error(`${e.message}`);
                res.status(403);
                res.send({ message: `${config_1.default.RES_ERROR} ${e.message}` });
            }
        });
    }
}
exports.default = VendorService;
