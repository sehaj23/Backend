import { Table, Model, AutoIncrement, PrimaryKey, Column, AllowNull, NotEmpty, DataType, Default, BelongsTo, ForeignKey } from "sequelize-typescript";
import Event from "./event.model";
import MakeupArtist from "./makeupArtist.model";
import mongoose from "../database";
import EventMakeupArtistSI from "../interfaces/eventMakeupArtist.interface";


const EventMakeupArtistShema = new mongoose.Schema({
    event_id: {
        type: mongoose.Schema.Types.ObjectId,
        res: "event"
    },
    makeup_artist_id: {
        type: mongoose.Schema.Types.ObjectId,
        res: "makeup_artist"
    }
}, {
    timestamps: true
})
const EventMakeupArtist = mongoose.model<EventMakeupArtistSI>("event_makeup_artist", EventMakeupArtistShema)
export default EventMakeupArtist