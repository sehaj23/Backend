import moment = require("moment");
import Cart from "../models/cart.model";
import Salon from "../models/salon.model";
import CartService from "../service/cart.service";

var CronJob = require('cron').CronJob;
// after one hour check if there is anything in the users cart
var job = new CronJob('* * 1 * * *', function() {
    const cartService = new CartService(Cart, Salon)
    const todayDateMoment = moment(Date.now())
    const todayDate = todayDateMoment.date
    const carts = cartService.get({"createdAt": {
            "$gt": todayDate
        }
    })
    console.log(carts)
}, null, true, 'India/Kolkata');
job.start();