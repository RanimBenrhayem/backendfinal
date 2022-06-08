const dislikeModel = require("../models/dislike.model");
const likeModel = require("../models/like.model");

const commentDao = require("../dao/comment.dao");
const { StatusCodes } = require("http-status-codes");

class dislikesController {
  async adddislike(req, res) {
    try {
      const userId = req.infos.authId;
      const commentId = await commentDao.findComById(req.params.id);
      const dislike = new dislikeModel({
        userId,
        commentId: commentId.data._id,
        createdAt: Date.now(),
      });

      await dislike.save((err, result) => {
        if (err) return res.json({ success: false, err });
        //In case Like Button is already clicked, we need to decrease the dislike by 1
        likeModel.findOneAndDelete(commentId).exec();
      });

      return res.status(StatusCodes.CREATED).json("You disliked this comment.");
    } catch (error) {
      return error;
    }
  }
  async undislike(req, res) {
    try {
      const userId = req.infos.authId;
      const commentId = await commentDao.findComById(req.params.id);
      dislikeModel.findOneAndRemove(commentId).exec((err, result) => {
        if (err) return res.status(400).json({ success: false, err });
        res.status(200).json({ success: true });
      });
    } catch (error) {
      return error;
    }
  }
  async getdislikes(req, res) {
    try {
      const commentId = await commentDao.findComById(req.params.id);
      dislikeModel.find(commentId).exec((err, dislikes) => {
        if (err) return res.status(400).send(err);
        res.status(200).json({ success: true, dislikes });
      });
    } catch (error) {
      return error;
    }
  }
  async getDislikesByComment(req, res, next) {
    try {
      const commentId = await commentDao.findComById(req.params.id);
      dislikeModel
        .find(commentId)
        .populate("commentId")
        .exec((err, dislikes) => {
          if (err) return res.status(400).send(err);
          res.status(200).json({ success: true, dislikes });
        });
    } catch (error) {
      return error;
    }
  }
}
module.exports = new dislikesController();
