import { Table, Model, AutoIncrement, PrimaryKey, Column, AllowNull, NotEmpty, DataType, Default, ForeignKey, HasMany, BelongsTo, BelongsToMany } from "sequelize-typescript";
import Photo from "./photo.model";
import SalonService from "./salonService.model";
import Vendor from "./vendor.model";

export interface SalonI{
    id?: number | null
    name: string
    description: string
    contact_number: string
    email: string
    start_price: number
    end_price: number
    outfit_types: string[]
    speciality: number
    location: string
    insta_link?: string
    fb_link?: string
    start_working_hours: Date
    end_working_hours: Date
    photo_ids?: number[]
    approved?: boolean
    services?: Salon[]
    vendor_id: number
}

@Table({
    timestamps: true,
    tableName: "salon"
})
class Salon extends Model<Salon> implements SalonI{
    
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
    outfit_types!: string[];

    @AllowNull(false)
    @NotEmpty
    @Column
    speciality!: number;

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
    @Column
    start_working_hours!: Date;

    @AllowNull(false)
    @NotEmpty
    @Column
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

    @HasMany(() => SalonService)
    services?: Salon[]

}

export default Salon