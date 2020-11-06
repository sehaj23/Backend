import * as aws from "aws-sdk";
import { PutObjectRequest } from "aws-sdk/clients/s3";
import * as fs from 'fs';
import * as pdf from 'html-pdf';
import Mail = require("nodemailer/lib/mailer");
import MailComposer = require("nodemailer/lib/mail-composer");

function testEmail(){
    fs.readFile(`${__dirname}/vendor-invoice.html`, 'utf8', (err: NodeJS.ErrnoException, data: string) => {
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
                    from: 'preet@zattire.com',
                    replyTo: 'preet@zattire.com',
                    to: 'preetsc27@gmail.com',
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