const replyModel = require("../models/reply.model");
const { StatusCodes } = require("http-status-codes");
const commentsModel = require("../models/comments.model");
const commentDao = require("../dao/comment.dao");

class replyController {
  //c bon
  async addReply(req, res) {
    try {
      const { text } = req.body;
      const commentId = await commentDao.findComById(req.params.id);
      //return res.status(StatusCodes.CREATED).json(commentId);
      //const userId = req.infos.authId;

      const reply = new replyModel({
        text,
        //userId,
        commentId: commentId.data._id,
        createdAt: Date.now(),
      });
      await reply.save();

      return res.status(StatusCodes.CREATED).json("added");
    } catch (error) {
      return error;
    }
  }
  //c bon
  async getRepliesForEachComment(req, res) {
    try {
      const commentId = await commentDao.findComById(req.params.id);
      await replyModel
        .find({ commentId: commentId.data.id })
        .populate("commentId")
        .populate("userId")

        .then((replies) => {
          res.status(200).json(replies);
        });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
  //c bon
  async getReplies(req, res, next) {
    const result = await replyModel
      .find()
      .populate("userId")
      .populate("commentId")
      .exec();
    return res.status(StatusCodes.OK).json(result);
  }
}
module.exports = new replyController();
