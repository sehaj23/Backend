import BaseRedis from "./base.redis";


export const UserRedis = new BaseRedis("User")
export const AdminRedis = new BaseRedis("Admin")
export const SalonRedis = new BaseRedis("Salon")
export const ServiceRedis = new BaseRedis("Service")