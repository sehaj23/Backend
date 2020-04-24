"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../database");
const AdminSchema = new database_1.default.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ["admin", "sub-admin"],
        default: "admin"
    }
}, {
    timestamps: true
});
const Admin = database_1.default.model("admin", AdminSchema);
exports.default = Admin;
