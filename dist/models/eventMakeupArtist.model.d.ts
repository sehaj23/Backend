/// <reference types="mongoose" />
import mongoose from "../database";
import EventMakeupArtistSI from "../interfaces/eventMakeupArtist.interface";
declare const EventMakeupArtist: mongoose.Model<EventMakeupArtistSI, {}>;
export default EventMakeupArtist;
