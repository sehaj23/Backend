"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../database");
const EventMakeupArtistShema = new database_1.default.Schema({
    event_id: {
        type: database_1.default.Schema.Types.ObjectId,
        res: "event"
    },
    makeup_artist_id: {
        type: database_1.default.Schema.Types.ObjectId,
        res: "makeup_artist"
    }
}, {
    timestamps: true
});
const EventMakeupArtist = database_1.default.model("event_makeup_artist", EventMakeupArtistShema);
exports.default = EventMakeupArtist;
