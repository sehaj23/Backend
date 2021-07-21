import mongoose from "../database";
import { LinkDeviceSI } from "../interfaces/link-device.interface";




const LinkDeviceSchema = new mongoose.Schema({
    name:{
        type:String,
        default:"devices"
    },
   ios:{
       type:Number,
       default:0
   },
   android:{
       type:Number,
       default:0
   }
}, {
    timestamps: true
})


const Linkdevice = mongoose.model<LinkDeviceSI>("link-devices", LinkDeviceSchema)

export default Linkdevice