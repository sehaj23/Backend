"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../database");
const EventDesignerSchema = new database_1.default.Schema({
    event_id: {
        type: database_1.default.Schema.Types.ObjectId,
        ref: "event"
    },
    designer_id: {
        type: database_1.default.Schema.Types.ObjectId,
        ref: "designer"
    }
}, {
    timestamps: true
});
const EventDesigner = database_1.default.model("event_designer", EventDesignerSchema);
exports.default = EventDesigner;
