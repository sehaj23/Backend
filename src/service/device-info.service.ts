import DeviceInfo from '../models/deviceInfo.model'
import BaseService from '../service/base.service'

export default class DeviceInfoService extends BaseService {
  post = async (deviceInfo: any) => await DeviceInfo.create(deviceInfo)
}
