import mongoose from "../database";

export default interface EventDesignerI{
    event_id: mongoose.Schema.Types.ObjectId
    designer_id: mongoose.Schema.Types.ObjectId
}

export interface EventDesignerSI extends EventDesignerI, mongoose.Document{}


