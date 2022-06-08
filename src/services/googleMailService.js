const userModel = require("../models/user.model");
const nodemailer = require("nodemailer");

function mailService(email, firstName) {
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
    subject: "Welcome to Branper ", // Subject line

    html: `
    Hello - we're excited you're here! </br>
    Your subscription has been confirmed. You can now use your email as your password while logging in.
   
    Thanks for joining our team.
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