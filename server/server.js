const express = require('express');
const cors = require('cors');
const sendGrid = require('@sendgrid/mail');

const app = express();

sendGrid.setApiKey('SENDGRID_API_KEY');

app.use(cors());

app.length('/', (req, res) => {
    res.send('Welcome to SendGrid!!!!');
})

app.listen(4000, () => console.log('running server at 4000'));

// var helper = require('sendgrid').mail;
// const async = require('async');
// module.exports = {
//     db: 'firebase://localhost:27017/myblogapp'
//   };


// function sendEmail(
//     parentCallback,
//     fromEmail,
//     toEmails,
//     subject,
//     textContent,
//     htmlContent
//   ) {
//     const errorEmails = [];
//     const successfulEmails = [];
//      const sg = require('sendgrid')('SENDGRID_API_KEY');
//      async.parallel([
//       function(callback) {
//         // Add to emails
//         for (let i = 0; i < toEmails.length; i += 1) {
//           // Add from emails
//           const senderEmail = new helper.Email(fromEmail);
//           // Add to email
//           const toEmail = new helper.Email(toEmails[i]);
//           // HTML Content
//           const content = new helper.Content('text/html', htmlContent);
//           const mail = new helper.Mail(senderEmail, subject, toEmail, content);
//           var request = sg.emptyRequest({
//             method: 'POST',
//             path: '/v3/mail/send',
//             body: mail.toJSON()
//           });
//           sg.API(request, function (error, response) {
//             console.log('SendGrid');
//             if (error) {
//               console.log('Error response received');
//             }
//             console.log(response.statusCode);
//             console.log(response.body);
//             console.log(response.headers);
//           });
//         }
//         // return
//         callback(null, true);
//       }
//     ], function(err, results) {
//       console.log('Done');
//     });
//     parentCallback(null,
//       {
//         successfulEmails: successfulEmails,
//         errorEmails: errorEmails,
//       }
//     );
// }

// module.exports = (app) => {
//     app.post('/api/send', function (req, res, next) {

//         async.parallel([
//             function (callback) {
//               sendEmail(
//                 callback,
//                 'volvi@gmail.com',
//                 ['fsantost.050793@gmail.com', 'YOUR_TO_EMAIL2@example.com'],
//                 'Subject Line',
//                 'Text Content',
//                 '<p style="font-size: 32px;">HTML Content</p>'
//               );
//             }
//           ], function(err, results) {
//             res.send({
//               success: true,
//               message: 'Emails sent',
//               successfulEmails: results[0].successfulEmails,
//               errorEmails: results[0].errorEmails,
//             });
//           });

//     });
//   };







// var express = require('express')
// var bodyParser = require('body-parser')
// var cors = require('cors')
// var nodemailer = require('nodemailer')
// var xoauth2 = require('xoauth2')

// var app = express()
// app.use(cors())
// app.use(bodyParser.json())

// // deklarasi email transporter
// var sender = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: 'aduhcapekkali@gmail.com',
//         type: 'OAuth2',
//         clientId: 'mysecretclientid',
//         clientSecret: 'mysecretclientsecret',
//         refreshToken: 'mysecretrefreshtoken'
//     }  
// })

// // initial route
// app.get('/', (req, res)=>{
//     res.send('<h1>Express & Nodemailer</h1>')
// })

// // route untuk kirim email
// app.post('/email', (req, res)=>{
    
//     // deklarasi email yang akan dikirim
//     var emailku = {
//         from: 'superman <superman@dc.com>',
//         to: req.body.email,
//         subject: `Halo, ${req.body.nama} 🤖`,
//         // text: 'Halo dunia!'
//         html: `<h1>Halo ${req.body.nama} 🤖</h1>`,
//         attachments:[{
//                 filename: 'barca.png', 
//                 path:'https://vignette.wikia.nocookie.net/logopedia/images/0/0e/Barcelona.png'
//             },
//             {
//                 filename: 'pesan.txt',
//                 content: 'Halo, apa kabar? Maaf nyepam!'
//             }
//         ]
//     }

//     sender.sendMail(emailku, (error)=>{
//         if(error){
//             console.log(error)
//             res.send(error)
//         } else {
//             console.log('Email sukses terkirim!')
//             res.send('Email sukses terkirim!')
//         }
//     })
// })

// var server = app.listen(3210, ()=>{
//     var host  = server.address().address;
//     var port  = server.address().port;
//     console.log('Server aktif @port 3210!')
// });