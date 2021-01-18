import * as AWS from "aws-sdk";
import * as fs from 'fs';
import '../../prototypes/string.prototypes';
import logger from "../logger";
import Mail = require("nodemailer/lib/mailer");
import MailComposer = require("nodemailer/lib/mail-composer");
import { LocationI } from "../../interfaces/salon.interface";
import { ServiceSI } from "../../interfaces/service.interface";
import { BookingServiceI } from "../../interfaces/booking.interface";

type EmailSentTo = 'salon' | 'user' | 'admin' | 'employee'
type EmailType = 'booking requested' | 'booking confirmed' | 'signup' | 'booking completed' | 'forgot password' | 'reschedule booking'

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
    static bookingInvoice = async () => {
        fs.readFile(`${__dirname}/invoice.html`, 'utf8', (err: NodeJS.ErrnoException, data: string) => {
            console.log(data)
        })
        const mailOptions: Mail.Options ={
            from: 'source@example.com',
            replyTo: 'source@example.com',
            to: 'sehaj23chawla@gmail.com',
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

    static bookingConfirm = async (salonEmail: string, salonName: string, bookingId: string, bookingIdNumeric: string, dateTime: string,emp_name:string,location:string,payment_method:string,amount:string,promo:string,services:BookingServiceI[]) => {
      services.forEach(s=>console.log(s.service_name))

       
        console.log("emaill")
        const loop = services.map(s=>{s.service_name})
        console.log(loop)

        fs.readFile(`${__dirname}/booking-confirmed.html`, 'utf8', (err: NodeJS.ErrnoException, data: string) => {
            if (err) {
                SendEmail.logEmailStatus(false, 'booking confirmed', 'salon', salonEmail, err.message)
                     return
                  }
                  data = data.replaceAll("[Salon Name]", salonName)
                  data = data.replaceAll("[ID]", bookingIdNumeric)
                  data = data.replaceAll("[date&time]",dateTime)
                  data = data.replaceAll("[staff]",emp_name)
                  data =  data.replaceAll("[services]",services.forEach(s=>{s.service_name})+"<br>")
                  data = data.replaceAll("[serviceLocation]",location)
                  data = data.replaceAll("[amount]",amount)
                  data = data.replaceAll("[payment-method]",payment_method)
                  data = data.replaceAll("[promo]",promo)
                  //data = data.replaceAll("[services]",services)
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
                Source: 'info@zattire.com', /* required */
                ReplyToAddresses: [
                    'info@zattire.com',
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
                Source: 'info@zattire.com', /* required */
                ReplyToAddresses: [
                    'info@zattire.com',
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

        fs.readFile(`${__dirname}/emailVerify.html`, 'utf8', (err: NodeJS.ErrnoException, data: string) => {
            if (err) {
                SendEmail.logEmailStatus(false, 'signup', 'user', userEmail, err.message)
                return
            }
            data = data.replaceAll("[Customer Name]", userName)
            data = data.replaceAll("[OTP]", otp)

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
                Source: 'info@zattire.com', /* required */
                ReplyToAddresses: [
                    'info@zattire.com',
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
           
            data = data.replaceAll("[[OTP]]", otp)
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
                Source: 'info@zattire.com', /* required */
                ReplyToAddresses: [
                    'info@zattire.com',
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

        fs.readFile(`${__dirname}/forgot-password.html`, 'utf8', (err: NodeJS.ErrnoException, data: string) => {
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
                Source: 'info@zattire.com', /* required */
                ReplyToAddresses: [
                    'info@zattire.com',
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



static rescheduleUser = async (userEmail: string,userName:string) => {

    fs.readFile(`${__dirname}/reschedule-user.html`, 'utf8', (err: NodeJS.ErrnoException, data: string) => {
        if (err) {
            SendEmail.logEmailStatus(false, 'reschedule booking', 'user', userEmail, err.message)
            return
        }
        data = data.replaceAll("[Customer Name]", userName)
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
            Source: 'info@zattire.com', /* required */
            ReplyToAddresses: [
                'info@zattire.com',
                /* more items */
            ],
        };

        // Create the promise and SES service object
        var sendPromise = new AWS.SES({ apiVersion: '2010-12-01' }).sendEmail(params).promise();

        // Handle promise's fulfilled/rejected states
        sendPromise.then(
            function (data) {
                SendEmail.logEmailStatus(true, 'reschedule booking', 'user', userEmail, data.MessageId)
            }).catch(
                function (err) {
                    SendEmail.logEmailStatus(false, 'reschedule booking', 'user', userEmail, err.message)
                });
    })

}


}

