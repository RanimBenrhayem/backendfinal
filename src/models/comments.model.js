const mongoose = require("mongoose");

//le modele "comments" de la base Mongo
const commentsschema = new mongoose.Schema(
  {
    topic: String,
    content: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    createdAt: Date,
  }

 
);

const commentsModel = mongoose.model("comments", commentsschema);
module.exports = commentsModel;
