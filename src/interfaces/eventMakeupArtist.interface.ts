import mongoose from "../database";

export interface EventMakeupArtistI{
    event_id: mongoose.Schema.Types.ObjectId
    makeup_artist_id: mongoose.Schema.Types.ObjectId
}

export default interface EventMakeupArtistSI extends EventMakeupArtistI, mongoose.Document{}