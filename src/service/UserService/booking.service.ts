import Salon from '../../models/salon.model'
import Service from '../../models/service.model'
import Booking from '../../models/booking.model'
import Employee from '../../models/employees.model'
import { Request, Response } from 'express'
import CONFIG from '../../config'
import BaseService from './base.service'
import { BookingI } from '../../interfaces/booking.interface'
import { EmployeeI } from '../../interfaces/employee.interface'
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript'
//import { INTEGER } from 'sequelize/types'
import * as moment from 'moment'

export default class bookingService extends BaseService {
  constructor() {
    super(Booking)
  }


  // Create a booking
  postBooking = async (req: Request, res: Response) => {
    try {
      const data: BookingI = req.body
      const booking = await Booking.create(data)

      res.status(201).send(booking)
    } catch (e) {
      res.status(500).send({
        message: `${CONFIG.RES_ERROR} ${e.message}`,
      })
    }
  }

  // Available employees
  getAvailableEmp = async (req: Request, res: Response) => {
    try {
      const { date, time, salon_id, services } = req.body

      if (!date || !time || !salon_id || !services)
        return res
          .status(400)
          .send({ message: 'Provide Date, Time, Salon ID and Services' })

      const bookings = await Booking.find({ salon_id })
      const rDT = moment(date + ' ' + time).add(5.5, 'hours')

      bookings.forEach((x) => {
        console.log(x.date_time)
        x.services.forEach((y) => {
          console.log(y.service_name)
        })
      })

      // services.forEach(x => {
      //   console.log(x.service_id)
      // });

      // const one = await Booking.findById("5eff28836bb95b05c0fcc4a9")
      // const dbDT = moment(one.date_time)

      res.status(200).send()
    } catch (e) {
      res.status(500).send({
        message: `${CONFIG.RES_ERROR} ${e.message}`,
      })
    }
  }
}
