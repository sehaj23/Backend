import * as aws from "aws-sdk";
import * as fs from 'fs';
import { BookingPaymentI, BookingServiceI } from "../../interfaces/booking.interface";
import '../../prototypes/string.prototypes';
import Mail = require("nodemailer/lib/mailer");
import MailComposer = require("nodemailer/lib/mail-composer");

function testEmail(orderId: string, orderDate: string, orderTime: string, customerName: string, customerAddress, salonName: string, salonAddress: string, stylist: string, subtotal: string, payments: BookingPaymentI[], gst: string, finalTotal: string,services:BookingServiceI[],userEmail:string) {
    fs.readFile(`${__dirname}/invoice.html`, 'utf8', (err: NodeJS.ErrnoException, data: string) => {
        const serviceList = services.map(s => { return s.service_name + " <br>" })
        const serviceAmount = services.map(s=>{return  s.service_total_price.toString() + "<br>"})
        const serviceQuantity = services.map(s=>{return s.quantity.toString()+" <br>"})
        const discount =+ services.map(s=>{return s.service_discount})

        data = data.replaceAll("[GSTIN]", "07AABCZ2603G1ZL")
        data = data.replaceAll("[CIN]", "U74999DL2018PTC339065")
        data = data.replaceAll("[Address]", "8/5, South patel nagar, New Delhi-110008")
        data = data.replaceAll("[Order ID]", orderId)
        data = data.replaceAll("[Order Date]", orderDate)
        data = data.replaceAll("[Order Time]", orderTime)
        data = data.replaceAll("[Customer Name]", customerName)
        data = data.replaceAll("[Customer Address]", customerAddress.toString()??"N/A")
        data = data.replaceAll("[Salon Name]", salonName)
        data = data.replaceAll("[Salon Address]", salonAddress)
        data = data.replaceAll("[Stylist]", stylist?.toString())
        data = data.replaceAll("[amt_3]", subtotal)
        data = data.replaceAll("[payment]", payments.map((p: BookingPaymentI) => p.mode).join(","))
        data = data.replaceAll("[service_1]",serviceList.toString())
        data = data.replaceAll("[qty_1]",serviceQuantity.toString())
        data = data.replaceAll("[amt_1]",serviceAmount.toString())
        data = data.replaceAll("[up_1]","N/A")
        data = data.replaceAll("[amt_4]",discount.toString()??"N/A")
        data = data.replaceAll("[amt_6]",gst.toString())
        data = data.replaceAll("[total]",finalTotal.toString())
        if (err) {
            console.log(err)
            return
        }
        const mailOptions: Mail.Options = {
            from: 'info@zattire.com',
            replyTo: 'info@zattire.com',
            to: ['sehaj@zattire.com',userEmail],
            subject: `Invoice for your Booking ${orderId}`,
            html: data,
            attachments: [
                // {
                //     path: pdfURL
                // },
            ],
        }
        const mail = new MailComposer(mailOptions);

        mail.compile().build((err, message) => {
            if (err) {
                console.log(err)
            }
            const sendPromise = new aws.SES({ apiVersion: '2010-12-01' }).sendRawEmail({ RawMessage: { Data: message } }).promise();
            sendPromise.then(
                function (data) {
                }).catch(
                    function (err) {
                        console.log(err)
                    });
        });
    });
}

export default testEmail
// function testEmail(orderId:string,orderDate:string,orderTime:string,customerName:string,customerAddress,salonName:string,salonAddress:string,stylist:string,subtotal:string,payment:string,gst:string,finalTotal:string){
//     fs.readFile(`${__dirname}/invoice.html`, 'utf8', (err: NodeJS.ErrnoException, data: string) => {
//         if(err){
//             console.log(err)
//             return
//         }

//      pdf.create(data).toStream((err: Error, stream: fs.ReadStream) => {
//          if(err){
//              console.log(err)
//              return
//          }
//             const s3 = new aws.S3()
//             var params: PutObjectRequest = {Bucket: `zattire-images/invoices`, Key: `${Date.now()}_i.pdf`,  Body: stream, ACL: 'public-read'};
//             s3.upload(params, function(err, s3data) {
//                 if(err){
//                     console.log(err)
//                     return
//                 }
//                 const pdfURL = s3data.Location
//                 const mailOptions: Mail.Options ={
//                     from: 'info@zattire.com',
//                     replyTo: 'info@zattire.com',
//                     to: 'developers@zattire.com',
//                     subject: 'SES message with invoice',
//                     html: data,
//                     attachments: [
//                       {
//                         path: pdfURL
//                       },
//                     ],
//                   }
//                 const mail = new MailComposer(mailOptions);

//                 mail.compile().build((err, message) => {
//                     if (err) {
//                         console.log(err)
//                     }
//                     const sendPromise = new aws.SES({ apiVersion: '2010-12-01' }).sendRawEmail({RawMessage: {Data: message}}).promise();
//                     sendPromise.then(
//                         function (data) {

//                         }).catch(
//                             function (err) {
//                             console.log(err)
//                             });
//                   });
//             });
//         })
//     })
// }

// export default testEmail