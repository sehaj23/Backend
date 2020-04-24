"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../database");
const VendorSchema = new database_1.default.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    contact_number: {
        type: String,
        required: true
    },
    premium: {
        type: Boolean,
        default: false
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
    },
    salons: {
        type: [{
                type: database_1.default.Schema.Types.ObjectId,
                ref: "salons"
            }]
    }
}, {
    timestamps: true
});
const Vendor = database_1.default.model("vendor", VendorSchema);
exports.default = Vendor;
