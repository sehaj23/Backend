import mongoose from "../database";
import { EventDesignerSI } from "../interfaces/eventDesigner.model";


const EventDesignerSchema = new mongoose.Schema({
    event_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "event"
    },
    designer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "designer"
    }
}, {
    timestamps: true
})

const EventDesigner = mongoose.model<EventDesignerSI>("event_designer", EventDesignerSchema)

export default EventDesigner