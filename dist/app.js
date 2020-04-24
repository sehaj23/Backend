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
const express = require("express");
const bobyParser = require("body-parser");
const morgan = require("morgan");
const fs = require("fs");
const dotenv = require("dotenv");
const index_routes_1 = require("./routes/index.routes");
const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const newVendor_model_1 = require("./models/newVendor.model");
const logger_1 = require("./utils/logger");
const cors = require("cors");
const app = express();
app.use(cors());
const spacesEndpoint = new aws.Endpoint("nyc3.digitaloceanspaces.com");
const s3 = new aws.S3({
    //@ts-ignore
    endpoint: spacesEndpoint,
    accessKeyId: "DQC6AT6WECGTVTPBMEPW",
    secretAccessKey: "1aG2MQPG1CBJS01q/y6pjLwRVNgzPwfkNkvWa3XCrp8",
});
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: "zattire",
        acl: "public-read",
        key: function (request, file, cb) {
            console.log(file);
            cb(null, `images/${Date.now()}_${file.originalname}`);
        },
    }),
}).array("upload", 1);
app.post("/upload", function (request, response, next) {
    upload(request, response, function (error) {
        if (error) {
            console.log(error);
            return response.send(`/error/${error}`);
        }
        console.log("File uploaded successfully.");
        const location = request.files[0].location;
        response.send({
            location,
            success: true
        });
    });
});
dotenv.config();
const accessLogStream = fs.createWriteStream("access.log", { flags: "a" });
// setup the logger
// app.use(morgan('combined', { stream: accessLogStream }))
app.use(morgan(":remote-addr - :method :url :status :res[content-length] - :response-time ms"));
app.use(bobyParser.json());
app.use("/api", index_routes_1.default);
app.get("/app/get-vendor", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const nv = yield newVendor_model_1.default.find();
        res.send(nv);
    }
    catch (e) {
        logger_1.default.error(e.message);
        res.status(403);
        res.send({ error: e.message });
    }
}));
app.post("/create-vendor", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    console.log(req.body);
    const data = {
        name,
    };
    try {
        const nv = yield newVendor_model_1.default.create(data);
        res.send(nv);
    }
    catch (e) {
        logger_1.default.error(e.message);
        res.status(403);
        res.send({ error: e.message });
    }
}));
app.put("/update-vendor/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _id = req.params.id;
    try {
        const nv = yield newVendor_model_1.default.update({ _id }, req.body);
        res.send(nv);
    }
    catch (e) {
        logger_1.default.error(e.message);
        res.status(403);
        res.send({ error: e.message });
    }
}));
app.get("/", (req, res) => {
    res.send("hello");
});
// this is for 404
app.use(function (req, res, next) {
    var err = new Error("Not Found");
    err.name = "404";
    res.status(404);
    res.send(err);
});
exports.default = app;
