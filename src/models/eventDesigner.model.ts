import { Table, Model, AutoIncrement, PrimaryKey, Column, AllowNull, NotEmpty, DataType, Default, BelongsTo, ForeignKey } from "sequelize-typescript";
import Event from "./event.model";
import Designer from "./designers.model";

type PhotoType = 'Original' | 'ToShow'

export interface EventDesignerI{
    id?: number | null
    event_id: number
    designer_id: number
}

@Table({
    timestamps: true,
    tableName: "event_makeup_artist"
})
class EventDesigner extends Model<EventDesigner> implements EventDesignerI{
    
 
    @AutoIncrement
    @PrimaryKey
    @Column
    id?: number

    @AllowNull(false)
    @NotEmpty
    @ForeignKey(() => Event)
    @Column
    event_id!: number;


    @AllowNull(false)
    @NotEmpty
    @ForeignKey(() => Designer)
    @Column
    designer_id!: number;

}
export default EventDesigner