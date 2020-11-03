import SendEmail from "../utils/emails/send-email"
import sendNotificationToDevice from "../utils/send-notification"
import OtpService from "./otp.service"

export default class Notify {



    static bookingConfirm = (userPhone: string, userEmail: string, userFCM: string, salonPhone: string, salonEmail: string, salonName: string, employeePhone: string, employeeFCMs: string[], bookingId: string, bookingIdNumeric: string, dateTime: string) => {
      //  SendEmail.bookingConfirm(salonEmail, salonName, bookingId, bookingIdNumeric, dateTime)
        // TODO: Add notification data and the route
        sendNotificationToDevice(userFCM, { notification: {title:"Booking Confirmed",body: `Your booking for ${dateTime} has been accepted by ${salonName}`}})
        //TODO: change the text of the uszer text 
        const userText = `Your booking for ${dateTime} has been accepted by ${salonName}, CHEERS`
        OtpService.sendMessage(userPhone, userText)
        //TODO: add other stakeholders like - salon owners, employees or admins to send message to 
        //if required
    }

}