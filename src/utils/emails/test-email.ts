import * as aws from "aws-sdk";
import { PutObjectRequest } from "aws-sdk/clients/s3";
import * as fs from 'fs';
import * as pdf from 'html-pdf';
import Mail = require("nodemailer/lib/mailer");
import MailComposer = require("nodemailer/lib/mail-composer");
import { address } from "faker";

function testEmail(orderId:string,orderDate:string,orderTime:string,customerName:string,customerAddress,salonName:string,salonAddress:string,stylist:string,subtotal:string,payment:string,gst:string,finalTotal:string){
    fs.readFile(`${__dirname}/invoice.html`, 'utf8', (err: NodeJS.ErrnoException, data: string) => {
        
    data.replaceAll("[GSTIN]","07AABCZ2603G1ZL")
    data.replaceAll("[CIN]","U74999DL2018PTC339065")
    data.replaceAll("[Address]","8/5, South patel nagar, New Delhi-110008")
    data.replaceAll("[Order ID]",orderId)
    data.replaceAll("[Order Date]",orderDate)
    data.replaceAll("[Order Time]",orderTime)
    data.replaceAll("[Customer Name]",customerName)
    data.replaceAll("[Customer Address]",customerAddress)
    data.replaceAll("[Salon Name]",salonName)
    data.replaceAll("[Salon Address]",salonAddress)
    data.replaceAll("[Stylist]",stylist.toString())
    data.replaceAll("[amt_3]",subtotal)
    data.replaceAll("[payment]",payment)
    if(err){
        console.log(err)
    }
    pdf.create(data).toStream((err: Error, stream: fs.ReadStream) => {
        const s3 = new aws.S3()
        var params: PutObjectRequest = {Bucket: `zattire-images/invoices`, Key: `${Date.now()}_i.pdf`,  Body: stream, ACL: 'public-read'};
        s3.upload(params, function(err, s3data) {
            if(err){
                console.log(err)
                return
            }
            const pdfURL = s3data.Location
            const mailOptions: Mail.Options ={
                from: 'info@zattire.com',
                replyTo: 'info@zattire.com',
                to: 'sehaj23chawla@gmail.com',
                subject: 'SES message with invoice',
                html: data,
                attachments: [
                  {
                    path: pdfURL
                  },
                ],
              }
            const mail = new MailComposer(mailOptions);
            
            mail.compile().build((err, message) => {
                if (err) {
                    console.log(err)
                }
                const sendPromise = new aws.SES({ apiVersion: '2010-12-01' }).sendRawEmail({RawMessage: {Data: message}}).promise();
                sendPromise.then(
                    function (data) {
                        console.log('email sent')
                        console.log(data)
                    }).catch(
                        function (err) {
                            console.log('email sent error')
                        console.log(err)
                        });
              });
        });
    })
    })
}

export default testEmail
// function testEmail(orderId:string,orderDate:string,orderTime:string,customerName:string,customerAddress,salonName:string,salonAddress:string,stylist:string,subtotal:string,payment:string,gst:string,finalTotal:string){
//     fs.readFile(`${__dirname}/invoice.html`, 'utf8', (err: NodeJS.ErrnoException, data: string) => {
//         if(err){
//             console.log(err)
//             return
//         }
//         console.log("1")
       
//      pdf.create(data).toStream((err: Error, stream: fs.ReadStream) => {
//          if(err){
//              console.log(err)
//              return
//          }
//          console.log("2")
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
//                             console.log('email sent')
//                             console.log(data)
//                         }).catch(
//                             function (err) {
//                                 console.log('email sent error')
//                             console.log(err)
//                             });
//                   });
//             });
//         })
//     })
// }

// export default testEmail