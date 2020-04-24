/// <reference types="mongoose" />
import mongoose from "../database";
import MakeupArtistSI from "../interfaces/makeupArtist.interface";
declare const MakeupArtist: mongoose.Model<MakeupArtistSI, {}>;
export default MakeupArtist;
