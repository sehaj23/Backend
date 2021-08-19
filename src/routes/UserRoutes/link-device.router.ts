

import { Router } from "express"
import LinkDeviceController from "../../controller/link-device.controller"
import Linkdevice from "../../models/link-device.model"
import LinkDeviceService from "../../service/link-device.service"



const linkdeviceRouter = Router()
const linkdeviceService = new LinkDeviceService(Linkdevice)
const linkdeviceController = new LinkDeviceController(linkdeviceService)



linkdeviceRouter.post("/add",linkdeviceController.addCount)


export default linkdeviceRouter