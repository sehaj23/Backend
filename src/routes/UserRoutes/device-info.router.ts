import { Router } from 'express'
import DeviceInfoService from '../../service/UserService/device.info.service'
import { deviceInfoChecks } from '../../validators/deviceInfo-validator'
import mySchemaValidator from '../../middleware/my-schema-validator'

const deviceInfoRouter = Router()
const dis = new DeviceInfoService()

// @ts-ignore
deviceInfoRouter.post(
  '/',
  [deviceInfoChecks, mySchemaValidator],
  dis.addDeviceInfo
)

// TEMP: to be removed
deviceInfoRouter.get('/redisclr', dis.clearRedis)

export default deviceInfoRouter
