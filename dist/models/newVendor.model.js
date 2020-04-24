"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../database");
const NewVendorSchema = new database_1.default.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String
    },
    phone: {
        type: String
    }
}, {
    timestamps: true,
    strict: false
});
const NewVendor = database_1.default.model("new_vendor", NewVendorSchema);
exports.default = NewVendor;
