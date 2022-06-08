const mongoose = require("mongoose");
//le modele "joinfiles table" de la base Mango
const schema = new mongoose.Schema({
  file1Name: String,
  file2Name: String,
  attribut1: String,
  attribut2: String,
});
const Model = mongoose.model("joinfiles", schema); //nom du model : joinfiles

module.exports = Model;
