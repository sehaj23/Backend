// import DeviceInfo from '../../models/deviceInfo.model'
// import User from '../../models/user.model'
// import { Router, Request, Response } from 'express'
// import CONFIG from '../../config'
// import BaseService from './base.service'

// export default class DeviceInfoService extends BaseService {
//   constructor() {
//     super(DeviceInfo)
//   }

//   // Store Device Info
//   addDeviceInfo = async (req: Request, res: Response) => {
//     try {
//       const dInfo = req.body
//       await DeviceInfo.create(dInfo)
//       res.status(201).send({
//         user_id: dInfo.user_id,
//       })
//     } catch (e) {
//       res.status(500).send({
//         message: `${CONFIG.RES_ERROR} ${e.message}`,
//       })
//     }
//   }
// }
