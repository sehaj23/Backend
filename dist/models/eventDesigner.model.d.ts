/// <reference types="mongoose" />
import mongoose from "../database";
import { EventDesignerSI } from "../interfaces/eventDesigner.model";
declare const EventDesigner: mongoose.Model<EventDesignerSI, {}>;
export default EventDesigner;
