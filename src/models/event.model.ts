
import mongoose from "../database";

const EventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    start_date_time: {
        type: Date,
        required: true
    },
    end_date_time: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    entry_procedure: {
        type: String,
        required: true
    },
    exhibition_house: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    approved: {
        type: Boolean,
        default: true
    },
    photo_ids: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "photo"
        }]
    }
}, {
    timestamps: true
})

const Event = mongoose.model("event", EventSchema)

export default Event