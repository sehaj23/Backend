import { Router } from "express"
import BookingController from "../../controller/booking.controller"
import UserverifyToken from "../../middleware/User.jwt"
import Booking from "../../models/booking.model"
import Brand from "../../models/brands.model"
import Cart from "../../models/cart.model"
import Cashbackuser from "../../models/cashback.model"
import Cashbackrange from "../../models/cashbackRange.model"
import EmployeeAbsenteeism from "../../models/employeeAbsenteeism.model"
import Employee from "../../models/employees.model"
import Event from "../../models/event.model"
import Explore from "../../models/explore.model"
import Feedback from "../../models/feedback.model"
import FilterHome from "../../models/filterHome.model"
import MongoCounter from "../../models/mongo-counter.model"
import Offer from "../../models/offer.model"
import PromoCode from "../../models/promo-code.model"
import PromoUserCode from "../../models/promo-user.model"
import Referral from "../../models/referral.model"
import Refund from "../../models/refund.model"
import ReportSalon from "../../models/reportSalon.model"
import ReportVendor from "../../models/reportVendor.model"
import Review from "../../models/review.model"
import Salon from "../../models/salon.model"
import User from "../../models/user.model"
import Vendor from "../../models/vendor.model"
import WalletTransaction from "../../models/wallet-transaction.model"
import BookingService from "../../service/booking.service"
import CartService from "../../service/cart.service"
import CashbackRangeService from "../../service/cashback-range.service"
import CashbackService from "../../service/cashback.service"
import EmployeeAbsenteesmService from "../../service/employee-absentism.service"
import EmployeeService from "../../service/employee.service"
import FeedbackService from "../../service/feedback.service"
import MongoCounterService from "../../service/mongo-counter.service"
import PromoCodeService from "../../service/promo-code.service"
import PromoUserService from "../../service/promo-user.service"
import ReferralService from "../../service/referral.service"
import RefundService from "../../service/refund.service"
import SalonService from "../../service/salon.service"
import UserService from "../../service/user.service"
import VendorService from "../../service/vendor.service"
import WalletTransactionService from "../../service/wallet-transaction.service"
import { BookingValidator } from "../../validators/booking.validator"


const cartService = new CartService(Cart, Salon,Explore)
const feedbackService = new FeedbackService(Feedback)
const mongoCounterService = new MongoCounterService(MongoCounter)
const referralService = new ReferralService(Referral)
const userService = new UserService(User, Booking)
const walletTransactionService: WalletTransactionService = new WalletTransactionService(WalletTransaction, userService)
const bookingService = new BookingService(Booking, Salon, cartService, mongoCounterService, Referral, walletTransactionService)
const salonService = new SalonService(Salon, Employee, Vendor, Event, Offer, Review, Booking, Brand, FilterHome, ReportSalon)
const employeeService = new EmployeeService(Employee, EmployeeAbsenteeism, Salon, Feedback, ReportVendor, Booking)
const empAbsenteesimService = new EmployeeAbsenteesmService(EmployeeAbsenteeism)
const vendorService = new VendorService(Vendor, EmployeeAbsenteeism, ReportVendor, Feedback)
const promoUserService = new PromoUserService(PromoUserCode)
const promoCodeService = new PromoCodeService(PromoCode)
const cashbackRangeService =  new CashbackRangeService(Cashbackrange)
const refundService = new RefundService(Refund, bookingService, walletTransactionService)
const cashbackService =  new CashbackService(Cashbackuser)
const bc = new BookingController(bookingService, salonService, empAbsenteesimService, cartService, feedbackService, userService, employeeService, vendorService, promoUserService, referralService, refundService, promoCodeService, walletTransactionService,cashbackRangeService,cashbackService)

const bookingRouter = Router()

// get available employees by date & time
bookingRouter.get("/", UserverifyToken, bc.getAppointment)
bookingRouter.get("/home-page",UserverifyToken,bc.getHomePageData)
bookingRouter.get("/:id", UserverifyToken, bc.getId)
bookingRouter.get("/online/cancelled", UserverifyToken, bc.getOnlineCancelledBookings)
bookingRouter.post("/check-cod/", UserverifyToken, bc.checkCod)
bookingRouter.get("/razorpay-orderid/:id", UserverifyToken, bc.getRazorpayOrderId)
bookingRouter.post("/razorpay-verify-payment/:bookingId", [...BookingValidator.verifyRazorPayPayment, UserverifyToken], bc.verifyRazorPayPayment)
bookingRouter.patch("/update-status/:id", UserverifyToken, bc.updateStatusBookings)
bookingRouter.post("/complete/:id",UserverifyToken, bc.completeBooking)
bookingRouter.patch("/rescheduled/:id", UserverifyToken, bc.confirmRescheduleSlot)
// create a booking
bookingRouter.post("/", UserverifyToken, bc.bookAppointment)
bookingRouter.post("/employees/:salonId", UserverifyToken, bc.getSalonEmployees)

bookingRouter.patch("/cancel/:bookingId", UserverifyToken, bc.cancelBooking)
bookingRouter.post("/feedback/:id", UserverifyToken, bc.bookingFeedback)
bookingRouter.post("/book-again", UserverifyToken, bc.bookAgain)
bookingRouter.post("/employee-service", UserverifyToken, bc.getEmployeebyService)


export default bookingRouter
