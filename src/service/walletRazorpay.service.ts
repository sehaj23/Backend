import { RazorpayPaymentData } from "../interfaces/booking.interface";
import { WalletRazorpayI, WalletRazorpaySI, WalletRazorpayStatus } from "../interfaces/walletRazorpay.interface";
import { UserRedis } from "../redis/index.redis";
import REDIS_CONFIG from "../utils/redis-keys";
import BaseService from "./base.service";
import RazorPayService from "./razorpay.service";

export default class WalletRazorpayService extends BaseService {


    post = async (data: any, userId?: string) => {
        if (!userId) throw new Error("User id is needed")

        const walletRazorpayData: WalletRazorpayI = {
            amount: data.amount,
            user_id: userId,
            status: WalletRazorpayStatus.INITIATED
        }
        const walletRazorpay = await this.model.create(walletRazorpayData) as WalletRazorpaySI
        if (walletRazorpay === null) throw new Error("Not able to create the resource")
        const razorpayService = new RazorPayService()
        const order = await razorpayService.createOrderId(walletRazorpay._id.toString(), data.amount)
        if (!order.id) throw new Error("Razorpay order id not found")
        walletRazorpay.razorpay_order_id = order.id
        await walletRazorpay.save()
        await UserRedis.remove(userId, { type: REDIS_CONFIG.userinfo })
        return walletRazorpay
    }

    transactionResponse = async (walletRazorpayId: string, status: WalletRazorpayStatus, razorpay_payment_data?: RazorpayPaymentData, error_message?: string) => {
        const walletRazorpay = await this.model.findById(walletRazorpayId) as WalletRazorpaySI
        if (walletRazorpay === null) throw new Error("Not able to find the resource with this id")
        if (walletRazorpay.status === status) throw new Error("New status is same as old status. Cannot update")
        if (status === WalletRazorpayStatus.SUCCESSFUL) {
            if (!razorpay_payment_data) throw new Error("Need payment data")
        } else if (status === WalletRazorpayStatus.UNSUCCESSFUL) {
            if (!error_message) throw new Error("Need error message if transaction unsuccessful")
        } else {
            throw new Error("Status is not right")
        }
        walletRazorpay.status = status
        walletRazorpay.razorpay_payment_data = razorpay_payment_data
        walletRazorpay.error_message = error_message

        await walletRazorpay.save()
        return walletRazorpay
    }


}