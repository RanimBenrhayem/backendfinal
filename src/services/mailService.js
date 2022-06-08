const userModel = require("../models/user.model");
const nodemailer = require("nodemailer");

function mailService(email) {
  transporter = nodemailer.createTransport({
    service: "outlook",
    auth: {
      user: "branperstartup@outlook.com",
      pass: "ranim123",
    },
  });

  var mailOptions = {
    from: "branperstartup@outlook.com", // sender address (who sends)
    to: email, // list of receivers (who receives)
    subject: "Subscription Confirmed.. ", // Subject line

    html: `Good morning </br>
    Your subscription to our list has been confirmed..
   </br>
   have a nice day!
   </br>
   </br>
   </br>
   </br>
   E-mail : info@branper.com
   </br>
   PhoneNumber: +216 56 219 219
   </br>
   Site web:  www.branper.com
   </br>
   Location : Novation city, H. Maarouf, Riadh `, // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return console.log(error);
    }

    console.log("Message sent: " + info.response);
  });
}
module.exports = mailService;
