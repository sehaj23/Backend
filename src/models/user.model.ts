import mongoose from "../database";
import { UserSI } from "../interfaces/user.interface";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
<<<<<<< HEAD

=======
>>>>>>> d0de01cce02c14b8b1ee8ded94cc94c8c55c2366
    },
    email: {
        type: String,
        index: true
    },
    password: {
        type: String,

    },
    signin_from: {
        type: String,
        default: "Normal"
    },
    profile_pic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "photos"
    },
    phone: {
        type: String,

    },
    uid: {
        type: String,
    },
    age: {
        type: String,
    },
    gender: {
        type: String,
    },
    color_complextion: {
        type: String,
    },
    blocked: {
        type: Boolean,
        default: false
    },
    approved: {
        type: Boolean,
        default: false
    },
    favourites: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "salons"
        }]
    },
    fcm_token: {
        type: [String]
    },
    delete_request: {
        type: Date
    },
    notification: {
        type: Boolean,
        default: true
    },
    referral_code: {
        type: String
    },
    address: {
        type: [{
            address: {
                type: String,
                required: true
            },
            city: {
                type: String,
                required: true
            },
            state: {
                type: String,
                // enum:["Andra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jammu and Kashmir","Jharkhand","Karnataka","Kerala","Madya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Orissa","Punjab","Rajasthan","Sikkim","Tamil Nadu","Tripura","Uttaranchal","Uttar Pradesh","West Bengal","Andaman and Nicobar Islands","Chandigarh","Daman and Diu","Delhi","Lakshadeep","Pondicherry"],
                // enum:["Delhi","DL"]
                required: true
            },
            pincode: {
                type: Number,
                required: true
            },
            latitude: {
                type: Number,
            },
            longitude: {
                type: Number,
            },
            tag: {
                type: String,
            },

        }]
    },
    balance: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
})
UserSchema.index({ "$**": `text` });
UserSchema.pre<UserSI>('save', () => {
    //@ts-ignore
    let { name } = this
    if (name) {
        name = name.split(" ").map((l: string) => l[0].toUpperCase() + l.substr(1)).join(" ")
    }
})

const User = mongoose.model<UserSI>("users", UserSchema)

export default User