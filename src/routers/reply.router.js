/*const express = require("express");
const router = express.Router();
const replyController = require("../controllers/reply.controller");
const adminGuard = require("../guards/admin.guard");
const jwtHandling = require("../services/jwt");
router.post(
  "/:id?/addreply",
  //[jwtHandling.jwtVerify, adminGuard],
  replyController.addReply
);
router.post(
  "/addreply",
  [jwtHandling.jwtVerify, adminGuard],
  replyController.addReply
);
//router.post("/newpassword", replyController.newpassword);
router.get("/replies", replyController.getReplies);

module.exports = router;*/
