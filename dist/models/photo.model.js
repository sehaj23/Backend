"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../database");
const PhotoSchema = new database_1.default.Schema({
    name: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
        required: true
    },
    approved: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
const Photo = database_1.default.model("photos", PhotoSchema);
exports.default = Photo;
