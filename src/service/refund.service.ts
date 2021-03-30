import { sqsWalletTransaction, SQSWalletTransactionI } from "../aws";
import mongoose from "../database";
import { BookingPaymentMode, BookingServiceI, BookingSI } from "../interfaces/booking.interface";
import RefundSI, { RefundI, RefundTypeEnum } from "../interfaces/refund.interface";
import ErrorResponse from "../utils/error-response";
import BaseService from "./base.service";
import BookingService from "./booking.service";
import RazorPayService from "./razorpay.service";
export default class RefundService extends BaseService {

    static ZATTIRE_REFUND_COMMISION = 35

    bookingService: BookingService
    constructor(model: mongoose.Model<any, any>, bookingService: BookingService) {
        super(model)
        this.bookingService = bookingService
    }

    createRefund = async (refundType: RefundTypeEnum, bookingId: string, userId: string): Promise<RefundSI> => {
        const booking = await this.bookingService.getOne({ _id: mongoose.Types.ObjectId(bookingId), user_id: userId }) as BookingSI
        let bookingTotalPrice = booking.services.map((s: BookingServiceI) => s.service_total_price).reduce((a: number, b: number) => a + b)
        bookingTotalPrice = bookingTotalPrice + (bookingTotalPrice * 0.18)
        bookingTotalPrice = parseFloat(bookingTotalPrice.toFixed(2))
        const payment_id = booking?.razorpay_payment_data?.payment_id
        if (!payment_id) throw new ErrorResponse({ message: "Payment id not found" })
        const rp = new RazorPayService()
        // this is the amount which has already been returned
        let walletAmount: number = 0
        const walletPayemntIndex = booking.payments.findIndex(p => p.mode === BookingPaymentMode.WALLET)
        if (walletPayemntIndex > -1) walletAmount = booking.payments[walletPayemntIndex].amount
        if (refundType === RefundTypeEnum.Instant_RazorPay) {
            const amountToRefund = bookingTotalPrice - RefundService.ZATTIRE_REFUND_COMMISION - walletAmount
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
            const amountToRefund = bookingTotalPrice - walletAmount
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
            const amountToRefund = bookingTotalPrice - walletAmount
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
            const sqsWalletTransactionData: SQSWalletTransactionI = {
                transaction_type: "Refund",
                refund_id: refundSI._id.toString()
            }
            sqsWalletTransaction(sqsWalletTransactionData)
            booking.status = 'Refunded'
            booking.refund_id = refundSI._id
            await booking.save()
            return refundSI
        }

        throw new ErrorResponse({ message: "Need Refund Type" })
    }


}