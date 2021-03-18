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
        const { promo_code, cart_id } = req.body
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
        const promoCode = await this.service.getByPromoCode(promo_code, userId, [salonId], categories) as PromoCodeSI
        if (promoCode === null) {
            throw new ErrorResponse({ message: "Promo code not applicable" })
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
                if (promoCodesUsedIndex > -1 && promoCode.max_usage <= promoCodesUsedCountArr[promoCodesUsedIndex]?.count) {
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

}
