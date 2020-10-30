import * as AWS from "aws-sdk";
import * as fs from 'fs';
import logger from "../logger";

type EmailSentTo = 'salon' | 'user' | 'admin' | 'employee'
type EmailType = 'booking requested' | 'booking confirmed'

export default class SendEmail {

    static bookingConfirm = async (salonEmail: string, salonName: string, bookingId: string, bookingIdNumeric: string, dateTime: string) => {

        fs.readFile('./booking-confirm.html', 'utf8', (err: NodeJS.ErrnoException, data: string) => {
            if (err) {
                SendEmail.logEmailStatus(false, 'booking confirmed', 'salon', salonEmail, err.message)
                return
            }

            // TODO: string interpolation for the html content

            const params = {
                Destination: { /* required */
                    ToAddresses: [
                        'preetsc27@gmail.com',
                        'kashish@zattire.com',
                        'pushaan@zattire.com',
                        salonEmail
                        /* more items */
                    ]
                },
                Message: { /* required */
                    Body: { /* required */
                        Html: {
                            Charset: "UTF-8",
                            Data: data
                        },
                        Text: {
                            Charset: "UTF-8",
                            Data: "Hello!\n Welcome to Zattire. 33"
                        }
                    },
                    Subject: {
                        Charset: 'UTF-8',
                        Data: 'Welcome to zattire'
                    }
                },
                Source: 'preet@zattire.com', /* required */
                ReplyToAddresses: [
                    'preet@zattire.com',
                    /* more items */
                ],
            };

            // Create the promise and SES service object
            var sendPromise = new AWS.SES({ apiVersion: '2010-12-01' }).sendEmail(params).promise();

            // Handle promise's fulfilled/rejected states
            sendPromise.then(
                function (data) {
                    SendEmail.logEmailStatus(true, 'booking confirmed', 'salon', salonEmail, data.MessageId)
                }).catch(
                    function (err) {
                        SendEmail.logEmailStatus(false, 'booking confirmed', 'salon', salonEmail, err.message)
                    });
        })

    }


    static logEmailStatus = (success: boolean, emailType: EmailType, sentTo: EmailSentTo, receiverEmail: string, message: string) => {
        let startingMessage = "Email sent to"
        if (!success)
            startingMessage = "Error sending email to "
        logger.info(`${startingMessage} :: ${sentTo} :: ${emailType} :: ${receiverEmail} :: ${message}`)
    }

}
