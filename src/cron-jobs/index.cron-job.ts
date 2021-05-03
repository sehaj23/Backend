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
import { morningNotificationJob,minsNotificationCron } from "./booking.cron-job";

var CronJob = require('cron').CronJob;
// after one hour check if there is anything in the users cart
// var job = new CronJob('* * 1 * * *', async function () {
//     const cartService = new CartService(Cart, Salon)
//     const todayDateMoment = moment(Date.now())
//     const todayDate = todayDateMoment.date()
//     const carts = await cartService.get({
//         "createdAt": {
//             "$gt": todayDate
//         }
//     })
//     console.log(carts)
// }, null, true);
// job.start();


const runAllCrons =()=>{
    console.log("starting All crons")
    morningNotificationJob.start()
    minsNotificationCron.start()

    
}


export default runAllCrons
