const mongoose = require("mongoose");

//le modele "comments" de la base Mongo
const replyschema = new mongoose.Schema({
  text: String,
  commentId: { type: mongoose.Schema.Types.ObjectId, ref: "comments" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  createdAt: Date,
});

const replyModel = mongoose.model("replies", replyschema);
module.exports = replyModel;
