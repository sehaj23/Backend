
import { Table, Model, AutoIncrement, PrimaryKey, Column, AllowNull, NotEmpty, DataType, Default, ForeignKey, BelongsTo } from "sequelize-typescript";
import Salon from "./salon.model";


export interface SalonServiceI{
    id?: number | null
    name: string
    price: number
    photo_url?: string
    salon_id: number
}

@Table({
    timestamps: true,
    tableName: "salon_service"
})
class SalonService extends Model<SalonService> implements SalonServiceI{
    
 
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
    price!: number;

    @Column
    photo_url?: string;

    @ForeignKey(() => Salon)
    @Column
    salon_id!: number

}

export default SalonService