// import { Router } from "express";
// import VendorverifyToken from "../../middleware/VendorJwt";
// import BookinkService from "../../service/booking.service";
// import BookingController from "../../controller/booking.controller";
// import Booking from "../../models/booking.model";
// import EmployeeverifyToken from "../../middleware/Employee.jwt";
// import Salon from "../../models/salon.model";


// const bookingRouter = Router()
// const bookingService = new BookinkService(Booking,Salon)
// const bookingController = new BookingController(bookingService)


// bookingRouter.get("/",VendorverifyToken,bookingController.getbookings)
// bookingRouter.get("/reschedule/:id",VendorverifyToken,bookingController.rescheduleSlots)
// bookingRouter.patch("/reschedule/:id",VendorverifyToken,bookingController.reschedulebooking)
// bookingRouter.patch("/updatestatus/:id",VendorverifyToken,bookingController.updateStatusBookings)
// bookingRouter.get("/status",VendorverifyToken,bookingController.bookingStatus)


// //employee
// bookingRouter.get("/employee",EmployeeverifyToken,bookingController.getEmployeebookings) //salon id required
// bookingRouter.patch("/employee/updatestatus/:id",EmployeeverifyToken,bookingController.updateStatusBookings) //booking id required
// bookingRouter.get("/employee/reschedule/:id",EmployeeverifyToken,bookingController.rescheduleSlots)
// bookingRouter.patch("/employee/reschedule/:id",EmployeeverifyToken,bookingController.reschedulebooking)
// //bookingRouter.get("/employee/booking",EmployeeverifyToken,bs.getEmployeebookings)




// export default bookingRouter