import { Request, Response } from 'express';
import { CartOption, CartSI } from '../interfaces/cart.interface';
import { PromoCodeSI, PromoDiscountResult } from "../interfaces/promo-code.interface";
import SalonSI from '../interfaces/salon.interface';
import controllerErrorHandler from "../middleware/controller-error-handler.middleware";
import CartService from '../service/cart.service';
import PromoCodeService from "../service/promo-code.service";
import PromoUserService from "../service/promo-user.service";
import SalonService from '../service/salon.service';
import ErrorResponse from '../utils/error-response';
//import Error from '../utils/error-response';
import BaseController from "./base.controller";
import moment = require('moment');
import { PromoUserSI } from '../interfaces/promo-user.inderface';

export default class PromoCodeController extends BaseController {

    promoUserService: PromoUserService
    cartService: CartService
    salonService: SalonService
    service: PromoCodeService
    constructor(service: PromoCodeService, promoUserService: PromoUserService, cartService: CartService, salonService: SalonService) {
        super(service)
        this.promoUserService = promoUserService
        this.cartService = cartService
        this.salonService = salonService
    }

    discountApplicable = controllerErrorHandler(async (req: Request, res: Response) => {
        //@ts-ignore
        const userId = req.userId
        const { promo_code, cart_id,} = req.body
        let booking_time = req.body
        if(booking_time == null || booking_time == undefined){
            booking_time=moment(Date.now())
        }
        const result: PromoDiscountResult[] = []
        let cart: CartSI
     
        if (cart_id)
            cart = await this.cartService.getId(cart_id)
        else {
            cart = await this.cartService.getCartByUserId(userId)
        }
        if (cart === null || !cart) throw new ErrorResponse({ message: "Cart not found" })
        //@ts-ignore
        const salonId = cart?.salon_id?._id ?? cart?.salon_id
        console.log(cart);

        console.log(cart.options)
        const optionIds = cart?.options?.map((o: CartOption) => o.option_id)
        console.log(optionIds);

        const categories = await this.cartService.getCategoriesByOptionIds(optionIds)
       // let promoCode = await this.service.getOne({ promo_code: promo_code }) as PromoCodeSI
         const promoCode = await this.service.getByPromoCode(promo_code, userId, [salonId], categories) as PromoCodeSI
        if (promoCode === null) {
            throw new ErrorResponse({ message: "Promo code not applicable" })
        }
        
      

        if (promoCode.active === false) throw new Error(`Promo code not active anymore`)
        const bookingDateTime = moment(booking_time)
        // time check
        if (!bookingDateTime.isBefore(promoCode.expiry_date_time)) throw new Error(`Promo code is expired`)
        if (promoCode.time_type === 'Custom') {

            const currentDay = bookingDateTime.day()
            const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
            if (!promoCode.custom_time_days.includes(currentDay)) throw new Error(`This promo code is not valid on ${DAYS[currentDay]}`)
           console.log(bookingDateTime.format("HH"))
           console.log(promoCode.custom_time_start_time.split(":")[0])
             if(parseInt(bookingDateTime.format("HH")) >=parseInt(promoCode.custom_time_start_time.split(":")[0])==false && parseInt(bookingDateTime.format("HH")) <=parseInt(promoCode.custom_time_end_time.split(":")[0])==false ) throw new Error(`This promo code is valid between ${promoCode.custom_time_start_time} and ${promoCode.custom_time_end_time}`)
            // if (!bookingDateTime.isBetween(promoCode.custom_time_start_time, promoCode.custom_time_end_time)) throw new Error(`This promo code is valid between ${promoCode.custom_time_start_time} and ${promoCode.custom_time_end_time}`)
        }
        if (promoCode.user_ids && promoCode?.user_ids?.length > 0) {
            if (!promoCode.user_ids.includes(userId)) throw new Error(`Current user doe not support this coupon code`)
        }
        const promoUserCount = await this.promoUserService.get({ promo_code_id: promoCode._id, user_id: userId,status:{$in:["In-use","Completed"]} }) as PromoUserSI[]
        // if  max_usage is -1 it means unlimited times
        if ((promoCode.max_usage !== -1) && promoCode.max_usage <= promoUserCount?.length) throw new Error(`You have exceeded the max usage: ${promoCode.max_usage}`)
        // check for the salon
        
        // minimum bill check
        if (cart.total < promoCode.minimum_bill) throw new Error(`You cannot apply this coupon code. Minimum bill should be ${promoCode.minimum_bill}`)
        if (promoCode.salon_ids && promoCode.salon_ids?.length > 0) {
          
            //@ts-ignore
            if (promoCode.salon_ids.includes(cart.salon_id._id.toString())==false) throw new Error(`This coupon code is not applied on this salon`)
        }
        let totalDiscountGiven = 0
        const salon = await this.salonService.getId(salonId) as SalonSI
        for (let salonService of salon.services) {
            const salonOptionIds = salonService.options.map(o => o._id.toString())
            let i = 0
            while (i < cart.options.length && totalDiscountGiven < promoCode.discount_cap) {
                const cartOpt = cart.options[i]
                const salonOptionIndex = salonOptionIds.indexOf(cartOpt.option_id)
                if (salonOptionIndex > -1 && (promoCode.categories?.length === 0 || (promoCode.categories?.length > 0 && promoCode.categories?.includes(salonService.category)))) {
                    const salonOption = salonService.options[salonOptionIndex]
                    if (promoCode.discount_type === 'Flat Price') {
                        const { flat_price } = promoCode
                        // calculating the discount which we can give
                        let discountApplicable = (salonOption.price < flat_price) ? salonOption.price : flat_price
                        discountApplicable = (discountApplicable > (promoCode.discount_cap - totalDiscountGiven)) ? (promoCode.discount_cap - totalDiscountGiven) : discountApplicable
                        const discount: PromoDiscountResult = {
                            option_id: cartOpt.option_id,
                            before_discount_price: salonOption.price,
                            discount: discountApplicable,
                            after_discount_price: salonOption.price - discountApplicable,
                            category_name: salonService.category
                        }
                        totalDiscountGiven += discountApplicable
                        result.push(discount)
                    } else {
                        const { discount_percentage } = promoCode
                        const discountInNumber = parseInt((salonOption.price * (discount_percentage / 100)).toString())
                        let discountApplicable = (salonOption.price < discountInNumber) ? salonOption.price : discountInNumber
                        discountApplicable = (discountApplicable > (promoCode.discount_cap - totalDiscountGiven)) ? (promoCode.discount_cap - totalDiscountGiven) : discountApplicable
                        const discount: PromoDiscountResult = {
                            option_id: cartOpt.option_id,
                            before_discount_price: salonOption.price,
                            discount: discountApplicable,
                            after_discount_price: salonOption.price - discountApplicable,
                            category_name: salonService.category
                        }
                        totalDiscountGiven += discountApplicable
                        result.push(discount)
                    }
                    cart.options.splice(i, 1)

                } else {
                    i++
                }
            }
        }
        res.send(result)
    })

    getByName = controllerErrorHandler(async (req: Request, res: Response) => {
        const promo_code = req.body.promo_code
        const promo = await this.service.getByName(promo_code)
        res.status(200).send(promo)
    })

    promoCodeByUserId = controllerErrorHandler(async (req: Request, res: Response) => {
        //@ts-ignore
        const userId = req.userId

        let cart = await this.cartService.getCartByUserIdLean(userId, true)
        if (cart.length === 0) throw new ErrorResponse({ message: "To get coupon codes we need an active cart." })
        //@ts-ignore
        const salonId = cart[0].salon_id.toString()
        const optionIds = cart[0].options.map((o: CartOption) => o.option_id)
        const categories = await this.cartService.getCategoriesByOptionIds(optionIds)
        const promoCodesArr = await this.service.promoCodesByUserId(userId, [salonId], categories) as PromoCodeSI[]
        // checking if the promo code is used before if yes how many times
        if (promoCodesArr.length > 0) {
            const promoCodeIds = promoCodesArr.map(p => p._id.toString())
            const promoCodesUsedCountArr = await this.promoUserService.countByUserIdAndPromoCodeIds(userId, promoCodeIds)
            let i = 0;
            while (i < promoCodesArr.length) {
                const promoCode = promoCodesArr[i]
                const promoCodesUsedIndex = promoCodesUsedCountArr.map(p => p._id.toString()).indexOf(promoCode._id.toString())
                console.log(cart[0].total)
                if ( promoCode.minimum_bill > cart[0].total || promoCodesUsedIndex > -1 && promoCode.max_usage <= promoCodesUsedCountArr[promoCodesUsedIndex]?.count ) {
                    promoCodesArr.splice(i, 1)
                } else {
                    i++
                }
            }
        }
        res.send(promoCodesArr)
    })


    getPromoBySalon = controllerErrorHandler(async (req: Request, res: Response) => {
        const id = req.params.id
        const salon = await this.service. getPromoBySalon(id)
        res.status(200).send(salon)
    })
    getNames = controllerErrorHandler(async (req: Request, res: Response) => {
        const promo = await this.service.getNameandId()
        res.status(200).send(promo)
    })

    getPromoforHomepage=controllerErrorHandler(async (req: Request, res: Response) => {
    const q =req.query
    const promo = await this.service.getPromoforHomePage(q)
    res.status(200).send(promo)
    })

}
