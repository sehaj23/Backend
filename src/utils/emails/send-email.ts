import * as AWS from "aws-sdk";
import * as fs from 'fs';
import { BookingPaymentI, BookingServiceI } from "../../interfaces/booking.interface";
import '../../prototypes/string.prototypes';
import logger from "../logger";
import Mail = require("nodemailer/lib/mailer");
import MailComposer = require("nodemailer/lib/mail-composer");

type EmailSentTo = 'salon' | 'user' | 'admin' | 'employee'
type EmailType = 'booking requested' | 'booking confirmed' | 'signup' | 'booking completed' | 'forgot password' | 'reschedule booking' | 'booking cancel'

export default class SendEmail {

    /**
     * @description send email with invoice to customer and vendor
     */
    static bookingComplete = async () => {
        fs.readFile(`${__dirname}/vendor-invoice.html`, 'utf8', (err: NodeJS.ErrnoException, data: string) => {
            console.log(data)
        })
        const mailOptions: Mail.Options = {
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
        const mailOptions: Mail.Options = {
            from: 'info@zattire.com',
            replyTo: 'info@zattire.com',
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

    static bookingConfirm = async (salonEmail: string, salonName: string, bookingId: string, bookingIdNumeric: string, dateTime: string, emp_name: string, location: string, payments: BookingPaymentI[], amount: string, promo: string, services: BookingServiceI[], userName: string) => {
        const serviceList = services.map(s => { return s.service_name + " <br>" })


        fs.readFile(`${__dirname}/booking-confirmed.html`, 'utf8', (err: NodeJS.ErrnoException, data: string) => {
            if (err) {
                SendEmail.logEmailStatus(false, 'booking confirmed', 'salon', salonEmail, err.message)
                return
            }
            data = data.replaceAll("[Customer Name]", userName)
            data = data.replaceAll("[Salon Name]", salonName)
            data = data.replaceAll("[ID]", bookingIdNumeric)
            data = data.replaceAll("[date&time]", dateTime)
            data = data.replaceAll("[staff]", emp_name)
            data = data.replaceAll("[services]", serviceList.toString())
            data = data.replaceAll("[serviceLocation]", location)
            data = data.replaceAll("[amount]", amount)
            data = data.replaceAll("[payment-method]", payments.map((p: BookingPaymentI) => p.mode).join(","))
            data = data.replaceAll("[promo]", promo)
            //data = data.replaceAll("[services]",services)
            // TODO: string interpolation for the html content

            const params = {
                Destination: { /* required */
                    BccAddresses:[
                        'kashish@zattire.com',
                        'developers@zattire.com',
                    ],
                    ToAddresses: [
                        salonEmail,
                        
                        //  salonEmail
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
                    BccAddresses:[
                        'kashish@zattire.com',
                        'developers@zattire.com',
                    ],
                    ToAddresses: [
                        
                            salonEmail,
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


    static emailConfirm = async (userEmail: string, otp: string, userName: string) => {

        fs.readFile(`${__dirname}/emailVerify.html`, 'utf8', (err: NodeJS.ErrnoException, data: string) => {
            if (err) {
                SendEmail.logEmailStatus(false, 'signup', 'user', userEmail, err.message)
                return
            }
            data = data.replaceAll("[Customer Name]", userName)
            data = data.replaceAll("[OTP]", otp)

            const params = {
                Destination: { /* required */
                    BccAddresses:[
                        'kashish@zattire.com',
                        'developers@zattire.com',
                    ],
                    ToAddresses: [  
                      

                        userEmail,
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
                    SendEmail.logEmailStatus(true, 'signup', 'user', userEmail, data.MessageId)
                }).catch(
                    function (err) {
                        SendEmail.logEmailStatus(false, 'signup', 'user', userEmail, err.message)
                    });


        })
    }

    static signupUser = async (userEmail: string, userName: string) => {

        fs.readFile(`${__dirname}/signupUser.html`, 'utf8', (err: NodeJS.ErrnoException, data: string) => {
            if (err) {
                SendEmail.logEmailStatus(false, 'signup', 'user', userEmail, err.message)
                return
            }
            data = data.replaceAll("[username]", userName)


            const params = {
                Destination: { /* required */
                    BccAddresses:[
                        'kashish@zattire.com',
                        'developers@zattire.com',
                    ],
                    ToAddresses: [
                      

                        userEmail
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
                    SendEmail.logEmailStatus(true, 'signup', 'user', userEmail, data.MessageId)
                }).catch(
                    function (err) {
                        SendEmail.logEmailStatus(false, 'signup', 'user', userEmail, err.message)
                    });


        })
    }



    static logEmailStatus = (success: boolean, emailType: EmailType, sentTo: EmailSentTo, receiverEmail: string, message: string) => {
        let startingMessage = "Email sent to"
        if (!success)
            startingMessage = "Error sending email to "
        logger.info(`${startingMessage} :: ${sentTo} :: ${emailType} :: ${receiverEmail} :: ${message}`)
    }

    static forgotPasswordUser = async (userEmail: string, otp: string) => {

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
                    BccAddresses:[
                        'kashish@zattire.com',
                        'developers@zattire.com',
                    ],
                    ToAddresses: [
                     
                      
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

    static forgotPasswordNewUser = async (userEmail: string, otp: string) => {

        fs.readFile(`${__dirname}/forgot-password.html`, 'utf8', (err: NodeJS.ErrnoException, data: string) => {
            if (err) {
                SendEmail.logEmailStatus(false, 'forgot password', 'user', userEmail, err.message)
                return
            }
            // TODO: string interpolation for the html content
            console.log("sending emailll")
            const params = {
                Destination: { /* required */
                    BccAddresses:[
                        'kashish@zattire.com',
                        'developers@zattire.com',
                    ],
                    ToAddresses: [
                       
                      
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



    static rescheduleUser = async (userEmail: string, userName: string) => {

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
                    BccAddresses:[
                        'kashish@zattire.com',
                        'developers@zattire.com',
                    ],
                    ToAddresses: [
                    
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
    static rescheduleVendor = async (salonEmail: string, salonName: string, bookingId: string, bookingIdNumeric: string, dateTime: string, emp_name: string, location: string, payments: BookingPaymentI[], amount: string, promo: string, services: BookingServiceI[], customer_name: string) => {
        const servicesList = services.map(s => { return s.service_name + " <br>" })


        fs.readFile(`${__dirname}/rescheduleVendor.html`, 'utf8', (err: NodeJS.ErrnoException, data: string) => {
            if (err) {
                SendEmail.logEmailStatus(false, 'booking confirmed', 'salon', salonEmail, err.message)
                return
            }

            data = data.replaceAll("[Vendor Name]", salonName)
            data = data.replaceAll("[Customer name]", customer_name)
            data = data.replaceAll("[ID]", bookingIdNumeric)
            data = data.replaceAll("[date&time]", dateTime)
            data = data.replaceAll("[staff]", emp_name)
            data = data.replaceAll("[services]", servicesList.toString())
            data = data.replaceAll("[serviceLocation]", location)
            data = data.replaceAll("[amount]", amount)
            data = data.replaceAll("[payment-method]", payments.map((p: BookingPaymentI) => p.mode).join(","))
            data = data.replaceAll("[promo]", promo)
            //data = data.replaceAll("[services]",services)
            // TODO: string interpolation for the html content

            const params = {
                Destination: { /* required */
                    BccAddresses:[
                        'kashish@zattire.com',
                        'developers@zattire.com',
                    ],
                    ToAddresses: [
                       
                       
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

    static bookingRequestVendor = async (salonEmail: string, salonName: string, bookingId: string, bookingIdNumeric: string, dateTime: string, emp_name: string, location: string, payments: BookingPaymentI[], amount: string, promo: string, services: BookingServiceI[], userName: string, vendorName: string) => {
        const loop = services.map(s => { return s.service_name + " <br>" })
        console.log("seending mail; to vendor")

        fs.readFile(`${__dirname}/booking-request-vendor.html`, 'utf8', (err: NodeJS.ErrnoException, data: string) => {
            if (err) {
                SendEmail.logEmailStatus(false, 'booking confirmed', 'salon', salonEmail, err.message)
                return
            }
            data = data.replaceAll("[Customer name]", userName)
            data = data.replaceAll("[Vendor Name]", salonName)
            data = data.replaceAll("[ID]", bookingIdNumeric)
            data = data.replaceAll("[date&time]", dateTime)
            data = data.replaceAll("[staff]", emp_name)
            data = data.replaceAll("[services]", loop.toString().replaceAll(",",""))
            data = data.replaceAll("[serviceLocation]", location)
            data = data.replaceAll("[amount]", amount)
            data = data.replaceAll("[payment-method]", payments.map((p: BookingPaymentI) => p.mode).join(","))
            data = data.replaceAll("[promo]", promo)
            //data = data.replaceAll("[services]",services)
            // TODO: string interpolation for the html content

            const params = {
                Destination: { /* required */
                    BccAddresses:[
                        'kashish@zattire.com',
                        'developers@zattire.com',
                    ],
                    ToAddresses: [
                      
                      
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

    static cancelUser = async (userEmail: string, userName: string, salonName: string) => {

        fs.readFile(`${__dirname}/cancelUser.html`, 'utf8', (err: NodeJS.ErrnoException, data: string) => {
            if (err) {
                SendEmail.logEmailStatus(false, 'booking cancel', 'user', userEmail, err.message)
                return
            }
            data = data.replaceAll("[user Name]", userName)
            data = data.replaceAll("[salon name]", salonName)
            // TODO: string interpolation for the html content
            console.log("sending emailll")
            const params = {
                Destination: { /* required */
                    BccAddresses:[
                        'kashish@zattire.com',
                        'developers@zattire.com',
                    ],
                    ToAddresses: [
                       
                     
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
                    SendEmail.logEmailStatus(true, 'booking cancel', 'user', userEmail, data.MessageId)
                }).catch(
                    function (err) {
                        SendEmail.logEmailStatus(false, 'booking cancel', 'user', userEmail, err.message)
                    });
        })

    }

    static cancelVendor = async (salonEmail: string, userName: string, vendorName: string) => {

        fs.readFile(`${__dirname}/cancelVendor.html`, 'utf8', (err: NodeJS.ErrnoException, data: string) => {
            if (err) {
                SendEmail.logEmailStatus(false, 'booking cancel', 'user', salonEmail, err.message)
                return
            }
            data = data.replaceAll("[user Name]", userName)
            data = data.replaceAll("[customer name]", vendorName)
            // TODO: string interpolation for the html content
            console.log("sending emailll")
            const params = {
                Destination: { /* required */
                    BccAddresses:[
                        'kashish@zattire.com',
                        'developers@zattire.com',
                    ],
                    ToAddresses: [
                       
                       
                        salonEmail
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
                    SendEmail.logEmailStatus(true, 'booking cancel', 'salon', salonEmail, data.MessageId)
                }).catch(
                    function (err) {
                        SendEmail.logEmailStatus(false, 'booking cancel', 'salon', salonEmail, err.message)
                    });
        })

    }


}

