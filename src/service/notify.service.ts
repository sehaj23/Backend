import SendEmail from "../utils/emails/send-email"
import sendNotificationToDevice from "../utils/send-notification"

class Notify {


    static bookingConfirm = (userEmail: string, userFCM: string, salonEmail: string, salonName: string, employeeFCMs: string[], bookingId: string, bookingIdNumeric: string, dateTime: string) => {
        SendEmail.bookingConfirm(salonEmail, salonName, bookingId, bookingIdNumeric, dateTime)
        // TODO: Add notification data and the route
        sendNotificationToDevice(employeeFCMs, {data: {text: "some data"}})
    }

}