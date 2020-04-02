import { Table, Model, AutoIncrement, PrimaryKey, Column, AllowNull, NotEmpty, DataType, Default, ForeignKey, HasMany, BelongsTo, BelongsToMany } from "sequelize-typescript";
import Photo from "./photo.model";
import Event from "./event.model";
import EventMakeupArtist from "./eventMakeupArtist.model";
import MakeupArtistService from "./makeupArtistService.model";
import Vendor from "./vendor.model";

export interface MakeupArtistI{
    id?: number | null
    name: string
    description: string
    contact_number: string
    email: string
    start_price: number
    end_price: number
    speciality: string[]
    location: string
    insta_link?: string
    fb_link?: string
    start_working_hours: Date[]
    end_working_hours: Date[]
    photo_ids?: number[]
    approved?: boolean
    services?: MakeupArtistService[]
    vendor_id: number
}

@Table({
    timestamps: true,
    tableName: "makeup_artist"
})
class MakeupArtist extends Model<MakeupArtist> implements MakeupArtistI{
    
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
    @Column
    description!: string;

    @AllowNull(false)
    @NotEmpty
    @Column
    contact_number!: string;

    @AllowNull(false)
    @NotEmpty
    @Column
    email!: string;

    @AllowNull(false)
    @NotEmpty
    @Column
    start_price!: number;

    @AllowNull(false)
    @NotEmpty
    @Column
    end_price!: number;


    @AllowNull(false)
    @NotEmpty
    @Column(DataType.ARRAY(DataType.STRING))
    speciality!: string[];

    @AllowNull(false)
    @NotEmpty
    @Column
    location!: string;

    @Column
    insta_link?: string;

    @Column
    fb_link?: string;

    @AllowNull(false)
    @NotEmpty
    @Column(DataType.ARRAY(DataType.TIME))
    start_working_hours!: Date[];

    @AllowNull(false)
    @NotEmpty
    @Column(DataType.ARRAY(DataType.TIME))
    end_working_hours!: Date[];

    @AllowNull(false)
    @NotEmpty
    @Default(false)
    @Column
    approved?: boolean

    @ForeignKey(() => Photo)
    @Column(DataType.ARRAY(DataType.INTEGER))
    photo_ids?: number[];

    @ForeignKey(() => Vendor)
    @Column
    vendor_id!: number
    
    @BelongsToMany(() => Event, () => EventMakeupArtist)
    events?: Array<Event & {EventMakeupArtist: EventMakeupArtist}>

    @HasMany(() => MakeupArtistService)
    services?: MakeupArtistService[]

}

export default MakeupArtist