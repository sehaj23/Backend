import { 
    morningNotificationJob, 
    thirtyMinsNotificationCron, 
    tenMinsNotificationCron, 
    fifteenMinsNotificationCron 
} from "./booking.cron-job";

const runAllCrons = () => {
    morningNotificationJob.start()
    thirtyMinsNotificationCron.start()
    tenMinsNotificationCron.start()
    fifteenMinsNotificationCron.start()
}

export default runAllCrons
