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
const crypto = require("crypto");
const admin_model_1 = require("../models/admin.model");
const express_1 = require("express");
const jwt = require("jwt-then");
const config_1 = require("../config");
const loginRouter = express_1.Router();
class LoginService {
}
exports.default = LoginService;
LoginService.post = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        const { username, password } = req.body;
        if (!username || !password) {
            res.status(403);
            res.send({ message: "Send all data" });
            return;
        }
        const passwordHash = crypto.createHash("md5").update(password).digest("hex");
        const admin = yield admin_model_1.default.findOne({ username, password: passwordHash });
        if (admin == null) {
            res.status(403);
            res.send({ message: "Username password does not match" });
            return;
        }
        admin.password = "";
        const token = yield jwt.sign(admin.toJSON(), config_1.default.JWT_KEY);
        res.send({ token });
    }
    catch (e) {
        res.status(403);
        res.send({ message: `${config_1.default.RES_ERROR} ${e.message}` });
    }
});
