"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../database");
const DesignerSchema = new database_1.default.Schema({
    brand_name: {
        type: String,
        required: true
    },
    designer_name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    contact_number: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    start_price: {
        type: Number,
        required: true
    },
    end_price: {
        type: Number,
        required: true
    },
    outfit_types: {
        type: [{ type: String }],
    },
    speciality: {
        type: [{ type: String }],
        required: true
    },
    location: {
        type: String,
        required: true,
    },
    insta_link: {
        type: String,
    },
    fb_link: {
        type: String,
    },
    start_working_hours: {
        type: [Date],
        required: true
    },
    end_working_hours: {
        type: [Date],
        required: true
    },
    approved: {
        type: Boolean,
        default: false
    },
    photo_ids: {
        type: [{
                type: database_1.default.Schema.Types.ObjectId,
                ref: "photos"
            }]
    },
    vendor_id: {
        type: database_1.default.Schema.Types.ObjectId,
        ref: "vendors",
        required: true
    },
    events: {
        type: [{
                type: database_1.default.Schema.Types.ObjectId,
                ref: "events"
            }]
    },
    commision_percentage: {
        type: Number
    },
    commision_cap: {
        type: Number
    },
    commision_fixed_price: {
        type: Number
    }
}, {
    timestamps: true
});
const Designer = database_1.default.model("designers", DesignerSchema, 'designers');
exports.default = Designer;
