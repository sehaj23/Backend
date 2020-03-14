
import { Table, Model, AutoIncrement, PrimaryKey, Column, AllowNull, NotEmpty, DataType, Default, ForeignKey, HasMany, BelongsTo, BelongsToMany } from "sequelize-typescript";
import Photo from "./photo.model";
import MakeupArtist from "./makeupArtist.model";
import EventMakeupArtist from "./eventMakeupArtist.model";
import Designer from "./designers.model";
import EventDesigner from "./eventDesigner.model";

export interface EventI{
    id?: number | null
    name: string
    start_date: Date
    end_date: Date
    location: string
    entry_procedure: string
    exhibition_house: string
    description: string
    approved?: boolean
    photo_ids?: number[]
}

@Table({
    timestamps: true,
    tableName: "event"
})
class Event extends Model<Event> implements EventI{
    
    @AutoIncrement
    @PrimaryKey
    @Column
    id?: number

    @AllowNull(false)
    @NotEmpty
    @Column
    name!: string;

    @AllowNull(false)
    @NotEmpty
    @Column(DataType.DATE)
    start_date!: Date;

    @AllowNull(false)
    @NotEmpty
    @Column(DataType.DATE)
    end_date!: Date;

    @AllowNull(false)
    @NotEmpty
    @Column
    location!: string;

    @AllowNull(false)
    @NotEmpty
    @Column
    entry_procedure!: string;

    @AllowNull(false)
    @NotEmpty
    @Column
    exhibition_house!: string;

    @AllowNull(false)
    @NotEmpty
    @Column
    description!: string;

    @AllowNull(false)
    @NotEmpty
    @Default(false)
    @Column
    approved?: boolean

    @ForeignKey(() => Photo)
    @Column(DataType.ARRAY(DataType.INTEGER))
    photo_ids?: number[]

    @BelongsToMany(() => MakeupArtist, () => EventMakeupArtist)
    makeupArtis?: Array<MakeupArtist & {EventMakeupArtist: EventMakeupArtist}>

    @BelongsToMany(() => Designer, () => EventDesigner)
    designers?: Array<Designer & {EventDesigner: EventDesigner}>

}

export default Event