const router = require("express").Router();
const userModel = require("../models/user.model");
//const Token = require("../models/token.model");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
class PasswordController {
  // send password link

  async resetpassword(req, res) {
    const transporter = nodemailer.createTransport({
      service: "outlook",
      auth: {
        user: "branperstartup@outlook.com",
        pass: "ranim123",
      },
    });
    crypto.randomBytes(32, (err, buffer) => {
      if (err) {
        console.log(err);
      }
      const token = buffer.toString("hex");
      //res.json(token);
      userModel.findOne({ email: req.body.email }).then((user) => {
        if (!user) {
          return res
            .status(422)
            .json({ error: "User does not exist with this email" });
        }
        user.resetToken = token;
        user.expireToken = Date.now() + 3600000;
        user.save().then((result) => {
          transporter.sendMail({
            to: user.email,
            from: "branperstartup@outlook.com",
            subject: "Password Reset",
            html: `
                You are receiving this because your ( or someone else ) have requested the reset of the password for your Branper 2.0 account .
                Please click on the following <a href="http://localhost:3001/ResetPassword/${token}">link</a> to complete the process.
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
   Location : Novation city, H. Maarouf, Riadh
                `,
          });
          res.json({ message: "Please check your email" });
        });
      });
    });
  }
  async newpassword(req, res) {
    const newPassword = req.body.password;
    const sentToken = req.body.token;
    //console.log(sentToken);
    userModel
      .findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
      .then((user) => {
        if (!user) {
          return res.status(422).json({ error: "Try again session expired" });
        }
        bcrypt.hash(newPassword, 10).then((hashedpassword) => {
          user.password = hashedpassword;
          user.resetToken = undefined;
          user.expireToken = undefined;
          user.save().then((saveduser) => {
            res.json({ message: "password updated successfully" });
          });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
module.exports = new PasswordController();
