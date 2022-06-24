const mongoose = require('mongoose')
//le modele "joinfiles table" de la base Mango
const schema = new mongoose.Schema({
    fileId:  mongoose.Schema.Types.ObjectId ,
    attribut1 :String,
    attribut2:String,
    typeOfDashboard : String ,
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    isJoined:Boolean,
    alertId: {type:mongoose.Schema.Types.ObjectId , ref :'alert'}
    

    


    
})
const Model = mongoose.model('chart', schema); 

module.exports =Model