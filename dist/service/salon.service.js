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
const event_model_1 = require("../models/event.model");
const database_1 = require("../database");
const base_service_1 = require("./base.service");
const vendor_model_1 = require("../models/vendor.model");
const salon_model_1 = require("../models/salon.model");
const service_model_1 = require("../models/service.model");
const employees_model_1 = require("../models/employees.model");
const offer_model_1 = require("../models/offer.model");
class SalonService extends base_service_1.default {
    constructor() {
        super(salon_model_1.default);
        this.post = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const d = req.body;
                const salon = yield salon_model_1.default.create(d);
                const _id = salon.vendor_id;
                yield vendor_model_1.default.findOneAndUpdate({ _id }, { $push: { salons: salon._id } });
                res.send(salon);
            }
            catch (e) {
                logger_1.default.error(`${e.message}`);
                res.status(403);
                res.send({ message: `${config_1.default.RES_ERROR} ${e.message}` });
            }
        });
        this.getOffer = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                if (!id) {
                    const errMsg = `id is missing from the params`;
                    logger_1.default.error(errMsg);
                    res.status(400);
                    res.send({ message: errMsg });
                    return;
                }
                const offers = yield offer_model_1.default.find({ salon_id: id });
                if (offers === null || offers.length === 0) {
                    const errMsg = `no offers found`;
                    logger_1.default.error(errMsg);
                    res.status(400);
                    res.send({ message: errMsg });
                    return;
                }
                res.send(offers);
            }
            catch (e) {
                logger_1.default.error(`Booking Offer ${e.message}`);
                res.status(403);
                res.send({ message: `${e.message}` });
            }
        });
        this.getService = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                if (!id) {
                    const errMsg = `id is missing from the params`;
                    logger_1.default.error(errMsg);
                    res.status(400);
                    res.send({ message: errMsg });
                    return;
                }
                const services = yield service_model_1.default.find({ salon_id: id });
                if (services === null || services.length === 0) {
                    const errMsg = `no service found`;
                    logger_1.default.error(errMsg);
                    res.status(400);
                    res.send({ message: errMsg });
                    return;
                }
                res.send(services);
            }
            catch (e) {
                logger_1.default.error(`Booking service ${e.message}`);
                res.status(403);
                res.send({ message: `${e.message}` });
            }
        });
        this.addSalonEmployee = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const d = req.body;
                const _id = database_1.default.Types.ObjectId(req.params.id);
                if (!_id) {
                    const errMsg = `Add Emp: no data with this _id and service was found`;
                    logger_1.default.error(errMsg);
                    res.status(403);
                    res.send({ message: errMsg });
                    return;
                }
                //@ts-ignore
                d.services = d.services.map((s, i) => database_1.default.Types.ObjectId(s));
                const emp = yield employees_model_1.default.create(d);
                const empId = database_1.default.Types.ObjectId(emp._id);
                //@ts-ignore
                const newSalon = yield salon_model_1.default.findOneAndUpdate({ _id, employees: { $nin: [empId] } }, { $push: { employees: empId } }, { new: true }).populate("employees").exec();
                if (newSalon === null) {
                    const errMsg = `Add Emp: no data with this _id and service was found`;
                    logger_1.default.error(errMsg);
                    res.status(403);
                    res.send({ message: errMsg });
                    return;
                }
                res.send(newSalon);
            }
            catch (e) {
                logger_1.default.error(`${e.message}`);
                res.status(403);
                res.send({ message: `${config_1.default.RES_ERROR} ${e.message}` });
            }
        });
        this.deleteSalonEmployee = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const _id = database_1.default.Types.ObjectId(req.params.id);
                const eid = database_1.default.Types.ObjectId(req.params.eid);
                if (!_id || !eid) {
                    const errMsg = `delete Emp: no data with this _id and service was found`;
                    logger_1.default.error(errMsg);
                    res.status(403);
                    res.send({ message: errMsg });
                    return;
                }
                const emp = yield employees_model_1.default.findByIdAndDelete(eid);
                //@ts-ignore
                const newSalon = yield salon_model_1.default.findOneAndUpdate({ _id, employees: { $in: [eid] } }, { $pull: { employees: eid } }, { new: true }).populate("employees").exec();
                if (newSalon === null) {
                    const errMsg = `delete Emp: no data with this _id and service was found`;
                    logger_1.default.error(errMsg);
                    res.status(403);
                    res.send({ message: errMsg });
                    return;
                }
                res.send(newSalon);
            }
            catch (e) {
                logger_1.default.error(`${e.message}`);
                res.status(403);
                res.send({ message: `${config_1.default.RES_ERROR} ${e.message}` });
            }
        });
        this.addSalonService = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const d = req.body;
                const _id = database_1.default.Types.ObjectId(req.params.id);
                if (!_id) {
                    logger_1.default.error(`Salon Id is missing salon_id: ${d.salon_id} & mua_id: ${d.mua_id}`);
                    res.status(403);
                    res.send({ message: `Salon Id is missing salon_id: ${d.salon_id} & mua_id: ${d.mua_id}` });
                    return;
                }
                const service = yield service_model_1.default.create(d);
                const service_id = database_1.default.Types.ObjectId(service._id);
                //@ts-ignore
                const newSalon = yield salon_model_1.default.findOneAndUpdate({ _id, services: { $nin: [service_id] } }, { $push: { services: service_id } }, { new: true }).populate("services").exec();
                if (newSalon === null) {
                    const errMsg = `Add Services: no data with this _id and service was found`;
                    logger_1.default.error(errMsg);
                    res.status(403);
                    res.send({ message: errMsg });
                    return;
                }
                console.log(newSalon);
                res.send(newSalon);
            }
            catch (e) {
                logger_1.default.error(`${e.message}`);
                res.status(403);
                res.send({ message: `${config_1.default.RES_ERROR} ${e.message}` });
            }
        });
        this.deleteSalonService = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const sid = req.params.sid;
                const _id = req.params.id;
                if (!_id || !sid) {
                    logger_1.default.error(`Salon Id is missing salon_id:  & mua_id: `);
                    res.status(403);
                    res.send({ message: `Salon Id is missing salon_id: ` });
                    return;
                }
                const osid = database_1.default.Types.ObjectId(sid);
                // @ts-ignore
                const newSalon = yield salon_model_1.default.findOneAndUpdate({ _id, services: { $in: [osid] } }, { $pull: { services: osid } }, { new: true });
                if (newSalon === null) {
                    const errMsg = `Delete Service: no data with this _id and service was found`;
                    logger_1.default.error(errMsg);
                    res.status(403);
                    res.send({ message: errMsg });
                    return;
                }
                res.send(newSalon);
            }
            catch (e) {
                logger_1.default.error(`${e.message}`);
                res.status(403);
                res.send({ message: `${config_1.default.RES_ERROR} ${e.message}` });
            }
        });
        //associating salons to events
        this.addSalonEvent = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const d = req.body;
                const eventid = database_1.default.Types.ObjectId(d.event_id);
                const designerId = database_1.default.Types.ObjectId(d.designer_id);
                const designerEventReq = event_model_1.default.findOneAndUpdate({ _id: eventid, designers: { $nin: [designerId] } }, { $push: { designers: designerId } }, { new: true });
                const newSalonReq = salon_model_1.default.findOneAndUpdate({ _id: designerId, events: { $nin: [eventid] } }, { $push: { events: eventid } }, { new: true });
                const [designerEvent, newDesigner] = yield Promise.all([designerEventReq, newSalonReq]);
                if (designerEvent === null || newDesigner === null) {
                    logger_1.default.error(`Not able to update event`);
                    res.status(400);
                    res.send({ message: `Not able to update event: eventid -  ${eventid}, event_id: ${d.event_id}` });
                    return;
                }
                console.log(designerEvent);
                console.log(newDesigner);
                res.send(designerEvent);
            }
            catch (e) {
                logger_1.default.error(`${e.message}`);
                res.status(403);
                res.send({ message: `${config_1.default.RES_ERROR} ${e.message}` });
            }
        });
    }
}
exports.default = SalonService;
