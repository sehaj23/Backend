"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const login_service_1 = require("../service/login.service");
const loginRouter = express_1.Router();
loginRouter.post("/", login_service_1.default.post);
exports.default = loginRouter;
