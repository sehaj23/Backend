
import { BookingSI } from "../interfaces/booking.interface"
import EmployeeSI from "../interfaces/employee.interface"
import SalonSI, { LocationI } from "../interfaces/salon.interface"
import { UserSI } from "../interfaces/user.interface"
import SendEmail from "../utils/emails/send-email"
import sendNotificationToDevice from "../utils/send-notification"
import OtpService from "./otp.service"

export default class Notify {

//TODO: Null check for params because booking fails

    static bookingConfirm = async (user:UserSI,salon:SalonSI,employee:EmployeeSI,booking:BookingSI) => {
      try{  
        let total=0
        let promo_code
        for(var i=0;i<booking.services.length;i++){
          total =  total+ booking.services[i].service_total_price
              if(booking.services[i].service_discount_code != null){
                promo_code=booking.services[i].service_discount_code
              }
        }
      SendEmail.bookingConfirm(user.email, salon.name, booking._id, booking.booking_numeric_id.toString(), booking.services[0].service_time.toString(),employee.name,booking.location,booking.payment_type,total.toString(),promo_code,booking.services)
      }catch(e){
        console.log(e)
      } 
      // TODO: Add notification data and the route
      try {
        sendNotificationToDevice(user.fcm_token, { notification: {title:"Booking Confirmed",body: `Your booking for ${booking.services[0].service_time} has been accepted by ${salon.name}`},data:{booking_id:booking._id,status:"Confirmed",click_action:"FLUTTER_NOTIFICATION_CLICK"}})
      } catch (error) {
        console.log(error)
      }
    
       
        //TODO: change the text of the uszer text 
        try {
          const userText = `Your booking for ${booking.services[0].service_time} has been accepted by ${salon.name}, CHEERS`
          OtpService.sendMessage(user.phone, userText)
        } catch (error) {
          
        }
      
        //TODO: add other stakeholders like - salon owners, employees or admins to send message to 
        //if required
    }

    static bookingRequest = async (vendorPhone: string, employeeFCMs: string[], bookingId: string, employeeName: string, dateTime: string,vendorFCM:string[],salonEmail:string,salonName:string,bookingIdNumeric:string) => {
      //  SendEmail.bookingConfirm(salonEmail, salonName, bookingId, bookingIdNumeric, dateTime)
        // TODO: Add notification data and the route
        try {
          sendNotificationToDevice(vendorFCM, { notification: {title:"Booking Request",body: `${employeeName} has received a new booking for ${dateTime}`},data:{booking_id:bookingId,status:"Requested",click_action:"FLUTTER_NOTIFICATION_CLICK"}})
        } catch (error) {
          console.log(error)
        }
        try {
          sendNotificationToDevice(employeeFCMs, { notification: {title:"Booking Request",body: `You have received a new booking for ${dateTime}`},data:{booking_id:bookingId,status:"Requested",click_action:"FLUTTER_NOTIFICATION_CLICK"}})
        } catch (error) {
          console.log(error)
        }
      
      
         //check
        //TODO: change the text of the uszer text 
        try {
          const vendorText = `Received a new booking for ${dateTime}`
          console.log("sending message")
          OtpService.sendMessage(vendorPhone, vendorText)
        } catch (error) {
          console.log(error)
        }
       
       
        //TODO: add other stakeholders like - salon owners, employees or admins to send message to 
        //if required
    }

    static rescheduledPending = async (userPhone: string, userEmail: string, userFCM: string, salonPhone: string, salonEmail: string, salonName: string, employeePhone: string, employeeFCMs: string[], bookingId: string, bookingIdNumeric: string, dateTime: string) => {
      //  SendEmail.bookingConfirm(userEmail, salonName, bookingId, bookingIdNumeric, dateTime)
        // TODO: Add notification data and the route
       try {
        sendNotificationToDevice(userFCM, { notification: {title:"Booking Rescheduled",body: `To make up for the current unavailability ${salonName} has sent you new time slots, click here to open`},data:{booking_id:bookingId,status:"Rescheduled and Pending",click_action:"FLUTTER_NOTIFICATION_CLICK"}})
       } catch (error) {
         
       }

    
        //TODO: change the text of the uszer text 
        try {
          const userText = `To make up for the current unavailability ${salonName} has sent you new time slots, click here to open`
        OtpService.sendMessage(userPhone, userText)
        } catch (error) {
          
        }
        
      
         //TODO: add other stakeholders like - salon owners, employees or admins to send message to 
        //if required
    }

 


    static rescheduledBooking = (vendorPhone: string, employeeFCMs: string[], bookingId: string, employeeName: string, dateTime: string,vendorFCM:string,salonEmail:string,salonName:string,bookingIdNumeric:string) => {
        //  SendEmail.bookingConfirm(salonEmail, salonName, bookingId, bookingIdNumeric, dateTime)
          // TODO: Add notification data and the route

          try {
            sendNotificationToDevice(employeeFCMs, { notification: {title:"Booking Reschedule Accepted",body: `The booking you rescheduled for ${dateTime} has been accepted`},data:{booking_id:bookingId,status:"Requested"}})
          } catch (error) {
            
          }

          try {
            sendNotificationToDevice(vendorFCM, { notification: {title:"Booking Reschedule Accepted",body: `The rescheduled booking by ${employeeName} for ${dateTime} has been accepted’
            `},data:{booking_id:bookingId,status:"Rescheduled"}})
          } catch (error) {
            
          }

         
         
          //TODO: change the text of the uszer text 
          try {  
           const vendorText = `The rescheduled booking by ${employeeName} for ${dateTime} has been accepted`
          OtpService.sendMessage(vendorPhone, vendorText)

            
          } catch (error) {
            
          }
                 //TODO: add other stakeholders like - salon owners, employees or admins to send message to 
          //if required
      }

      static rescheduledCancelled = (vendorPhone: string, employeeFCMs: string[], bookingId: string, employeeName: string, dateTime: string,vendorFCM:string,salonEmail:string,salonName:string,bookingIdNumeric:string) => {
        //  SendEmail.bookingConfirm(salonEmail, salonName, bookingId, bookingIdNumeric, dateTime)
          // TODO: Add notification data and the route
          try {
            sendNotificationToDevice(employeeFCMs, { notification: {title:"Booking  Cancelled",body: `The rescheduled booking has been cancelled by the user`},data:{booking_id:bookingId,status:"Rescheduled and Cancelled"}})
            sendNotificationToDevice(vendorFCM, { notification: {title:"Booking  Cancelled",body: `The rescheduled booking has been cancelled by the user`},data:{booking_id:bookingId,status:"Rescheduled"}})
          } catch (error) {
            
          }

          try {
            const vendorText = `The rescheduled booking has been cancelled by the user`
            OtpService.sendMessage(vendorPhone, vendorText)
          } catch (error) {
            
          }
         
          //TODO: change the text of the uszer text 
        
          //TODO: add other stakeholders like - salon owners, employees or admins to send message to 
          //if required
      }

      static serviceStart = (userPhone: string, userEmail: string, userFCM: string, salonPhone: string, salonEmail: string, salonName: string, employeePhone: string, employeeFCMs: string[], bookingId: string, bookingIdNumeric: string, dateTime: string) => {
        
        // TODO: Add notification data and the route
        try {
          sendNotificationToDevice(userFCM, { notification: {title:"Service start",body: `Enjoy the Service`},data:{booking_id:bookingId,status:"Start"}})
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
          sendNotificationToDevice(userFCM, { notification: {title:"Service end",body: `We hope you enjoyed the Service`},data:{booking_id:bookingId,status:"Completed"}})
          //TODO: change the text of the uszer text 
        } catch (error) {
          console.log(error)
        }
     
        // const userText = `Your booking for ${dateTime} has been accepted by ${salonName}, CHEERS`
        // OtpService.sendMessage(userPhone, userText)
        //TODO: add other stakeholders like - salon owners, employees or admins to send message to 
        //if required
    }


}