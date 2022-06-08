const mongoose = require("mongoose");

//le modele "dislikes" de la base Mongo
const dislikeschema = new mongoose.Schema({
  commentId: { type: mongoose.Schema.Types.ObjectId, ref: "comments" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  createdAt: Date,
});

const dislikeModel = mongoose.model("dislikes", dislikeschema);
module.exports = dislikeModel;
