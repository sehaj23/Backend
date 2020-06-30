import Salon from "../../models/salon.model";
import { Request, Response } from "express";
import CONFIG from "../../config";
import BaseService from "./base.service";

export default class SalonInfoService extends BaseService {
  constructor() {
    super(Salon);
  }

  // Search by salon name
  getSalonInfo = async (req: Request, res: Response) => {
    try {
      const salonId = req.params.id;
      if (!salonId)
        return res.status(400).send({
          message: "Id not provided",
        });
      const salon = await Salon.findById(salonId);
      if (!salon)
        return res.status(404).send({
          message: "Salon not found",
        });
      res.status(200).send(salon);
    } catch (e) {
      res.status(500).send({
        message: `${CONFIG.RES_ERROR} ${e.message}`,
      });
    }
  }
}
