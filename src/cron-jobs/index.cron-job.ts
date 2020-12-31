import moment = require("moment");

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