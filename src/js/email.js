// //EMAIL
var api_key = '027a5eb5201346f6ccc3f836feb48e8b-52cbfb43-750114e2'//'5488ecf8f73889cbf30282d46064552c-52cbfb43-f34636c8'//process.env.API
var DOMAIN = 'sandbox0a22b0ab58d84691b7523e52465d84f9.mailgun.org'//process.env.domain; //TODO chamge
var mailgun = require('mailgun-js')({ apiKey: api_key, domain: DOMAIN });
// //requirements
// // const nodemailer = require('nodemailer');
// // const nodemailerSendgrid = require('nodemailer-sendgrid');
// // const sgMail = require('@sendgrid/mail');
// // const transport = nodemailer.createTransport(
// //     nodemailerSendgrid({
// //         apiKey: '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'
// //     })
// // );
// var randomstring = require("randomstring");

// // let smtpConfig = {
// //     host: 'smtp.example.com',
// //     port: 587,
// //     secure: false, // upgrade later with STARTTLS
// //     auth: {
// //         user: 'username',
// //         pass: 'password'
// //     }
// // };




// //active codes 
// // var activeCodes = []

// module.exports = function (email = "", user_id = "") {
//     //vars 
//     //baseurl
//     // this.baseUrl = "http://localhost:8080"
//     this.baseUrl = "https://ganymede18.herokuapp.com"
//     // email sent
//     this.email = email
//     this.user_id = user_id
//     //active email codes
//     this.activeCodes = []
//     //full url 
//     this.fullUrl = ""
//     this.randomUrlCode = ""


//     //getters/setters
//     //get active codes
//     this.getCodes = function() {
//         return this.activeCodes;
//     }
//     //get IsActiveCode 
//     this.isActiveCode = function(possibleCode) {
//         //test 
//         if (this.activeCodes.indexOf(possibleCode) != -1) {
//             //code is active 
//             //remove code 
            
//             var index = this.activeCodes.indexOf(5);
//             if (index > -1) {
//                 this.activeCodes.splice(index, 1);
//             }
//             return true;
            
//         }  
//         else {
//             //code not active
//             return false;
//         }
//     }
//     //storing email 
//     this.setEmail = function(email, user_id) {
//         this.email = email
//         this.user_id = user_id
//     }
//     //getting email 
//     this.getEmail = function() {
//         return this.email;
//     }
//     //deleting email after 
//     this.deleteEmail = function() {
//         this.email = ""
//         this.user_id = ""
//     }


//     //functions
//     //generting code
//     this.generateRandomUrl = function() {
//         //need to randomly generate a string to use in the url 
//         this.randomUrlCode = randomstring.generate({
//             length: 100,
//             charset: 'alphanumeric'
//         });

//         //need to parse it to a url form 
//         var fullUrlReturned = this.convertToFullUrl(this.randomUrlCode )

//         //also add it to active codes 
//         this.activeCodes.push(this.randomUrlCode)

//         //also return the code 
//         return fullUrlReturned;
//     }



//     //taking code and parsing to full url
//     this.convertToFullUrl = function(randomUrlCode)  {
//         //randomurlcode should be secure 



//         //getting full url off of base url
//         this.fullUrl = this.buildUrl(this.baseUrl + '/emailConfirm', {
//             //params 
//             code: randomUrlCode,
//             id: this.user_id
//         })

//         //have the url and the code now 
//         //need to email the url
//         //and return the code
//         return this.fullUrl



//     }

//     //code that takes parameters and formats query url
//     this.buildUrl = function(url, parameters) {
//         let qs = "";
//         for (const key in parameters) {
//             if (parameters.hasOwnProperty(key)) {
//                 const value = parameters[key];
//                 qs +=
//                     encodeURIComponent(key) + "=" + encodeURIComponent(value) + "&";
//             }
//         }
//         if (qs.length > 0) {
//             qs = qs.substring(0, qs.length - 1); //chop off last "&"
//             url = url + "?" + qs;
//         }
//         return url;
//     }

//     //sending the email
//     this.sendEmail = function( url) {
//         // var transporter = nodemailer.createTransport({
//         //     service: 'gmail',
//         //     auth: {
//         //       user: 'mfpganymede@gmail.com',
//         //       pass: 'vukxoq-cYnvev-jexru1'
//         //     }
//         //   });
          
//         // var mailOptions = {
//         //     from: 'mfpganymede@gmail.com',
//         //     to: this.email,
//         //     subject: 'Email Verification',
//         //     text: "Please use the following link to verify your email address:\n\t" + url
//         // };
    
//         // transporter.sendMail(mailOptions, function(error, info){
//         //     if (error) {
//         //       console.log(error);
//         //     } else {
//         //       console.log('Email sent: ' + info.response);
//         //     }
//         // });
        // var mailgun = require("mailgun-js");
        
        // var mailgun = require('mailgun-js')({ apiKey: api_key, domain: domain });

// var api_key = 'YOUR_API_KEY';
// var DOMAIN = 'YOUR_DOMAIN_NAME';


var data = {
    from: 'Excited User <me@samples.mailgun.org>',
    to: 'bar@example.com, YOU@YOUR_DOMAIN_NAME',
    subject: 'Hello',
    text: 'Testing some Mailgun awesomness!'
};

mailgun.messages().send(data, function (error, body) {
    console.log(body);
});
        // var data = {
        //     from: 'noreply@ganymedemfp.com',
        //     to: 'jolaroux@gmail.com',
        //     subject: 'Email Verification',
        //     text: "Please use the following link to verify your email address:\n\n" + "TEST"
        // };

        // mailgun.messages().send(data, function (error, body) {
        //     console.log(body);
        // });
          
//     }

//     // this.sendEmailSendGrid = function(url) {
//         // transport.sendMail({
//         //     from: 'mfpganymede@gmail.com',
//         //     to: email ,
//         //     subject: 'hello world',
//         //     html: '<h1>Hello world!</h1>'
//         // });

//         // //getting link 
//         // var emailText = "Please use the following link to verify your email address:\n\t" + url

//         // sgMail.setApiKey("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");
//         // const msg = {
//         // to: [this.email],
//         // from: 'mfpganymede@gmail.com',
//         // subject: 'MyFinancePal Email Verification',
//         // text: emailText,
//         // // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
//         // };
//         // sgMail.send(msg)
//         // .then(() => {
//         //   //Celebrate
//         //   console.log("\nEmail sent successully to " + this.email + "\n")
//         // })
//         // .catch(error => {
      
//         //   //Log friendly error
//         //   console.error(error.toString());
      
//         //   //Extract error msg
//         //   const {message, code, response} = error;
      
//         //   //Extract response msg
//         //   const {headers, body} = response;
//         // });
//     // }
// }















// // generateRandomUrl()

