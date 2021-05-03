import moment = require("moment");
import Booking from "../models/booking.model";
import Cart from "../models/cart.model";
import MongoCounter from "../models/mongo-counter.model";
import Referral from "../models/referral.model";
import Salon from "../models/salon.model";
import BookingService from "../service/booking.service";
import CartService from "../service/cart.service";
import MongoCounterService from "../service/mongo-counter.service";
import sendNotificationToDevice from "../utils/send-notification";
var CronJob = require('cron').CronJob;

var thirtyMinsNotificationCron = new CronJob('*/30 * * * *', async function () {

    console.log("running cron function")
const cartService = new CartService(Cart, Salon)
const mongoCounterService = new MongoCounterService(MongoCounter)
const bookingService = new BookingService(Booking, Salon, cartService,mongoCounterService , Referral)
const todayDateMoment = moment(Date.now())
const todayDate = todayDateMoment.date()
console.log(todayDate)
const q = {
    start_date:todayDateMoment ,
    end_date:todayDateMoment ,
    status:"Confirmed",
}
const booking = await bookingService.getbookings(q) 
let tokens = []
var format = 'hh:mm:ss'
booking.bookingDetails.forEach(element => {
 const service_time =  moment(element.services[0].service_time,format)
const before_time =   moment(service_time).subtract(30,'minute')
console.log("serviceTime",service_time)
console.log("before time",before_time)
//adding 5:30 hours here
 var time = moment(moment().add(330,'minutes'),format)
 console.log("time",time)
 console.log(booking.bookingDetails.length)
 if(time.isBetween(before_time,service_time)){
  tokens =  tokens.concat(element.user_id.fcm_token)
 }
});


var message = {
notification: {
    title: 'ZATTIRE BOOKING',
    body: 'Hi! You have a booking today. Please reach 5 minutes earlier.'
},
};
console.log(tokens)
if(tokens.length != 0){
const notify = sendNotificationToDevice(tokens,message)
}

}, null, true);

var morningNotificationJob = new CronJob('0 8 * * *', async function () {
    //runs everydat at 8 am
        console.log("running cron function")
    const cartService = new CartService(Cart, Salon)
    const mongoCounterService = new MongoCounterService(MongoCounter)
    const bookingService = new BookingService(Booking, Salon, cartService,mongoCounterService , Referral)
    const todayDateMoment = moment(Date.now())
    const todayDate = todayDateMoment.date()
    console.log(todayDate)
    const q = {
        start_date:todayDateMoment ,
        end_date:todayDateMoment ,
        status:"Confirmed",
    }
   const booking = await bookingService.getbookings(q) 
   let tokens = []
    booking.bookingDetails.forEach(element => {
      
      tokens =  tokens.concat(element.user_id.fcm_token)
   });
   console.log(tokens)
   var message = {
    notification: {
        title: 'ZATTIRE BOOKING',
        body: 'Hi! You have a booking today. Please reach 5 minutes earlier.'
    },
};
   const notify = sendNotificationToDevice(tokens,message)

 
}, null, true);


var tenMinsNotificationCron = new CronJob('*/10 * * * *', async function () {
    
    console.log("running vendor 10 mins crons")
const cartService = new CartService(Cart, Salon)
const mongoCounterService = new MongoCounterService(MongoCounter)
const bookingService = new BookingService(Booking, Salon, cartService,mongoCounterService , Referral)
const todayDateMoment = moment(Date.now())
const todayDate = todayDateMoment.date()
console.log(todayDate)
const q = {
    start_date:todayDateMoment ,
    end_date:todayDateMoment ,
    status:"Confirmed",
}
const booking = await bookingService.getbookings(q) 
let tokens = []
var format = 'hh:mm:ss'
booking.bookingDetails.forEach(element => {
 const service_time =  moment(element.services[0].service_time,format)
const after_time =   moment(service_time).add(15,'minute')
console.log("serviceTime",service_time)
console.log("before time",after_time)
//adding 5:30 hours here
 var time = moment(moment().add(330,'minutes'),format)
 console.log("time",time)
 console.log(booking.bookingDetails.length)
 if(time.isBetween(service_time,after_time)){
     console.log(element.services[0].employee_id.fcm_token)
  tokens =  tokens.concat(element.services[0].employee_id.fcm_token)

 }
});


var message = {
notification: {
    title: 'ZATTIRE BOOKING',
    body: 'Hi has the booking started yet?'
},
};
console.log(tokens)
if(tokens.length != 0){
const notify = sendNotificationToDevice(tokens,message)
}

}, null, true);



export {morningNotificationJob,thirtyMinsNotificationCron,tenMinsNotificationCron}