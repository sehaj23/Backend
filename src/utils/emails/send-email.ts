import * as AWS from "aws-sdk";
import * as fs from 'fs';
import logger from "../logger";
import Mail = require("nodemailer/lib/mailer");
import MailComposer = require("nodemailer/lib/mail-composer");

type EmailSentTo = 'salon' | 'user' | 'admin' | 'employee'
type EmailType = 'booking requested' | 'booking confirmed' | 'signup' | 'booking completed' | 'forgot password'

export default class SendEmail {

    /**
     * @description send email with invoice to customer and vendor
     */
    static bookingComplete = async () => {
        fs.readFile(`${__dirname}/vendor-invoice.html`, 'utf8', (err: NodeJS.ErrnoException, data: string) => {
            console.log(data)
        })
        const mailOptions: Mail.Options ={
            from: 'source@example.com',
            replyTo: 'source@example.com',
            to: 'bob@example.com',
            subject: 'Sample SES message with attachment',
            text: 'Hey folks, this is a test message from SES with an attachment.',
            attachments: [
              {
                path: '/tmp/file.docx'
              },
            ],
          }
        const mail = new MailComposer(mailOptions);
    }

    static bookingConfirm = async (salonEmail: string, salonName: string, bookingId: string, bookingIdNumeric: string, dateTime: string) => {

        fs.readFile(`${__dirname}/booking-confirm.html`, 'utf8', (err: NodeJS.ErrnoException, data: string) => {
            if (err) {
                SendEmail.logEmailStatus(false, 'booking confirmed', 'salon', salonEmail, err.message)
                return
            }else{
                // const Name =  data.replace(`<span style="font-size: 16px; line-height: 2; word-break: break-word; mso-line-height-alt: 32px;">OTP</span>`,`<span style="font-size: 16px; line-height: 2; word-break: break-word; mso-line-height-alt: 32px;">${otp}</span>`)
                // fs.writeFile(`${__dirname}/booking-confirm.html`, writeOTP, 'utf8', function (err) {
                //     if (err) return console.log(err);
                //  });
            }
            // TODO: string interpolation for the html content

            const params = {
                Destination: { /* required */
                    ToAddresses: [
                        'preetsc27@gmail.com',
                        'kashish@zattire.com',
                        'pushaan@zattire.com',
                        'developers@zattire.com',
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

    static vendorSignup = async (salonEmail: string) => {

        fs.readFile(`${__dirname}/vendor-signup.html`, 'utf8', (err: NodeJS.ErrnoException, data: string) => {
            if (err) {
                SendEmail.logEmailStatus(false, 'signup', 'salon', salonEmail, err.message)
                return
            }
            // TODO: string interpolation for the html content

            const params = {
                Destination: { /* required */
                    ToAddresses: [
                        'preetsc27@gmail.com',
                        'kashish@zattire.com',
                        'pushaan@zattire.com',
                        'developers@zattire.com',
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


    static emailConfirm = async (userEmail:string,otp:string,userName:string) => {

        fs.readFile(`${__dirname}/confirm-email-new.html`, 'utf8', (err: NodeJS.ErrnoException, data: string) => {
            if (err) {
                SendEmail.logEmailStatus(false, 'signup', 'user', userEmail, err.message)
                return
            }else{
                const writeOTP =  data.replace(`/<span data-mce-style="font-size: 17px; line-height: 34px;" style="font-size: 17px; line-height: 34px;"><strong>*</strong></span>/g`,`<span data-mce-style="font-size: 17px; line-height: 34px;" style="font-size: 17px; line-height: 34px;"><strong>${otp}</strong></span>`)
                const writeName = data.replace(`/<span style="font-size: 20px;"><em><strong>*</strong></em></span>/g`,`<span style="font-size: 20px;"><em><strong>Hi ${userName},</strong></em></span>`)
                console.log(data)
                console.log(otp)
                // fs.writeFile(`${__dirname}/confirm-email-new.html`, [writeOTP,writeName], 'utf8', function (err) {
                //     if (err) return console.log(err);
                //     console.log("replaced")
                //  });
            }

            // TODO: string interpolation for the html content

            const params = {
                Destination: { /* required */
                    ToAddresses: [
                        'preetsc27@gmail.com',
                        'kashish@zattire.com',
                        'pushaan@zattire.com',
                        'developers@zattire.com',
                      
                        userEmail
                        /* more items */
                    ]
                },
                Message: { /* required */
                    Body: { /* required */
                        Html: {
                            Charset: "UTF-8",
                            Data:data
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
                    SendEmail.logEmailStatus(true, 'signup', 'user', userEmail, data.MessageId)
                }).catch(
                    function (err) {
                        SendEmail.logEmailStatus(false, 'signup', 'user', userEmail, err.message)
                    });
       

    })}


    static logEmailStatus = (success: boolean, emailType: EmailType, sentTo: EmailSentTo, receiverEmail: string, message: string) => {
        let startingMessage = "Email sent to"
        if (!success)
            startingMessage = "Error sending email to "
        logger.info(`${startingMessage} :: ${sentTo} :: ${emailType} :: ${receiverEmail} :: ${message}`)   
    }

    static forgotPasswordUser = async (userEmail: string, otp:string) => {

        fs.readFile(`${__dirname}/forgot-password-user.html`, 'utf8', (err: NodeJS.ErrnoException, data: string) => {
            if (err) {
                SendEmail.logEmailStatus(false, 'forgot password', 'user', userEmail, err.message)
                return
            }
            // TODO: string interpolation for the html content
                console.log("sending emailll")
            const params = {
                Destination: { /* required */
                    ToAddresses: [
                        'preetsc27@gmail.com',
                        'kashish@zattire.com',
                        'pushaan@zattire.com',
                        'developers@zattire.com',
                        userEmail
                        /* more items */
                    ]
                },
                Message: { /* required */
                    Body: { /* required */
                        Html: {
                            Charset: "UTF-8",
                            Data: data,
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
                    SendEmail.logEmailStatus(true, 'forgot password', 'user', userEmail, data.MessageId)
                }).catch(
                    function (err) {
                        SendEmail.logEmailStatus(false, 'forgot password', 'user', userEmail, err.message)
                    });
        })

    }

    static forgotPasswordNewUser = async (userEmail: string, otp:string) => {

        fs.readFile(`${__dirname}/forgot-password-new.html`, 'utf8', (err: NodeJS.ErrnoException, data: string) => {
            if (err) {
                SendEmail.logEmailStatus(false, 'forgot password', 'user', userEmail, err.message)
                return
            }
            // TODO: string interpolation for the html content
                console.log("sending emailll")
            const params = {
                Destination: { /* required */
                    ToAddresses: [
                        'preetsc27@gmail.com',
                        'kashish@zattire.com',
                        'pushaan@zattire.com',
                        'developers@zattire.com',
                        userEmail
                        /* more items */
                    ]
                },
                Message: { /* required */
                    Body: { /* required */
                        Html: {
                            Charset: "UTF-8",
                            Data: data,
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
                    SendEmail.logEmailStatus(true, 'forgot password', 'user', userEmail, data.MessageId)
                }).catch(
                    function (err) {
                        SendEmail.logEmailStatus(false, 'forgot password', 'user', userEmail, err.message)
                    });
        })

    }


}
