import mongoose from "../database";

const deviceInfoSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "users"
    }
}, {
    timestamps: true,
    strict: false
})

const DeviceInfo = mongoose.model('device_info', deviceInfoSchema)

export default DeviceInfo