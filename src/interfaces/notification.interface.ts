
export type notificationType= "DEALS"|"COUPON CODE"|"BOOKING"|"APP"|"CASHBACK"
export interface NotificationI{
    title:string,
    body:string,
    type: notificationType,
    id:string
}