
export type notificationType= "DEALS"|"COUPON CODE"|"BOOKING"|"APP"
export interface NotificationI{
    title:string,
    body:string,
    type: notificationType,
    id:string
}