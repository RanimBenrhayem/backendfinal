const express = require("express");
const router = express.Router();
const commentsController = require("../controllers/comments.controller");
const adminGuard = require("../guards/admin.guard");
const jwtHandling = require("../services/jwt");
const replyController = require("../controllers/reply.controller");
const likesController = require("../controllers/likes.controller");
const dislikesController = require("../controllers/dislikes.controller");

router.post(
  "/:id?/addlike",
  //[jwtHandling.jwtVerify, adminGuard],
  likesController.addlike
);
router.post(
  "/:id?/unlike", // /:userId?,
  //[jwtHandling.jwtVerify, adminGuard],
  likesController.unlike
);

router.get("/getdislikesbycom/:id?", dislikesController.getDislikesByComment);

router.post(
  "/:id?/undislike",
  [jwtHandling.jwtVerify, adminGuard],
  dislikesController.undislike
);
router.get("/:id?/getdislikes", dislikesController.getdislikes);
router.get(
  "/:id?/getlikes",
  [jwtHandling.jwtVerify, adminGuard],
  likesController.getlikes
);

router.post(
  "/:id?/adddislike",
  [jwtHandling.jwtVerify, adminGuard],
  dislikesController.adddislike
);

router.get("/replies", replyController.getReplies);
router.get("/:id?/getreply", replyController.getRepliesForEachComment);

router.post(
  "/:id?/addreply",
  //[jwtHandling.jwtVerify, adminGuard],
  replyController.addReply
);
router.post(
  "/addcomment/",
  [jwtHandling.jwtVerify, adminGuard],
  commentsController.addComment
);
router.post(
  "/deletecomment/:id",
  [jwtHandling.jwtVerify, adminGuard],
  commentsController.deletecomment
);
router.get(
  "/getcomment",
  [jwtHandling.jwtVerify, adminGuard],
  commentsController.commentslist
);
router.put(
  "/updatecomment/:id",
  [jwtHandling.jwtVerify, adminGuard],
  commentsController.updatecomment
);
/*router.get(
  "/getCommentByUserName/:userId",
  [jwtHandling.jwtVerify, adminGuard],
  commentsController.getCommentByUserName
);*/
router.get(
  "/:id?/getCommentById",

  commentsController.getCommentById
);
router.get(
  "/getCommentByUser/:userId?",
  [jwtHandling.jwtVerify, adminGuard],
  commentsController.getCommentByUser
);
module.exports = router;
