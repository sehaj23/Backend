import mongoose from "../database";



export default interface LinkDeviceI{
    ios:number,
    android:number
}

export interface LinkDeviceSI extends LinkDeviceI, mongoose.Document{}