import { Router } from 'express'
import DeviceInfo from '../../models/deviceInfo.model'
import { deviceInfoChecks } from '../../validators/deviceInfo-validator'
import mySchemaValidator from '../../middleware/my-schema-validator'
import DeviceInfoService from '../../service/device-info.service'
import DeviceInfoController from '../../controller/device-info.controller'

const deviceInfoRouter = Router()
const deviceInfoService = new DeviceInfoService(DeviceInfo)
const deviceInfoController = new DeviceInfoController(deviceInfoService)

// @ts-ignore
deviceInfoRouter.post(
  '/',
  [deviceInfoChecks, mySchemaValidator],
  deviceInfoController.saveDeviceInfo
)

export default deviceInfoRouter
