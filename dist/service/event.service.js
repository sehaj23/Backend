"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const event_model_1 = require("../models/event.model");
const base_service_1 = require("./base.service");
class EventService extends base_service_1.default {
    constructor() {
        super(event_model_1.default);
    }
}
exports.default = EventService;
