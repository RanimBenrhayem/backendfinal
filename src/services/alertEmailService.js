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
    subject: "Hurry Up .. Threat detection ", // Subject line

    html: `Good morning </br>
    we detect an alert in your chart , please verify it to understand more about the threat.
    

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
