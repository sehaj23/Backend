// import { Router } from "express";
// import verifyToken from "../../middleware/jwt";

// import BookinkService from "../../service/booking.service";
// import Booking from "../../models/booking.model"
// import BookingController from "../../controller/booking.controller";
// import Salon from "../../models/salon.model";
// import SalonService from "../../service/salon.service";
// import EmployeeAbsentismService from "../../service/employee-absentism.service";

// const bookingRouter = Router()
// const bookingService = new BookinkService(Booking,Salon)
// const bookingController = new BookingController(bookingService,SalonService,EmployeeAbsentismService)

// bookingRouter.post("/", verifyToken, bookingController.post)
// bookingRouter.get("/", verifyToken, bookingController.get)
// bookingRouter.get("/:id", verifyToken, bookingController.getId)
// bookingRouter.put("/:id", verifyToken, bookingController.put)
// bookingRouter.post("/salon-emp/:salonId", bookingController.getSalonEmployees)


// export default bookingRouter
