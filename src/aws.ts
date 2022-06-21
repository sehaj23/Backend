import * as AWS from "aws-sdk";
import logger from "./utils/logger";
require('dotenv').config()
const activateAws = (activate: boolean = false) => {
  if (activate) {
    console.log("activiing aws")
    AWS.config.getCredentials(function (err) {
      if (err) { 
        console.log(err)
      }
      //console.log(err.stack);
      // credentials not loaded
      else {
        AWS.config.update({ region: 'ap-south-1' })
        console.log("AWS Connected")
      }
    });
  } else {
    console.log(`Not activaiting the AWS`)
  }
}

export const sqsNewUser = (userInfo: string) => {

  const sqs = new AWS.SQS()
  const params: AWS.SQS.SendMessageRequest = {
    MessageBody: userInfo,
    QueueUrl: process.env.SQS_NEW_USER_URL
  }
  sqs.sendMessage(params, (err: AWS.AWSError, data: AWS.SQS.SendMessageResult) => {
    if (err) {
      logger.error(`sqsNewUser: ${err.message}`)
      return
    }
    logger.info(`SQS - New User - ${userInfo} - ${JSON.stringify(data)}`)
  })

}

export const sqsRefundTransaction_ = (refundId: string) => {

  const sqs = new AWS.SQS()
  const params: AWS.SQS.SendMessageRequest = {
    MessageBody: refundId,
    QueueUrl: process.env.SQS_REFUND_TRANSACTION_URL
  }
  sqs.sendMessage(params, (err: AWS.AWSError, data: AWS.SQS.SendMessageResult) => {
    if (err) {
      logger.error(`sqsNewUser: ${err.message}`)
      return
    }
    logger.info(`SQS - Refund Transaction - ${refundId} - ${JSON.stringify(data)}`)
  })

}

export enum SQSWalletTransactionType {
  Referral_Bonus = "Referral_Bonus",
  Add_Credits = "Add_Credits",
  Refunded = "Refunded",
  Used_Credits = "Used Credits"
}


export interface SQSWalletTransactionI {
  transaction_type: string
  user_id?: string
  refund_id?: string
  referral_id?: string
  booking_id?: string
  wallet_razorpay_id?: string // this is the id if the user is adding the money
  amount?: number
  description?: string
  done_by?: string // who did the transaction
}

export const sqsWalletTransaction = (walletTransaction: SQSWalletTransactionI) => {
  const sqs = new AWS.SQS()
  const params: AWS.SQS.SendMessageRequest = {
    MessageBody: JSON.stringify(walletTransaction),
    QueueUrl: process.env.SQS_WALLET_TRANSACTION_URL
  }
  sqs.sendMessage(params, (err: AWS.AWSError, data: AWS.SQS.SendMessageResult) => {
    if (err) {
      logger.error(`sqsWalletTransaction Error: ${err.message}`)
      return
    }
    logger.info(`SQS - Wallet Transaction - ${JSON.stringify(walletTransaction)} - ${JSON.stringify(data)}`)
  })
}


export default activateAws