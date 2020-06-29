import { Router } from "express";
import SalonInfoService from "../../service/UserService/salon.service";
const ss = new SalonInfoService();

const salonInfoRouter = Router();

salonInfoRouter.get("/:id", ss.getSalonInfo);

export default salonInfoRouter;
