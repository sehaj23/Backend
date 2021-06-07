import BookingController from "../controller/booking.controller";
import mongoose from "../database";
import { BookingSI } from "../interfaces/booking.interface";
import RefundSI, { RefundI, RefundTypeEnum } from "../interfaces/refund.interface";
import { WalletTransactionI } from "../interfaces/wallet-transaction.interface";
import ErrorResponse from "../utils/error-response";
import BaseService from "./base.service";
import BookingService from "./booking.service";
import RazorPayService from "./razorpay.service";
import WalletTransactionService from "./wallet-transaction.service";
export default class RefundService extends BaseService {

    static ZATTIRE_REFUND_COMMISION = 35

    bookingService: BookingService
    walletTransactionService: WalletTransactionService
    constructor(model: mongoose.Model<any, any>, bookingService: BookingService, walletTransactionService: WalletTransactionService) {
        super(model)
        this.bookingService = bookingService
        this.walletTransactionService = walletTransactionService
    }

    createRefund = async (refundType: RefundTypeEnum, bookingId: string, userId: string): Promise<RefundSI> => {
        const booking = await this.bookingService.getOne({ _id: mongoose.Types.ObjectId(bookingId), user_id: userId }) as BookingSI
        if (booking.status === 'Refunded') throw new ErrorResponse({ message: "It has already been refunded" })
        let bookingTotalPrice = BookingController.getRazorPayPayableAmount(booking)
        const payment_id = booking?.razorpay_payment_data?.payment_id
        if (!payment_id) throw new ErrorResponse({ message: "Payment id not found" })
        const rp = new RazorPayService()
        // this is the amount which has already been returned
        if (refundType === RefundTypeEnum.Instant_RazorPay) {
            const amountToRefund = bookingTotalPrice - RefundService.ZATTIRE_REFUND_COMMISION
            const razorpayRefund = await rp.refund(payment_id, amountToRefund, "optimum")
            if (!razorpayRefund) throw new ErrorResponse({ message: "Razor Pay is null" })
            if (!razorpayRefund["status"]) throw new ErrorResponse({ message: "Cannot get Razorpay Refund Status" })
            const refund: RefundI = {
                type: RefundTypeEnum.Instant_RazorPay,
                status: "Initiated",
                razorpay_status: razorpayRefund["status"],
                total_amount: bookingTotalPrice,
                amount_refunded: amountToRefund,
                zattire_commision: RefundService.ZATTIRE_REFUND_COMMISION,
                user_id: userId,
                //@ts-ignore
                salon_id: (booking.salon_id?._id ?? booking.salon_id).toString(),
                booking_id: booking._id,
                razorpay_refund_id: razorpayRefund["id"]
            }

            const refundSI = await this.model.create(refund)
            booking.status = 'Refunded'
            booking.refund_id = refundSI._id
            await booking.save()
            return refundSI
        } else if (refundType === RefundTypeEnum.Normal_RazorPay) {
            const amountToRefund = bookingTotalPrice
            const razorpayRefund = await rp.refund(payment_id, amountToRefund, "optimum")
            if (!razorpayRefund) throw new ErrorResponse({ message: "Razor Pay is null" })
            if (!razorpayRefund["status"]) throw new ErrorResponse({ message: "Cannot get Razorpay Refund Status" })
            const refund: RefundI = {
                type: RefundTypeEnum.Normal_RazorPay,
                status: "Initiated",
                razorpay_status: razorpayRefund["status"],
                total_amount: bookingTotalPrice,
                amount_refunded: amountToRefund,
                zattire_commision: 0,
                user_id: userId,
                //@ts-ignore
                salon_id: (booking.salon_id?._id ?? booking.salon_id).toString(),
                booking_id: booking._id,
                razorpay_response: razorpayRefund,
                razorpay_refund_id: razorpayRefund["id"]
            }
            const refundSI = await this.model.create(refund) as RefundSI
            booking.status = 'Refunded'
            booking.refund_id = refundSI._id
            await booking.save()
            return refundSI
        } else if (refundType === RefundTypeEnum.Zattire_Wallet) {
            const amountToRefund = bookingTotalPrice
            const refund: RefundI = {
                type: RefundTypeEnum.Zattire_Wallet,
                status: "Initiated",
                total_amount: bookingTotalPrice,
                amount_refunded: amountToRefund,
                zattire_commision: 0,
                user_id: userId,
                //@ts-ignore
                salon_id: (booking.salon_id?._id ?? booking.salon_id).toString(),
                booking_id: booking._id,
            }
            const refundSI = await this.model.create(refund) as RefundSI

            const walletTransactionI: WalletTransactionI = {
                amount: amountToRefund,
                user_id: userId,
                reference_model: 'rufunds',
                reference_id: refundSI._id.toString(),
                transaction_type: "",
                transaction_owner: "ALGO",
                comment: "Refund"
            }
            await this.walletTransactionService.post(walletTransactionI)
            booking.status = 'Refunded'
            booking.refund_id = refundSI._id
            await booking.save()
            return refundSI
        }

        throw new ErrorResponse({ message: "Need Refund Type" })
    }


}