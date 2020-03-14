import { Table, Model, AutoIncrement, PrimaryKey, Column, AllowNull, NotEmpty, DataType, Default, HasMany } from "sequelize-typescript";


type Provider = 'MUA' | 'Salon' | 'Designer'
type BookinStatus = 'Requested' | 'Confirmed' | 'Vendor Cancelled' | 'Customer Cancelled' | 'Completed'
type BookingPaymentType = 'COD' | 'Online'
type BookingLoaction = 'Customer Place' | 'Vendor Place'

export interface BookingI{
    id?: number | null
    user_id: number
    provider_id: number // it can be anything MUA, Designer, Salon
    service_id: number
    provider_type: Provider
    status: BookinStatus
    price: number
    payment_type: BookingPaymentType
    balance?: number
    time: Date
    location: BookingLoaction
}

@Table({
    timestamps: true,
    tableName: "booking"
})
class Booking extends Model<Booking> implements BookingI{
    
 
    @AutoIncrement
    @PrimaryKey
    @Column
    id?: number

    
    @AllowNull(false)
    @NotEmpty
    @Column
    user_id!: number

    @AllowNull(false)
    @NotEmpty
    @Column
    provider_id!: number

    @AllowNull(false)
    @NotEmpty
    @Column
    service_id!: number

    @AllowNull(false)
    @NotEmpty
    @Default('MUA')
    @Column(DataType.ENUM('MUA' , 'Salon' , 'Designer'))
    provider_type!: Provider

    
    @AllowNull(false)
    @NotEmpty
    @Default('Requested')
    @Column(DataType.ENUM('Requested' , 'Confirmed' , 'Vendor Cancelled' , 'Customer Cancelled' , 'Completed'))
    status!: BookinStatus


    @AllowNull(false)
    @NotEmpty
    @Column
    price!: number

    @AllowNull(false)
    @NotEmpty
    @Default('COD')
    @Column(DataType.ENUM('COD' , 'Online'))
    payment_type!: BookingPaymentType

    @AllowNull(false)
    @Default(0)
    @NotEmpty
    @Column
    balance?: number

    @AllowNull(false)
    @NotEmpty
    @Column
    time!: Date

    @AllowNull(false)
    @NotEmpty
    @Column
    location!: BookingLoaction
}

export default Booking