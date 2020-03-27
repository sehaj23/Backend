import { Table, Model, AutoIncrement, PrimaryKey, Column, AllowNull, NotEmpty, DataType, Default, ForeignKey, HasMany, BelongsTo, BelongsToMany } from "sequelize-typescript";
import Photo from "./photo.model";
import Event from "./event.model";
import EventDesigner from "./eventDesigner.model";
import Vendor from "./vendor.model";

export interface DesignersI{
    id?: number | null
    brand_name: string
    designer_name: string
    contact_number: string
    email: string
    start_price: number
    end_price: number
    outfit_types: string[]
    speciality: string
    location: string
    insta_link?: string
    fb_link?: string
    start_working_hours: Date
    end_working_hours: Date
    photo_ids?: number[]
    approved?: boolean
    vendor_id: number
    events?: Event[]
}

@Table({
    timestamps: true,
    tableName: "designer"
})
class Designer extends Model<Designer> implements DesignersI{
    
    @AutoIncrement
    @PrimaryKey
    @Column
    id?: number

    @AllowNull(false)
    @NotEmpty
    @Column
    brand_name!: string; 
    
    @AllowNull(false)
    @NotEmpty
    @Column
    designer_name!: string;

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
    outfit_types!: string[];

    @AllowNull(false)
    @NotEmpty
    @Column
    speciality!: string;

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
    @Column(DataType.TIME)
    start_working_hours!: Date;

    @AllowNull(false)
    @NotEmpty
    @Column(DataType.TIME)
    end_working_hours!: Date;

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

    @BelongsToMany(() => Event, () => EventDesigner)
    events?: Array<Event & {EventDesigner: EventDesigner}>

}

export default Designer