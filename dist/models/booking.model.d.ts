/// <reference types="mongoose" />
import mongoose from "../database";
import { BookingSI } from "../interfaces/booking.interface";
declare const Booking: mongoose.Model<BookingSI, {}>;
export default Booking;
