
import mongoose from "../database";
export type referralStatus = 'Used'| 'Not Used'

export interface ReferralI{
    referred_by: string|mongoose.Types.ObjectId,
    referred_to: Referred_to
}
export interface Referred_to{
    user:string|mongoose.Types.ObjectId,
    status:referralStatus,
    referral_code:string,
    booking_id:string|mongoose.Types.ObjectId,


}

export interface  ReferralSI extends ReferralI, mongoose.Document{}