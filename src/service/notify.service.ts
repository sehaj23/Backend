
import moment = require("moment")
import { AdminSI } from "../interfaces/admin.interface"
import { BookingSI } from "../interfaces/booking.interface"
import EmployeeSI, { EmployeeI } from "../interfaces/employee.interface"
import SalonSI, { SalonI } from "../interfaces/salon.interface"
import UserI, { UserSI } from "../interfaces/user.interface"
import { VendorI } from "../interfaces/vendor.interface"
import Admin from "../models/admin.model"
import SendEmail from "../utils/emails/send-email"
import testEmail from "../utils/emails/test-email"
import sendNotificationToDevice from "../utils/send-notification"
import SMSCONFIG from "../utils/sms-config"
import AdminService from "./admin.service"
import BookingService from "./booking.service"
import OtpService from "./otp.service"

export default class Notify {

  //TODO: Null check for params because booking fails
  static referralComplete = async (user: UserSI, userReferred: UserSI) => {

    // TODO: Add notification data and the route
    try {
      sendNotificationToDevice(user.fcm_token, { notification: { title: "Referral Complete", body: `Congratulations! 👏 You & your friend have earned Rs. 50 each as a referral bonus for signing up` }, data: { click_action: "FLUTTER_NOTIFICATION_CLICK" } })
    } catch (error) {
      console.log(error)
    }

  }





  static bookingConfirm = async (user: UserSI, salon: SalonSI, employee: EmployeeSI, booking: BookingSI) => {

    const bookingTime = moment(booking.services[0].service_time).format('MMMM Do YYYY, h:mm a');
    try {
      const getDetails = Notify.getTotalPromo(booking)
      SendEmail.bookingConfirm(user.email, salon.name, booking._id, booking.booking_numeric_id.toString(), bookingTime, employee.name, booking.location, booking.payments, getDetails.total.toString(), getDetails.promo_code, booking.services, user.name)
    } catch (e) {
      console.log(e)
    }
    // TODO: Add notification data and the route
    try {
      sendNotificationToDevice(user.fcm_token, { notification: { title: "Booking Confirmed", body: `Your booking for ${bookingTime} has been accepted by ${salon.name}` }, data: { booking_id: (booking._id).toString(), status: "Confirmed", click_action: "FLUTTER_NOTIFICATION_CLICK" } })

    } catch (error) {
      console.log(error)
    }


    //TODO: change the text of the uszer text 
    try {
      const userText = `Your booking for ${bookingTime} has been accepted by ${salon.name}, CHEERS`
      OtpService.sendMessage(user.phone, userText, SMSCONFIG.BOOKING_ACCEPTED)
    } catch (error) {
      console.log(error)
    }
    //sending notification to admin app
    try {
      Notify.sendNotificationtoAdmin({ notification: { title: "Booking Confirmed", body: `Your booking for ${bookingTime} has been accepted by ${salon.name}` }, data: { booking_id: (booking._id).toString(), status: "Confirmed", click_action: "FLUTTER_NOTIFICATION_CLICK",type:"BOOKING"  } })
    } catch (error) {
      console.log(error)
    }


    //TODO: add other stakeholders like - salon owners, employees or admins to send message to 
    //if required
  }

  static bookingRequest = async (vendor: VendorI, employee: EmployeeI, salon: SalonI, booking: BookingSI, user: UserI) => {

    const getDetails = Notify.getTotalPromo(booking)
    const bookingTime = moment(booking.services[0].service_time).format('MMMM Do YYYY, h:mm a');
    try {

      SendEmail.bookingRequestVendor(salon.email, salon.name, booking._id, booking.booking_numeric_id.toString(), bookingTime, employee.name, booking.location, booking.payments, getDetails.total.toString(), getDetails.promo_code, booking.services, user.name, vendor.name)

    } catch (error) {
      console.log(error)
    }
    // TODO: Add notification data and the route
    try {
      sendNotificationToDevice(vendor.fcm_token, { notification: { title: "Booking Request", body: `${employee.name} has received a new booking for ${bookingTime}` }, data: { booking_id: (booking._id).toString(), status: "Requested", click_action: "FLUTTER_NOTIFICATION_CLICK" } })
    } catch (error) {
      console.log(error)
    }
    try {
      sendNotificationToDevice(employee.fcm_token, { notification: { title: "Booking Request", body: `You have received a new booking for ${bookingTime}` }, data: { booking_id: (booking._id).toString(), status: "Requested", click_action: "FLUTTER_NOTIFICATION_CLICK" } })
    } catch (error) {
      console.log(error)
    }
    try {
      Notify.sendNotificationtoAdmin({ notification: { title: "Booking Request", body: `You have received a new booking for ${bookingTime}` }, data: { booking_id: (booking._id).toString(), status: "Requested", click_action: "FLUTTER_NOTIFICATION_CLICK",type:"BOOKING" } })
    } catch (error) {
      console.log(error)
    }
    //check
    //TODO: change the text of the uszer text 
    try {
      const vendorText = `Received a new booking for ${bookingTime}`
      OtpService.sendMessage(vendor.contact_number, vendorText, SMSCONFIG.NEW_BOOKING)
    } catch (error) {
      console.log(error)
    }

    //TODO: add other stakeholders like - salon owners, employees or admins to send message to 
    //if required
  }

  static rescheduledPending = async (userPhone: string, userEmail: string, userFCM: string, salonPhone: string, salonEmail: string, salonName: string, employeePhone: string, employeeFCMs: string[], bookingId: string, bookingIdNumeric: string, dateTime: string, userName: string) => {
    try {
      SendEmail.rescheduleUser(userEmail, userName)
    } catch (error) {
      console.log(error)
    }
    // TODO: Add notification data and the route
    try {
      sendNotificationToDevice(userFCM, { notification: { title: "Booking Rescheduled", body: `To make up for the current unavailability ${salonName} has sent you new time slots, click here to open` }, data: { booking_id: bookingId, status: "Rescheduled and Pending", click_action: "FLUTTER_NOTIFICATION_CLICK" } })
    } catch (error) {

    }
    try {
      Notify.sendNotificationtoAdmin({ notification: { title: "Booking Rescheduled", body: `To make up for the current unavailability ${salonName} has sent you new time slots, click here to open` }, data: { booking_id: bookingId, status: "Rescheduled and Pending", click_action: "FLUTTER_NOTIFICATION_CLICK",type:"BOOKING" } })
    } catch (error) {
      console.log(error)
    }


    //TODO: change the text of the uszer text 
    try {
      const userText = `To make up for the current unavailability ${salonName} has sent you new time slots, click here to open`
      OtpService.sendMessage(userPhone, userText, SMSCONFIG.RESCHEDULE)
    } catch (error) {

    }
    //TODO: add other stakeholders like - salon owners, employees or admins to send message to 
    //if required
  }




  static rescheduledBooking = (vendor: VendorI, user: UserSI, booking: BookingSI, employee: EmployeeSI, salon: SalonI) => {

    const bookingTime = moment(booking.services[0].service_time).format('MMMM Do YYYY, h:mm a');
    const getDetails = Notify.getTotalPromo(booking)
    SendEmail.rescheduleVendor(salon.email, salon.name, booking._id, booking.booking_numeric_id.toString(), bookingTime, employee.name, booking.location, booking.payments, getDetails.total.toString(), getDetails.promo_code, booking.services, user.name)

    // TODO: Add notification data and the route



    try {
      sendNotificationToDevice(employee.fcm_token, { notification: { title: "Booking Reschedule Accepted", body: `The booking you rescheduled for ${bookingTime} has been accepted` }, data: { booking_id: booking._id, status: "Requested" } })
    } catch (error) {

    }

    try {
      sendNotificationToDevice(vendor.fcm_token, {
        notification: {
          title: "Booking Reschedule Accepted", body: `The rescheduled booking by ${employee.name} for ${bookingTime} has been accepted’
            `}, data: { booking_id: (booking._id).toString(), status: "Rescheduled" }
      })
    } catch (error) {

    }



    //TODO: change the text of the uszer text 
    try {
      const vendorText = `The rescheduled booking by ${employee.name} for ${bookingTime} has been accepted`
      OtpService.sendMessage(vendor.contact_number, vendorText, SMSCONFIG.RESCHEDULE_ACCEPT)


    } catch (error) {

    }
    //TODO: add other stakeholders like - salon owners, employees or admins to send message to 
    //if required
  }

  static rescheduledCancelled = (vendorPhone: string, employeeFCMs: string[], bookingId: string, employeeName: string, dateTime: string, vendorFCM: string, salonEmail: string, salonName: string, bookingIdNumeric: string) => {
    //  SendEmail.bookingConfirm(salonEmail, salonName, bookingId, bookingIdNumeric, dateTime)
    // TODO: Add notification data and the route
    try {
      sendNotificationToDevice(employeeFCMs, { notification: { title: "Booking  Cancelled", body: `The rescheduled booking has been cancelled by the user` }, data: { booking_id: bookingId, status: "Rescheduled and Cancelled" } })
      sendNotificationToDevice(vendorFCM, { notification: { title: "Booking  Cancelled", body: `The rescheduled booking has been cancelled by the user` }, data: { booking_id: bookingId, status: "Rescheduled" } })
    } catch (error) {

    }

    try {
      const vendorText = `The rescheduled booking has been cancelled by the user`
      OtpService.sendMessage(vendorPhone, vendorText, SMSCONFIG.RESCHEDULE_CANCEL)
    } catch (error) {

    }

    //TODO: change the text of the uszer text 

    //TODO: add other stakeholders like - salon owners, employees or admins to send message to 
    //if required
  }

  static serviceStart = (userPhone: string, userEmail: string, userFCM: string, salonPhone: string, salonEmail: string, salonName: string, employeePhone: string, employeeFCMs: string[], bookingId: string, bookingIdNumeric: string, dateTime: string) => {

    // TODO: Add notification data and the route
    try {
      sendNotificationToDevice(userFCM, { notification: { title: "Service started", body: `The service has been started . Rate the salon to help us discover how well your experience went` }, data: { booking_id: bookingId, status: "Start" } })
      //TODO: change the text of the uszer text 
    } catch (error) {

    }


    //TODO: add other stakeholders like - salon owners, employees or admins to send message to 
    //if required
  }

  static serviceEnd = (userPhone: string, userEmail: string, userFCM: string, salonPhone: string, salonEmail: string, salonName: string, employeePhone: string, employeeFCMs: string[], bookingId: string, bookingIdNumeric: string, dateTime: string) => {
    // SendEmail.bookingConfirm(userEmail, salonName, bookingId, bookingIdNumeric, dateTime)
    // TODO: Add notification data and the route

    try {
      sendNotificationToDevice(userFCM, { notification: { title: "Service end", body: `We hope you enjoyed the Service` }, data: { booking_id: bookingId, status: "Completed" ,type:"BOOKING" } })
      //TODO: change the text of the uszer text 
    } catch (error) {
      console.log(error)
    }

    // const userText = `Your booking for ${dateTime} has been accepted by ${salonName}, CHEERS`
    // OtpService.sendMessage(userPhone, userText)
    //TODO: add other stakeholders like - salon owners, employees or admins to send message to 
    //if required
  }

  static vendorCancelled = (user: UserSI, salon: SalonSI, employee: EmployeeSI, booking: BookingSI) => {
    const dateTime = Notify.formatDate(booking)
    try {
      SendEmail.cancelUser(user.email, user.name, salon.name)
    } catch (error) {
      console.log(error)
    }

    // TODO: Add notification data and the route

    try {
      sendNotificationToDevice(user.fcm_token, { notification: { title: "Booking Cancelled", body: `Sorry Booking has been cancelled` }, data: { booking_id: (booking._id).toString(), status: "Vendor Cancelled",type:"BOOKING"  } })
      //TODO: change the text of the uszer text 
    } catch (error) {
      console.log(error)
    }

    // const userText = `Sorry!,Your booking for ${dateTime} has been cancelled by ${salon.name}`
    // OtpService.sendMessage(user.phone, userText)
    //TODO: add other stakeholders like - salon owners, employees or admins to send message to 
    //if required
  }

  static userCancelled = (user: UserSI, salon: SalonSI, booking: BookingSI) => {
    const dateTime = Notify.formatDate(booking)
    try {
      SendEmail.cancelVendor(salon.email, user.name, salon.name)
    } catch (error) {
      console.log(error)
    }

    // TODO: Add notification data and the route

    try {
      sendNotificationToDevice(user.fcm_token, { notification: { title: "Booking Cancelled", body: `Sorry Booking has been cancelled` }, data: { booking_id: (booking._id).toString(), status: "" ,click_action: "FLUTTER_NOTIFICATION_CLICK",type:"BOOKING" } })
      //TODO: change the text of the uszer text 
    } catch (error) {
      console.log(error)
    }

    try {
      Notify.sendNotificationtoAdmin({ notification: { title: "Booking Cancelled", body: `Sorry Booking has been cancelled` }, data: { booking_id: (booking._id).toString(), status: "",click_action: "FLUTTER_NOTIFICATION_CLICK",type:"BOOKING" } })
    } catch (error) {
      console.log(error)
    }

    // const salonText = `Sorry!,Your booking for ${dateTime} has been cancelled by ${user.name}`
    // OtpService.sendMessage(salon.contact_number, salonText)
    //TODO: add other stakeholders like - salon owners, employees or admins to send message to 


    //if required
  }

  static bookingCompletedInvoice = async (user: UserSI, salon: SalonSI, booking: BookingSI, employee: EmployeeI) => {
    try {
      const getDetails = Notify.getTotalPromo(booking)
      const gst = getDetails.total * 18 / 100
      const totalwithGst = getDetails.total + gst
      testEmail(booking.booking_numeric_id.toString(), moment(booking.services[0].service_time).format("DD/mm/yyyy"), moment(booking.services[0].service_time).format("hh:mm:a"), user.name, booking.address.address ?? "", salon.name, salon.location, employee.name, getDetails.total.toString(), booking.payments, gst.toString(), totalwithGst.toString(), booking.services, user.email)
    } catch (error) {
      console.log(error)
    }

  }
  static signupUser = (user: UserSI) => {
    try {
      SendEmail.signupUser(user.email, user.name)

    } catch (error) {
      console.log(error)
    }

  }


  public static getTotalPromo(booking: BookingSI) {
    let total = 0
    let promo_code
    for (var i = 0; i < booking.services.length; i++) {
      total = total + booking.services[i].service_total_price
      if (booking.services[i].service_discount_code != null) {
        promo_code = booking.services[i].service_discount_code
      } else {
        promo_code = "N/A"
      }
    }
    total = total + (total * 18 / 100)
    return { total, promo_code }
  }


  public static formatDate(booking: BookingSI) {
    const bookingTime = moment(booking.services[0].service_time).format('MMMM Do YYYY, h:mm a');
    return bookingTime
  }

  public static sendNotificationtoAdmin = async (message) => {
    const adminService = new AdminService(Admin)
    const admins = await adminService.get() as AdminSI[]
    let token = []
    admins.map((e) => {
    token =  token.concat(e.fcm_token)
    })
    try {
      sendNotificationToDevice(token, message)
    } catch (e) {
      console.log(e)
    }
  }

}