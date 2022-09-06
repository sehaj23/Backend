import moment = require("moment");
import UserI from "../interfaces/user.interface";
import Booking from "../models/booking.model";
import Cart from "../models/cart.model";
import EmployeeAbsenteeism from "../models/employeeAbsenteeism.model";
import Explore from "../models/explore.model";
import Feedback from "../models/feedback.model";
import MongoCounter from "../models/mongo-counter.model";
import Referral from "../models/referral.model";
import ReportVendor from "../models/reportVendor.model";
import Salon from "../models/salon.model";
import User from "../models/user.model";
import Vendor from "../models/vendor.model";
import WalletTransaction from "../models/wallet-transaction.model";
import BookingService from "../service/booking.service";
import CartService from "../service/cart.service";
import MongoCounterService from "../service/mongo-counter.service";
import UserService from "../service/user.service";
import VendorService from "../service/vendor.service";
import WalletTransactionService from "../service/wallet-transaction.service";
import sendNotificationToDevice from "../utils/send-notification";
var CronJob = require('cron').CronJob;

// var thirtyMinsNotificationCron = new CronJob('*/30 * * * *', async function () {

//     const cartService = new CartService(Cart, Salon,Explore)
//     const mongoCounterService = new MongoCounterService(MongoCounter)
//     const userService = new UserService(User, Booking)
//     const walletTransactionService: WalletTransactionService = new WalletTransactionService(WalletTransaction, userService)
//     const bookingService = new BookingService(Booking, Salon, cartService, mongoCounterService, Referral, walletTransactionService)
//     const todayDateMoment = moment(Date.now())
//     const todayDate = todayDateMoment.date()
//     const q = {
//         start_date: todayDateMoment,
//         end_date: todayDateMoment,
//         status: "Confirmed",
//     }
//     const booking = await bookingService.getbookings(q)
//     let tokens = []
//     var format = 'hh:mm:ss'    
//     booking.bookingDetails.forEach(element => {
//         const service_time = moment(element.services[0].service_time, format)
//         const before_time = moment(service_time).subtract(30, 'minute')
//         //adding 5:30 hours here
//         var time = moment(moment().add(330, 'minutes'), format)
//         if (time.isBetween(before_time, service_time)) {
//             tokens = tokens.concat(element.user_id.fcm_token)
//         }     
//     });


//     var message = {
//         notification: {
//             title: 'ZATTIRE BOOKING',
//             body: 'Hi! You have a booking within 30 minutes. Please reach 5 minutes earlier.'
//         },
//     };
//     if (tokens.length != 0) {
//         const notify = sendNotificationToDevice(tokens, message)
//     }

// }, null, true);

var morningNotificationJob = new CronJob('0 8 * * *', async function () {
    //runs everydat at 8 am
    const cartService = new CartService(Cart, Salon,Explore)
    const mongoCounterService = new MongoCounterService(MongoCounter)
    const userService = new UserService(User, Booking)
    const walletTransactionService: WalletTransactionService = new WalletTransactionService(WalletTransaction, userService)
    const bookingService = new BookingService(Booking, Salon, cartService, mongoCounterService, Referral, walletTransactionService)
    const todayDateMoment = moment(Date.now())
    const todayDate = todayDateMoment.date()
    const q = {
        start_date: todayDateMoment,
        end_date: todayDateMoment,
        status: "Confirmed",
    }
    const booking = await bookingService.getbookings(q)
    let tokens = []
    booking.bookingDetails.forEach(element => {

        tokens = tokens.concat(element.user_id.fcm_token)
    });
    var message = {
        notification: {
            title: 'ZATTIRE BOOKING',
            body: 'Hi! You have a booking today. Please reach 5 minutes earlier.'
        },
    };
    if (tokens.length != 0) {
        const notify = sendNotificationToDevice(tokens, message)
    }
}, null, true);


var tenMinsNotificationCron = new CronJob('*/10 * * * *', async function () {
    const cartService = new CartService(Cart, Salon,Explore)
    const mongoCounterService = new MongoCounterService(MongoCounter)
    const userService = new UserService(User, Booking)
    const walletTransactionService: WalletTransactionService = new WalletTransactionService(WalletTransaction, userService)
    const bookingService = new BookingService(Booking, Salon, cartService, mongoCounterService, Referral, walletTransactionService)
    const vendorService = new VendorService(Vendor, EmployeeAbsenteeism, ReportVendor, Feedback)
    const todayDateMoment = moment(Date.now())
    const todayDate = todayDateMoment.date()
    const q = {
        start_date: todayDateMoment,
        end_date: todayDateMoment,
        status: "Confirmed",
    }
    const booking = await bookingService.getbookings(q)
    let tokens = []
    var format = 'hh:mm:ss'
    booking.bookingDetails.forEach(async element => {
        const service_time = moment(element.services[0].service_time, format)
        const after_time = moment(service_time).add(15, 'minute')
        //adding 5:30 hours here
        var time = moment(moment().add(330, 'minutes'), format)
        if (time.isBetween(service_time, after_time)) {
            const vendor = await vendorService.getId(element.vendor_id)
            tokens.concat(vendor)

        }
    });


    var message = {
        notification: {
            title: 'ZATTIRE BOOKING',
            body: 'Hi has the booking started yet?'
        },
    };
    if (tokens.length != 0) {
        const notify = sendNotificationToDevice(tokens, message)
    }
}, null, true);


var fifteenMinsNotificationCron = new CronJob('*/15 * * * *', async function () {    
    console.log("fifteenMinsNotificationCron")
    var tokens = []
    const carts = await Cart.find({ 
        updatedAt: { $gte: new Date((new Date().getTime() - (24 * 60 * 60 * 1000))) },
        status: "In use"
     }).sort({ "createdAt": -1 }).populate('user_id');
    const currentDate:Date = new Date()
    carts.forEach(cart => { 
        const cartDate:Date = new Date(cart["updatedAt"])
        const minutes = Math.abs(currentDate.getTime() - cartDate.getTime()) / (1000 * 60);
        
        // high - low == cron_time
        if(minutes >= 0 && minutes <= 3){
            try {
                var userdata = cart.user_id as UserI
                tokens = tokens.concat(userdata.fcm_token)
            } catch (error) {
                console.log("ERROR!! while adding token to array")
            }
        }
    })
    const message = {
        "notification": {
            "title": "Your services are waiting for you",
            "body": "Looks like you have added some services to your cart. Please check your cart and proceed to checkout"
        }
    }
    if (tokens.length != 0) {
        const notify = sendNotificationToDevice(tokens, message)
    }
}, null, true);


var thirtyMinsNotificationCron = new CronJob('*/30 * * * *', async function () {
    let tokens = []
    var format = 'hh:mm:ss'
    const booking = await Booking.find({ 
        // last day bookings,1 number of days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds
        createdAt: { $gte: new Date((new Date().getTime() - (1* 24 * 60 * 60 * 1000))) },
        status: "Confirmed",
        // status: "Requested"
     }).sort({ "createdAt": -1 }).populate('user_id');

    
    booking.forEach(element => {
        const service_time = moment(element.services[0].service_time, format)
        const before_time = moment(service_time).subtract(30, 'minute')
        var time = moment(moment().add(330, 'minutes'), format)
        let isBw = time.isBetween(before_time, service_time)
        // console.log({before_time, service_time, time, isBw});
        if (isBw) {
            try {
                var userdata = element.user_id as UserI
                tokens = tokens.concat(userdata.fcm_token)
                console.log(`tokens now is ${tokens}`);
            } catch (error) {
                console.log("ERROR!! while adding token to array")
            }
        }
    });

    var message = {
        notification: {
            title: 'ZATTIRE BOOKING',
            body: 'Hi! You have a booking within 30 minutes. Please reach 5 minutes earlier.'
        },
    };
    if (tokens.length != 0) {
        const notify = sendNotificationToDevice(tokens, message)
    }

}, null, true);

export {
    morningNotificationJob,
    thirtyMinsNotificationCron,
    tenMinsNotificationCron,
    fifteenMinsNotificationCron
};
