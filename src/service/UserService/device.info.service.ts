import UserMobileInfo from "../../models/userMobileInfo.model";
import User from "../../models/user.model";
import {
    Router,
    Request,
    Response
} from "express";
import CONFIG from "../../config";
import BaseService from "./base.service";

export default class DeviceInfoService extends BaseService {
    constructor() {
        super(UserMobileInfo)
    }

    // Store Device Info
    addDeviceInfo = async (req: Request, res: Response) => {
        try {
            const dInfo = req.body
            if (!dInfo.user_id) return res.status(400).send({
                message: "Provide User ID"
            })

            const user = await User.findOne({
                _id: dInfo.user_id
            })
            if (!user) return res.status(400).send({
                message: "User not Found"
            })

            await UserMobileInfo.create(dInfo)
            res.status(201).send({
                user_id: dInfo.user_id
            })
        } catch (e) {
            res.status(500).send({
                message: `${CONFIG.RES_ERROR} ${e.message}`
            })
        }
    }
}