/// <reference types="mongoose" />
import mongoose from "../database";
import { DesignersSI } from "../interfaces/designer.interface";
declare const Designer: mongoose.Model<DesignersSI, {}>;
export default Designer;
