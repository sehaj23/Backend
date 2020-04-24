"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const admin_model_1 = require("../models/admin.model");
const config_1 = require("../config");
const crypto = require("crypto");
const logger_1 = require("../utils/logger");
class AdminService {
}
exports.default = AdminService;
AdminService.post = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password, role } = req.body;
        if (!username || !password || !role) {
            res.status(403);
            res.send({ message: "Send all data" });
            return;
        }
        const passwordHash = crypto.createHash("md5").update(password).digest("hex");
        const adminData = {
            username,
            password: passwordHash,
            role
        };
        const admin = yield admin_model_1.default.create(adminData);
        admin.password = "";
        res.send(admin);
    }
    catch (e) {
        res.status(403);
        res.send({ message: `${config_1.default.RES_ERROR} ${e.message}` });
    }
});
AdminService.get = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admins = yield admin_model_1.default.find().select("-password`"); //Admin.findAll({attributes: {exclude: ["password"]}})
        res.send(admins);
    }
    catch (e) {
        logger_1.default.error(e.message);
        res.status(403);
        res.send(e.message);
    }
});
AdminService.put = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, username, role } = req.body;
        if (!username || !id || !role) {
            res.status(403);
            res.send({ message: "Send all data" });
            return;
        }
        const adminData = {
            username,
            role
        };
        const [num, admin] = yield admin_model_1.default.update(adminData, { where: { _id: id } }); // to return the updated data do - returning: true
        res.send(adminData);
    }
    catch (e) {
        res.status(403);
        res.send({ message: `${config_1.default.RES_ERROR} ${e.message}` });
    }
});
