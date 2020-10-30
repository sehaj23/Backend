import SendEmail from "../utils/emails/send-email"
import sendNotificationToDevice from "../utils/send-notification"
import OtpService from "./otp.service"

class Notify {



    static bookingConfirm = (userPhone: string, userEmail: string, userFCM: string, salonPhone: string, salonEmail: string, salonName: string, employeePhone: string, employeeFCMs: string[], bookingId: string, bookingIdNumeric: string, dateTime: string) => {
        SendEmail.bookingConfirm(salonEmail, salonName, bookingId, bookingIdNumeric, dateTime)
        // TODO: Add notification data and the route
        sendNotificationToDevice(employeeFCMs, {data: {text: "some data"}})
        //TODO: change the text of the user text 
        const userText = `Hello your booking confirmed`
        OtpService.sendMessage(userPhone, userText)
        //TODO: add other stakeholders like - salon owners, employees or admins to send message to 
        //if required
    }

}