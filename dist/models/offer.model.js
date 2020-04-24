"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../database");
const OfferSchema = new database_1.default.Schema({
    salon_id: {
        type: database_1.default.Schema.Types.ObjectId,
        ref: "salons",
        required: true
    },
    service_id: {
        type: database_1.default.Schema.Types.ObjectId,
        ref: "services",
        required: true
    },
    updated_price: {
        type: Number,
        required: true
    },
    start_date: {
        type: Date,
        required: true
    },
    end_date: {
        type: Date,
        required: true
    },
    approved: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});
const Offer = database_1.default.model("offers", OfferSchema);
exports.default = Offer;
