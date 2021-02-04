import * as AWS from "aws-sdk";
import logger from "./utils/logger";
require('dotenv').config()
const activateAws = (activate: boolean = false) => {
  if (activate) {
    AWS.config.getCredentials(function (err) {
      if (err) { }
      //console.log(err.stack);
      // credentials not loaded
      else {
        AWS.config.update({ region: 'ap-south-1' })
        // console.log("Access key:", AWS.config.credentials.accessKeyId);
        // console.log("Region: ", AWS.config.region);
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
  })

}


export default activateAws