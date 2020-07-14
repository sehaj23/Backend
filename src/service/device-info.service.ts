import DeviceInfo from '../models/deviceInfo.model'
import User from '../models/user.model'
import BaseService from '../service/base.service'

export default class AdminService extends BaseService {
  post = async (deviceInfo: any) => {
    const user = await User.findById(deviceInfo.user_id)
    if (!user) return { message: 'User not Found' }
    return await DeviceInfo.create(deviceInfo)
  }
}
