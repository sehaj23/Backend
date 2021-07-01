import * as dotenv from "dotenv";
import * as Razorpay from 'razorpay';
import ErrorResponse from "../utils/error-response";
dotenv.config()

export default class RazorPayService {
    protected key_id = process.env.razorpay_key_id ?? "rzp_test_yO1o0ygmtoi8Zf"
    protected key_secret = process.env.razorpay_key_secret ?? "EmuXeVjuGbKzIU8b1LKSEGeQ"

    protected instance: any
    constructor() {
        this.instance = new Razorpay({
            key_id: this.key_id,
            key_secret: this.key_secret
        })
        this.instance.orders.all().then(console.log).catch(console.error);
    }

    createOrderId = async (bookingId: string, totalAmount: number) => {
        console.log(`totalAmount : ${totalAmount}`)
        var options = {
            amount: parseInt((parseFloat(totalAmount.toFixed(2)) * 100).toString()),  // amount in the smallest currency unit
            currency: "INR",
            receipt: bookingId
        };
        console.log(options)
        try {
            const order = await this.instance.orders.create(options);
            return order
        } catch (e) {
            console.log(`Razorpay error createOrderId: ${e}`)
            console.log(e)
            if (e?.error?.description) throw new ErrorResponse({ message: e?.error?.description })
            throw e
        }
    }

    refund = async (payment_id: string, amount: number, speed: "optimum" | "normal") => {
        const a = parseInt((amount * 100).toFixed(2))
        try {
            const refund = await this.instance.payments.refund(payment_id, { amount: a, speed })
            return refund
        } catch (e) {
            console.log(`Razorpay error refund: ${e}`)
            console.log(e)
            if (e?.error?.description) throw new ErrorResponse({ message: `${e?.error?.description} amount: ${a}` })
            throw e
        }
    }

    capture = async (payment_id: string, amount: number) => {
        amount = parseInt((amount * 100).toFixed(2))
        try {

            const capture = await this.instance.payments.capture(payment_id, amount, { currency: "INR" })
            return capture
        } catch (e) {
            console.log(`Razorpay error capture: ${e?.error?.description ?? e}`)
            console.log(e)
            if (e?.error?.description) throw new ErrorResponse({ message: `${e?.error?.description} amnt: ${amount}` })
            throw e
        }
    }

    fetch = async (payment_id: string) => {
        try {

            const fetch = await this.instance.payments.fetch(payment_id)
            return fetch
        } catch (e) {
            console.log(`Razorpay error fetch: ${e?.error?.description ?? e}`)
            console.log(e)
            if (e?.error?.description) throw new ErrorResponse({ message: `${e?.error?.description}` })
            throw e
        }
    }
}