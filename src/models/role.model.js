const mongoose = require('mongoose')
//le modele "roles" de la base Mango
const schema = new mongoose.Schema({
    name : String
})
const Model = mongoose.model('roles', schema); //nom du model : roles

module.exports =Model