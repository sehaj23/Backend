import { Request, Response } from 'express';
import { CartSI } from '../interfaces/cart.interface';
import { PromoCodeSI, PromoDiscountResult } from "../interfaces/promo-code.interface";
import { PromoUserSI } from '../interfaces/promo-user.inderface';
import SalonSI from '../interfaces/salon.interface';
import controllerErrorHandler from "../middleware/controller-error-handler.middleware";
import CartService from '../service/cart.service';
import PromoCodeService from "../service/promo-code.service";
import PromoUserService from "../service/promo-user.service";
import SalonService from '../service/salon.service';
//import Error from '../utils/error-response';
import BaseController from "./base.controller";
import moment = require('moment');

export default class PromoCodeController extends BaseController {

    promoUserService: PromoUserService
    cartService: CartService
    salonService: SalonService
    constructor(service: PromoCodeService, promoUserService: PromoUserService, cartService: CartService, salonService: SalonService) {
        super(service)
        this.promoUserService = promoUserService
        this.cartService = cartService
        this.salonService = salonService
    }

    discountApplicable = controllerErrorHandler(async (req: Request, res: Response) => {
        //@ts-ignore
        const userId = req.userId
        const { promo_code, cart_id } = req.body
        const promoCode = await this.service.getOne({ promo_code }) as PromoCodeSI
        if (promoCode === null) throw new Error(`Promo code not found`)
        if (promoCode.active === false) throw new Error(`Promo code not active anymore`)
        const currentDateTime = moment(Date.now())
        // time check
        if(!currentDateTime.isBefore(promoCode.expiry_date_time)) throw new Error(`Promo code is expired`)
        if(promoCode.time_type === 'Custom'){
            
            const currentDay = currentDateTime.day()
            const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
            if(!promoCode.custom_time_days.includes(currentDay))throw new Error(`This promo code is not valid on ${DAYS[currentDay]}`)
            if(!currentDateTime.isBetween(promoCode.custom_time_start_time, promoCode.custom_time_end_time)) throw new Error(`This promo code is valid between ${promoCode.custom_time_start_time} and ${promoCode.custom_time_end_time}`)
        }
        if (promoCode.user_ids && promoCode?.user_ids?.length > 0) {
            if (!promoCode.user_ids.includes(userId)) throw new Error(`Current user doe not support this coupon code`)
        }
        const promoUserCount = await this.promoUserService.get({ promo_code_id: promoCode._id.toString(), user_id: userId }) as PromoUserSI[]
        // if  max_usage is -1 it means unlimited times
        if ((promoCode.max_usage !== -1) && promoCode.max_usage <= promoUserCount?.length) throw new Error(`You have exceeded the max usage: ${promoCode.max_usage}`)
        // check for the salon
        const cart = await this.cartService.getId(cart_id) as CartSI
        if (cart === null) throw new Error(`Not able find cart with this id`)
        // minimum bill check
        if(cart.total < promoCode.minimum_bill)throw new Error(`You cannot apply this coupon code. Minimum bill should be ${promoCode.minimum_bill}`)
        if (promoCode.salon_ids && promoCode.salon_ids?.length > 0) {
            //@ts-ignore
            if (!promoCode.salon_ids.includes(cart.salon_id._id)) throw new Error(`This coupon code is not applied on this salon`)
        }


        const result: PromoDiscountResult[] = []
        let totalDiscountGiven = 0
        if (promoCode.categories && promoCode.categories.length > 0) {
            //@ts-ignore
            const salon = await this.salonService.getId(cart.salon_id._id) as SalonSI
            if (salon === null) throw new Error(`Salon not found from the cart`)
            for (let salonService of salon.services) {
                const salonOptionIds = salonService.options.map(o => o._id.toString())
                let i = 0
                while (i < cart.options.length && totalDiscountGiven < promoCode.discount_cap) {
                    const cartOpt = cart.options[i]
                    const salonOptionIndex = salonOptionIds.indexOf(cartOpt.option_id) 
                    if (salonOptionIndex > -1 && (promoCode.categories?.length > 0 && promoCode.categories?.includes(salonService.category))) {
                        const salonOption = salonService.options[salonOptionIndex]
                        if(promoCode.disctount_type === 'Flat Price'){
                            const {flat_price} = promoCode
                            // calculating the discount which we can give
                            let discountApplicable = (salonOption.price < flat_price) ? salonOption.price : flat_price
                            discountApplicable = (discountApplicable > (promoCode.discount_cap - totalDiscountGiven)) ? discountApplicable - (promoCode.discount_cap - totalDiscountGiven) : discountApplicable
                            const discount : PromoDiscountResult= {
                                option_id: cartOpt.option_id,
                                before_discount_price: salonOption.price,
                                discount: discountApplicable,
                                after_discount_price: salonOption.price - discountApplicable,
                                category_name: salonService.category
                            }
                            result.push(discount)
                        }else{
                            const {discount_percentage} = promoCode
                            const discountInNumber = parseInt((salonOption.price * (discount_percentage/100)).toString())
                            let discountApplicable = (salonOption.price < discountInNumber) ? salonOption.price : discountInNumber
                            discountApplicable = (discountApplicable > (promoCode.discount_cap - totalDiscountGiven)) ? discountApplicable - (promoCode.discount_cap - totalDiscountGiven) : discountApplicable
                            const discount : PromoDiscountResult= {
                                option_id: cartOpt.option_id,
                                before_discount_price: salonOption.price,
                                discount: discountApplicable,
                                after_discount_price: salonOption.price - discountApplicable,
                                category_name: salonService.category
                            }
                            result.push(discount)
                        }
                        cart.options.splice(i, 1)
                    } else {
                        i++
                    }
                }
            }
        }
        res.send(result)
    })

}
