import * as dotenv from "dotenv";
import * as Razorpay from 'razorpay'
dotenv.config()

export default class RazorPayService {
    protected key_id = process.env.razorpay_key_id ?? "rzp_live_Yoj4J6C5jQR4op"
    protected key_secret = process.env.razorpay_key_secret ?? "9DpEIzbKxpJnMnUPIFYTkps7"

    protected instance: any
    constructor() {
        this.instance = new Razorpay({
            key_id: this.key_id,
            key_secret: this.key_secret
        })
        this.instance.orders.all().then(console.log).catch(console.error);
    }

    createOrderId = async (bookingId: string, totalAmount: number) => {
        var options = {
            amount: totalAmount * 100,  // amount in the smallest currency unit
            currency: "INR",
            receipt: bookingId
        };
        const order = await this.instance.orders.create(options);
        return order
    }
}