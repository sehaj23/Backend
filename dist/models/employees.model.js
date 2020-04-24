"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../database");
const EmployeeSchema = new database_1.default.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    services: {
        type: [{
                type: database_1.default.Schema.Types.ObjectId,
                ref: "services"
            }]
    },
    photo: {
        type: database_1.default.Schema.Types.ObjectId,
        ref: "photos"
    }
}, {
    timestamps: true
});
const Employee = database_1.default.model("employees", EmployeeSchema);
exports.default = Employee;
