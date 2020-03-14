import { Table, Model, AutoIncrement, PrimaryKey, Column, AllowNull, NotEmpty, DataType, Default, BelongsTo, ForeignKey } from "sequelize-typescript";
import Event from "./event.model";
import MakeupArtist from "./makeupArtist.model";

type PhotoType = 'Original' | 'ToShow'

export interface EventMakeupArtistI{
    id?: number | null
    event_id: number
    makeup_artist_id: number
}

@Table({
    timestamps: true,
    tableName: "event_makeup_artist"
})
class EventMakeupArtist extends Model<EventMakeupArtist> implements EventMakeupArtistI{
    
 
    @AutoIncrement
    @PrimaryKey
    @Column
    id?: number

    @AllowNull(false)
    @NotEmpty
    @ForeignKey(() => Event)
    @Column
    event_id!: number;


    @AllowNull(false)
    @NotEmpty
    @ForeignKey(() => MakeupArtist)
    @Column
    makeup_artist_id!: number;

}
export default EventMakeupArtist