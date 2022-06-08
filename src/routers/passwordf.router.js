const express = require("express");
const router = express.Router();
const PasswordController = require("../controllers/password.reset.controller");
router.post("/passwordreset", PasswordController.resetpassword);
router.post("/newpassword", PasswordController.newpassword);

module.exports = router;
