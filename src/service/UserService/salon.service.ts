import Salon from '../../models/salon.model'
import { Request, Response } from 'express'
import CONFIG from '../../config'
import BaseService from './base.service'
import { arePointsNear, compare } from '../../utils/location'
import { SalonRedis } from '../../redis/index.redis'

export default class SalonInfoService extends BaseService {
  constructor() {
    super(Salon)
  }

  // Salon Info
  getSalonInfo = async (req: Request, res: Response) => {
    try {
      const salonId = req.params.id

      // if (!salonId) return res.status(400).send({ message: 'Id not provided' })
      // const sr: string = await SalonRedis.get(salonId)
      // if (sr !== null) return res.send(JSON.parse(sr))
      // const salon = await Salon.findById(salonId)
      // if (!salon) return res.status(404).send({ message: 'Salon not found' })
      // SalonRedis.set(salonId, salon)

      const salon = await Salon.findById(salonId)
      res.status(200).send(salon)
      SalonRedis.set(salonId, salon)
    } catch (e) {
      res.status(500).send({
        message: `${CONFIG.RES_ERROR} ${e.message}`,
      })
    }
  }

  // Salon names
  getSalonNames = async (req: Request, res: Response) => {
    try {
      const data = new Array()
      let salons
      const sr = await SalonRedis.get('Salons')
      if (sr !== null) salons = JSON.parse(sr)
      else {
        salons = await Salon.find()
        SalonRedis.set('Salons', salons)
      }
      //@ts-ignore
      for (let [key, value] of Object.entries(salons)) data.push(value.name)
      res.status(200).send(data)
    } catch (e) {
      res.status(500).send({
        message: `${CONFIG.RES_ERROR} ${e.message}`,
      })
    }
  }

  // Sort salon : rating-wise
  getSalonsRw = async (req: Request, res: Response) => {
    try {
      const rating = req.query.rating
      if (rating !== 'asc' && rating !== 'dsc')
        return res.status(400).send({ message: 'Send valid sorting order' })
      const data = new Array()
      let salons
      const sr = await SalonRedis.get('Salons')
      if (sr !== null) salons = JSON.parse(sr)
      else {
        salons = await Salon.find({})
        SalonRedis.set('Salons', salons)
      }
      const val1 = rating === 'asc' ? -1 : 1
      const val2 = -val1
      for (let [key, value] of Object.entries(salons)) data.push(value)
      data.sort((a, b) => (a.rating < b.rating ? val1 : val2))
      res.status(200).send(data)
    } catch (e) {
      res.status(500).send({
        message: `${CONFIG.RES_ERROR} ${e.message}`,
      })
    }
  }

  // Search by salon/location/service
  getSearchResult = async (req: Request, res: Response) => {
    try {
      const phrase = req.query.phrase
      if (!phrase)
        return res.status(400).send({ message: 'Provide search phrase' })
      const data = await Salon.find(
        { $text: { $search: phrase } },
        { score: { $meta: 'textScore' } }
      ).sort({ score: { $meta: 'textScore' } })
      res.status(200).send(data)
    } catch (e) {
      res.status(500).send({
        message: `${CONFIG.RES_ERROR} ${e.message}`,
      })
    }
  }

  //get Salons nearby
  getSalonNearby = async (req: Request, res: Response) => {
    try {
      //git TODO: store location of User
      var centerPoint = {}
      var checkPoint = {}
      var salonLocation = new Array()
      //@ts-ignore
      centerPoint.lat = req.query.latitude
      //@ts-ignore
      centerPoint.lng = req.query.longitude
      const km = req.query.km || 2

      let salon
      const sr = await SalonRedis.get('Salons')
      if (sr !== null) salon = JSON.parse(sr)
      else {
        salon = await Salon.find()
        SalonRedis.set('Salons', salon)
      }

      for (var a = 0; a < salon.length; a++) {
        if (salon[a].longitude != null && salon[a].latitude != null) {
          //@ts-ignore
          checkPoint.lng = salon[a].longitude
          //@ts-ignore
          checkPoint.lat = salon[a].latitude
          var n = await arePointsNear(checkPoint, centerPoint, km)
          if (n.bool) {
            salonLocation.push(salon[a])
          }
        }
      }
      res.send(salonLocation)
    } catch (error) {
      res.status(500).send({
        message: `${CONFIG.RES_ERROR} ${error.message}`,
      })
    }
  }
  //get salon distancewise
  getSalonDistance = async (req: Request, res: Response) => {
    try {
      //git TODO: store location of User
      var centerPoint = {}
      var checkPoint = {}
      var salonLocation = new Array()

      //@ts-ignore
      centerPoint.lat = req.query.latitude
      //@ts-ignore
      centerPoint.lng = req.query.longitude
      const km = req.query.km || 2
      const salon = await Salon.find({}).lean()
      for (var a = 0; a < salon.length; a++) {
        if (salon[a].longitude != null && salon[a].latitude != null) {
          //@ts-ignore
          checkPoint.lng = salon[a].longitude
          //@ts-ignore
          checkPoint.lat = salon[a].latitude
          var n = await arePointsNear(checkPoint, centerPoint, km)
          if (n.bool) {
            const s = salon[a]
            // @ts-ignore
            s.difference = n.difference
            salon[a] = s
            //@ts-ignore
            salonLocation.push(salon[a])
          }
        }
      }
      salonLocation.sort((a, b) => {
        if (a.difference < b.difference) return -1
        else if (a.difference > b.difference) return 1
        return 0
      })
      res.send(salonLocation)
    } catch (error) {
      res.status(500).send({
        message: `${CONFIG.RES_ERROR} ${error.message}`,
      })
    }
  }
}
