const mongoose = require('mongoose')
//le modele "joinfiles table" de la base Mango
const schema = new mongoose.Schema({
    operator :{
        type : String,
        enum : ['=','>','<','>=','<='],
        default:"="
    },
    attribute:String,
    value: String

})
const Model = mongoose.model('alert', schema); //nom du model : joinfiles

module.exports =Model