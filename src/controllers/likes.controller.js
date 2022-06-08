const likeModel = require("../models/like.model");
const dislikeModel = require("../models/dislike.model");

const commentDao = require("../dao/comment.dao");
const { StatusCodes } = require("http-status-codes");

class likesController {
  async addlike(req, res) {
    try {
      // const userId = req.infos.authId;
      const commentId = await commentDao.findComById(req.params.id);
      const like = new likeModel({
        // userId,
        commentId: commentId.data._id,
        createdAt: Date.now(),
      });

      await like.save((err, likeResult) => {
        if (err) return res.json({ success: false, err });
        //In case Like Button is already clicked, we need to decrease the like by 1
        dislikeModel.findOneAndDelete(commentId).exec();
      });

      return res.status(StatusCodes.CREATED).json("You liked this comment.");
    } catch (error) {
      return error;
    }
  }
  async unlike(req, res) {
    try {
      //const userId = req.params.userId;
      const commentId = await commentDao.findComById(req.params.id);
      likeModel
        .findOneAndRemove(
          commentId
          //userId: req.params.userId,
        )
        .exec((err, likeResult) => {
          if (err) return res.status(400).json({ success: false, err });
          res.status(200).json({ success: true });
        });
    } catch (error) {
      return error;
    }
  }
  //c bon
  async getlikes(req, res) {
    try {
      const commentId = await commentDao.findComById(req.params.id);
      likeModel
        .find(commentId)
        .populate("commentId")
        .exec((err, likes) => {
          if (err) return res.status(400).send(err);
          res.status(200).json({ success: true, likes });
        });
    } catch (error) {
      return error;
    }
  }
}
module.exports = new likesController();
