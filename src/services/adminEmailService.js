const userModel = require("../models/user.model");
const nodemailer = require("nodemailer");

function adminEmailServices(req, res) {
  transporter = nodemailer.createTransport({
    service: "outlook",
    auth: {
      user: "branperstartup@outlook.com",
      pass: "ranim123",
    },
  });

  console.log(req.body);

  const email = req.body.email;
  const message = req.body.message;
  const content = ` ${message} `;

  var mail = {
    from: "branperstartup@outlook.com",
    to: email,
    subject: "[Branper Admin]  ",
    message: message,
    text: content,
  };

  transporter.sendMail(mail, (err) => {
    if (err) {
      console.log(err);
      res.json({
        status: "fail",
      });
    } else {
      res.json({
        status: "success",
      });
    }
  });
}

module.exports = adminEmailServices;
