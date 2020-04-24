"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jwt_1 = require("../middleware/jwt");
const booking_service_1 = require("../service/booking.service");
const bookingRouter = express_1.Router();
const vs = new booking_service_1.default();
bookingRouter.post("/", jwt_1.default, vs.post);
bookingRouter.get("/", jwt_1.default, vs.get);
bookingRouter.get("/:id", jwt_1.default, vs.getId);
bookingRouter.put("/:id", jwt_1.default, vs.put);
exports.default = bookingRouter;
