const alertModel = require("../models/alert.model")

class AlertDao {

    async addAlert(attribute,value,operator) {
        try{
            const newAlert = new alertModel({attribute,value,operator})
            const result = await newAlert.save()
            return {success:true,data:result}
        }catch (e) {
            console.log(e)
            return {success:false,data:null}
        }
    }

    async deleteAlert(id) {
        try{
            const deleted = await alertModel.deleteOne({_id:id})
            return {success:true}

        }catch (e) {
            console.log(e)
            return {success:false}
        }
    }


}


module.exports = new AlertDao()