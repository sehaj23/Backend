"use strict";
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();
let db = (_a = process.env.DB_NAME) !== null && _a !== void 0 ? _a : "zattire";
if (process.env.NODE_ENV === "test")
    db += "_test";
console.log(`Datatabasaeeeae: ${db}`);
const uri = (_b = process.env.DB_URI) !== null && _b !== void 0 ? _b : `mongodb://127.0.0.1:27017/${db}`;
const user = (_c = process.env.DB_USER) !== null && _c !== void 0 ? _c : "postgres";
const password = (_d = process.env.DB_PASS) !== null && _d !== void 0 ? _d : "postgres";
exports.connectt = () => {
    return mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        poolSize: 10,
        useFindAndModify: true
    }, (err) => {
        if (err) {
            console.log(err.message);
        }
        else {
            console.log("Successfully Connected!");
        }
    });
};
exports.disconnect = () => {
    if (process.env.NODE_ENV === "test") {
        return mongoose.connection.db.dropDatabase().then(() => {
            return mongoose.disconnect();
        });
    }
    else {
        return mongoose.disconnect();
    }
};
exports.default = mongoose;
