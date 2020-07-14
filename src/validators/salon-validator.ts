import { check } from 'express-validator'
import Salon from '../models/salon.model'

export const salonInfoChecks = [
  check('id', 'Invalid Salon Id')
    .isMongoId()
    .custom(async (salonId) => {
      if (salonId) {
        return await Salon.findById(salonId).then((salon) => {
          if (!salon) return Promise.reject('Salon not found')
        })
      }
    })
]
