import { Router } from "express";
import SalonInfoService from "../../service/UserService/salon.service";
const ss = new SalonInfoService();

const salonInfoRouter = Router();
// get salon info by id
salonInfoRouter.get("/info/:id", ss.getSalonInfo);
// get names of  all salons
salonInfoRouter.get("/names", ss.getSalonNames);
// get names of  services
salonInfoRouter.get("/services", ss.getSalonService);
//get nearby salon range 2km
salonInfoRouter.get("/location",ss.getSalonNearby)
//sort by distance
salonInfoRouter.get("/distance",ss.getSalonDistance)

export default salonInfoRouter;
