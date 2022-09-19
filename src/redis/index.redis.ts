import BaseRedis from "./base.redis";


export const UserRedis = new BaseRedis("User")
export const BannerRedis = new BaseRedis("Banner")
export const AdminRedis = new BaseRedis("Admin")
export const SalonRedis = new BaseRedis("Salon")
export const ServiceRedis = new BaseRedis("Service")
export const VendorRedis = new BaseRedis("Vendor")
export const CartRedis = new BaseRedis("Cart")
export const BookingRedis = new BaseRedis("Booking")
export const PromoCodeRedis = new BaseRedis("PromoCode")
export const SalonSearchRedis = new BaseRedis("SalonSearch")
export const ExploreRedis = new BaseRedis("Explore")
export const FeedbackRedis = new BaseRedis("Feedback")
