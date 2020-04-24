"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../database");
const ServiceSchema = new database_1.default.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    photo: {
        type: database_1.default.Schema.Types.ObjectId,
        ref: "photos"
    },
    salon_id: {
        type: database_1.default.Schema.Types.ObjectId,
        ref: "salons"
    },
    mua_id: {
        type: database_1.default.Schema.Types.ObjectId,
        ref: "makeup_artists"
    }
});
const Service = database_1.default.model("services", ServiceSchema);
exports.default = Service;
