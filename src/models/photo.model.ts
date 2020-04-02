

import { Table, Model, AutoIncrement, PrimaryKey, Column, AllowNull, NotEmpty, DataType, Default } from "sequelize-typescript";

type PhotoType = 'Original' | 'ToShow'

export interface PhotoI{
    id?: number | null
    name: string
    url: string
    photo_type: PhotoType
    tags: string[]
    approved?: boolean
}

@Table({
    timestamps: true,
    tableName: "photo"
})
class Photo extends Model<Photo> implements PhotoI{
    
 
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
    url!: string;

    @AllowNull(false)
    @NotEmpty
    @Default('Original')
    @Column(DataType.ENUM('Original' , 'ToShow'))
    photo_type!: PhotoType;

    @AllowNull(false)
    @NotEmpty
    @Column(DataType.ARRAY(DataType.STRING))
    tags!: string[];

    @AllowNull(false)
    @NotEmpty
    @Default(false)
    @Column
    approved?: boolean
}

export default Photo