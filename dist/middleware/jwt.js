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
const jwt = require("jwt-then");
const config_1 = require("../config");
const logger_1 = require("../utils/logger");
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (process.env.NODE_ENV === 'test') {
        next();
        return;
    }
    // check header or url parameters or post parameters for token
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) {
        logger_1.default.error("No token provided.");
        res.status(401).send({ success: false, message: 'No token provided.' });
        return;
    }
    try {
        // verifies secret and checks exp
        const decoded = yield jwt.verify(token, config_1.default.JWT_KEY);
        // @ts-ignore
        if (!decoded._id) {
            logger_1.default.error("something went wrong, please login again");
            res.status(401).send({ message: "something went wrong, please login again" });
            return;
        }
        // @ts-ignore
        req.userId = decoded._id;
        next();
    }
    catch (err) {
        res.status(401).send({ auth: false, message: err });
    }
});
exports.default = verifyToken;
