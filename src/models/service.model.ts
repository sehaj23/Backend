// import mongoose from "../database";
// import { ServiceSI } from "../interfaces/service.interface";


// const ServiceSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true
//     },
//     price: {
//         type: Number,
//         required: true,
//         min: 0
//     },
//     duration:{
//         type: Number,
//         default: 15,
//         required: true,
//         min: 15
//     },
//     gender:{
//         type:String,
//         enum:["men","women"],
//         required:true
//     },
//     photo: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "photos"
//     },
//     salon_id: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "salons"
//     },
//     mua_id: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "makeup_artists"
//     },
//     offers: {
//         type: [{
//             type: mongoose.Schema.Types.ObjectId,
//              ref: "offers"
//         }]
//     }
// })

// // Text index for search
// ServiceSchema.index({ name: 'text' });

// const Service = mongoose.model<ServiceSI>("services", ServiceSchema)

// export default Service