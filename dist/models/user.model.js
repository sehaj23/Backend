"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../database");
const UserSchema = new database_1.default.Schema({
    name: {
        type: String,
        required: true,
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
    signin_from: {
        type: String,
    },
    photo: {
        type: database_1.default.Schema.Types.ObjectId,
        ref: "photos"
    },
    age: {
        type: String,
    },
    gender: {
        type: String,
    },
    color_complextion: {
        type: String,
    },
    approved: {
        type: Boolean,
        default: false
    }
});
const User = database_1.default.model("users", UserSchema);
exports.default = User;
