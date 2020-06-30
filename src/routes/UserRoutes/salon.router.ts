import { Router } from "express";
import SalonInfoService from "../../service/UserService/salon.service";
const ss = new SalonInfoService();

const salonInfoRouter = Router();
// get salon info by id
salonInfoRouter.get("/info/:id", ss.getSalonInfo);
//get nearby salon range 2km
salonInfoRouter.get("/location",ss.getSalonNearby)

export default salonInfoRouter;
