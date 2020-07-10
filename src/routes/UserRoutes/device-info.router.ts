import {
    Router
} from "express";
import DeviceInfoService from "../../service/UserService/device.info.service";
import UserverifyToken from "../../middleware/User.jwt";
const dis = new DeviceInfoService()

const deviceInfoRouter = Router()

deviceInfoRouter.post("/", dis.addDeviceInfo)

export default deviceInfoRouter