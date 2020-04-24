"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../database");
const EventSchema = new database_1.default.Schema({
    name: {
        type: String,
        required: true
    },
    start_date_time: {
        type: Date,
        required: true
    },
    end_date_time: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    entry_procedure: {
        type: String,
        required: true
    },
    exhibition_house: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    approved: {
        type: Boolean,
        default: true
    },
    photo_ids: {
        type: [{
                type: database_1.default.Schema.Types.ObjectId,
                ref: "photos"
            }]
    },
    designers: {
        type: [{
                type: database_1.default.Schema.Types.ObjectId,
                ref: "designers"
            }]
    },
    makeup_artists: {
        type: [{
                type: database_1.default.Schema.Types.ObjectId,
                ref: "makeup_artists"
            }]
    }
}, {
    timestamps: true
});
const Event = database_1.default.model("events", EventSchema);
exports.default = Event;
