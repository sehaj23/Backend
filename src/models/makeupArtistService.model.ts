
import { Table, Model, AutoIncrement, PrimaryKey, Column, AllowNull, NotEmpty, DataType, Default, ForeignKey } from "sequelize-typescript";
import MakeupArtist from "./makeupArtist.model";


export interface MakeupArtistServiceI{
    id?: number | null
    name: string
    price: number
    photo_url?: string
    makeup_artist_id: number
}

@Table({
    timestamps: true,
    tableName: "makeup_artist_service"
})
class MakeupArtistService extends Model<MakeupArtistService> implements MakeupArtistServiceI{
    
 
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

    @ForeignKey(() => MakeupArtist)
    @Column
    makeup_artist_id!: number
}

export default MakeupArtistService