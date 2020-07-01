import { Router } from "express";
import SalonInfoService from "../../service/UserService/salon.service";
const ss = new SalonInfoService();

const salonInfoRouter = Router();
// get salon info by id
salonInfoRouter.get("/info/:id", ss.getSalonInfo);
// get names of  all salons
salonInfoRouter.get("/names", ss.getSalonNames);

//salonInfoRouter.get("/services", ss.getServiceNames);
//get nearby salon range 2km
salonInfoRouter.get("/location",ss.getSalonNearby)
//sort by distance
salonInfoRouter.get("/distance",ss.getSalonDistance)
// search by service
salonInfoRouter.get("/salon/services", ss.getSalonService);
export default salonInfoRouter;
