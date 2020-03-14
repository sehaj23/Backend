import { Table, Model, AutoIncrement, PrimaryKey, Column, AllowNull, NotEmpty, DataType, Default, HasMany } from "sequelize-typescript";
import Designer from "./designers.model";
import MakeupArtist from "./makeupArtist.model";
import Salon from "./salon.model";


export interface VendorI{
    id?: number | null
    name: string
    email: string
    password: string
    contant_number: string
    premium?: boolean
}

@Table({
    timestamps: true,
    tableName: "venodr"
})
class Vendor extends Model<Vendor> implements VendorI{
    
 
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
    email!: string;

    @AllowNull(false)
    @NotEmpty
    @Column
    password!: string

    @AllowNull(false)
    @NotEmpty
    @Column
    contant_number!: string

    @AllowNull(false)
    @Default(false)
    @Column
    premium?: boolean

    @HasMany(() => Designer)
    designers?: Designer[]

    @HasMany(() => MakeupArtist)
    makeupArtis?: MakeupArtist[]

    @HasMany(() => Salon)
    designer?: Salon[]
    
}

export default Vendor