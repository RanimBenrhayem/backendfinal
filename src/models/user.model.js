const mongoose = require("mongoose");
//le modele "user" de la base Mongo
const schema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  firstName: String,
  lastName: String,
  phoneNumber: { type: String, unique: true },
  roleId: { type: mongoose.Schema.Types.ObjectId, ref: "roles" },
  resetToken: String,
  expireToken: Date,

});
const Model = mongoose.model("user", schema); //nom du model : user

module.exports = Model;
