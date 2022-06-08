const mongoose = require("mongoose");

//le modele "likes" de la base Mongo
const likeschema = new mongoose.Schema({
  commentId: { type: mongoose.Schema.Types.ObjectId, ref: "comments" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  createdAt: Date,
});

const likeModel = mongoose.model("likes", likeschema);
module.exports = likeModel;
