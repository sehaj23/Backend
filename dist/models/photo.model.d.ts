/// <reference types="mongoose" />
import mongoose from "../database";
import PhotoSI from "../interfaces/photo.interface";
declare const Photo: mongoose.Model<PhotoSI, {}>;
export default Photo;
