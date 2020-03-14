import { Table, Model, AutoIncrement, PrimaryKey, Column, AllowNull, NotEmpty, DataType } from "sequelize-typescript";

export interface AdminI{
    id?: number | null
    username: string
    password: string
    role: string
}

@Table({
    timestamps: true,
    tableName: "admin"
})
class Admin extends Model<Admin> implements AdminI{
    @AutoIncrement
    @PrimaryKey
    @Column
    id?: number

    @AllowNull(false)
    @NotEmpty
    @Column
    username!: string;
    
    @AllowNull(false)
    @NotEmpty
    @Column
    password!: string;

    @AllowNull(false)
    @NotEmpty
    @Column
    role!: string;
}

export default Admin