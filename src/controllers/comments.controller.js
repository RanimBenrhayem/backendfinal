const commentDao = require("../dao/comment.dao");

const userDao = require("../dao/user.dao");
const userModel = require("../models/user.model");
const mongoose = require("mongoose");
const commentsModel = require("../models/comments.model");
const { StatusCodes } = require("http-status-codes");

class commentsController {
  async addComment(req, res) {
    try {
      const { topic, content } = req.body;
      const userId = req.infos.authId;
      //const createdAt = Date.now().toISOString();
      const comment = new commentsModel({
        topic,
        content,
        userId,
        createdAt: Date.now(),
      });
      await comment.save();
      return res.status(StatusCodes.CREATED).json("Comment Added Successfully !");
    } catch (error) {
      return error;
    }
  }
  async commentslist(req, res, next) {
    const result = await commentsModel.find().populate("userId").exec();
    return res.status(StatusCodes.OK).json(result);
  }
  async deletecomment(req, res, next) {
    try {
      const result = await commentsModel
        .findById(req.params.id)
        .populate("userId")
        .exec();
      if (!result) {
        return res.status(StatusCodes.NOT_FOUND).json("Comment not found");
      }
      if (result.userId._id.toString() !== req.infos.authId) {
        return res
          .status(StatusCodes.FORBIDDEN)
          .json("Cannot delete this comment");
      }
      const deleteResult = await commentsModel
        .findByIdAndRemove(req.params.id)
        .exec();
      return res.status(StatusCodes.OK).json( "Comment Deleted Successfully !" );
    } catch (e) {
      console.log(e);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e.toString());
    }
  }
  

  async getCommentById(req, res, next) {
    try {
      const comById = await commentDao.findComById(req.params.id);
      if (comById.success === false) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json("Can not get comments ");
      }
      if (!comById.data) {
        return res.status(StatusCodes.NOT_FOUND).json("Comment not found");
      }

      return res.status(StatusCodes.OK).json(comById.data);
    } catch (error) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json("Error..please try again");
    }
  }
  async getCommentByUser(req, res, next) {
    try {
      await commentsModel
        .find({ userId: req.infos.authId })
        .populate("userId") //get the attributs of the user

        .then((comments) => {
          res.status(200).json(comments);
        });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
}

module.exports = new commentsController();
