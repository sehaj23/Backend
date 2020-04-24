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
const designers_model_1 = require("../models/designers.model");
const event_model_1 = require("../models/event.model");
const database_1 = require("../database");
const base_service_1 = require("./base.service");
const vendor_model_1 = require("../models/vendor.model");
class DesignerService extends base_service_1.default {
    constructor() {
        super(designers_model_1.default);
        this.post = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const d = req.body;
                const designer = yield designers_model_1.default.create(d);
                const _id = designer.vendor_id;
                yield vendor_model_1.default.findOneAndUpdate({ _id }, { $push: { designers: designer._id } });
                res.send(designer);
            }
            catch (e) {
                logger_1.default.error(`${e.message}`);
                res.status(400);
                res.send({ message: `${config_1.default.RES_ERROR} ${e.message}` });
            }
        });
        //associating designers to events
        this.addDesignerEvent = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const d = req.body;
                const eventid = database_1.default.Types.ObjectId(d.event_id);
                const designerId = database_1.default.Types.ObjectId(d.designer_id);
                const designerEventReq = event_model_1.default.findOneAndUpdate({ _id: eventid, designers: { $nin: [designerId] } }, { $push: { designers: designerId } }, { new: true });
                const newDesignerReq = designers_model_1.default.findOneAndUpdate({ _id: designerId, events: { $nin: [eventid] } }, { $push: { events: eventid } }, { new: true });
                const [designerEvent, newDesigner] = yield Promise.all([designerEventReq, newDesignerReq]);
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
                res.status(400);
                res.send({ message: `${config_1.default.RES_ERROR} ${e.message}` });
            }
        });
        this.deleteDesignerEvent = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const d = req.body;
                const eventid = d.event_id;
                const designerId = d.designer_id;
                console.log(eventid);
                console.log(designerId);
                const designerEventReq = event_model_1.default.updateOne({ _id: eventid, designers: { $in: [designerId] } }, { $pull: { "designers": designerId } });
                const newDesignerReq = designers_model_1.default.updateOne({ _id: designerId, events: { $in: [eventid] } }, { $pull: { "events": eventid } });
                const [designerEvent, newDesigner] = yield Promise.all([designerEventReq, newDesignerReq]);
                console.log(designerEvent);
                console.log(newDesigner);
                if (designerEvent.nModified === 0 || newDesigner.nModified === 0) {
                    logger_1.default.error(`IDs do not match`);
                    res.status(400);
                    res.send({ message: `IDs do not match` });
                    return;
                }
                res.status(204);
                res.send(true);
            }
            catch (e) {
                console.log("**************");
                console.log(e.message);
                console.log("**************");
                logger_1.default.error(`${e.message}`);
                res.status(400);
                res.send({ message: `${config_1.default.RES_ERROR} ${e.message}` });
            }
        });
    }
}
exports.default = DesignerService;
