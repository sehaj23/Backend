import Salon from '../../models/salon.model'
import Service from '../../models/service.model'
import Booking from '../../models/booking.model'
import Employee from '../../models/employees.model'
import { Request, Response } from 'express'
import CONFIG from '../../config'
import BaseService from './base.service'
import {BookingI} from '../../interfaces/booking.interface'
import {EmployeeI} from '../../interfaces/employee.interface'
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript'
const toDate = require('normalize-date');


export default class bookingService extends BaseService {
  constructor() {
    super(Booking)
  }

  createEmployee = async (req: Request, res: Response) => {
    try {
        const v: EmployeeI = req.body
        if (!v.name || !v.phone) res.status(400).send({ message: "Incomplete data" })
        const emp = await Employee.create(v)
        res.status(201).send(emp)
    } catch (e) {
        res.status(500).send({ message: "Unable to create Employee" })
    }
}

// TODO: Clarify about the date format

  // Create a booking
  postBooking = async (req: Request, res: Response) => {
    try {
        const data : BookingI = req.body
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
        const dateTime: Date = req.query.dateTime
        if(!dateTime) return res.status(400).send({message: 'Provide Date and Time'})
        const booking = await Booking.find()

        const obj = toDate(dateTime)
        console.log(obj)

      res.status(200).send(obj)
    } catch (e) {
      res.status(500).send({
        message: `${CONFIG.RES_ERROR} ${e.message}`,
      })
    }
  }

}
