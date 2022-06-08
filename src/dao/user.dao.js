const userModel = require('../models/user.model') //importation du usermodel

class userDao {
//recherche user par id
    async findUserById(id) {
        try{
const result = await userModel.findById(id).exec()
return ({
    success : true ,
    data : result
})

        }catch(error){
            console.log(error)
            return ({
                success : false ,
                data : null
            })
        }
    }
    //recherche user par email
 async findUserByEmail (email){
     try {
        const result = await userModel.findOne({email: email}).exec();
        return ({
            success : true ,
            data : result
        })
     } catch (error) {
         console.log("error : ",error)
         return ({
            success : false ,
            data : null
        })
         
     }

 }

 //recherche user par numero de telephone
 async findUserByPhoneNumber (phoneNumber){
    try {
       const result = await userModel.findOne({phoneNumber : phoneNumber}).exec();
       return ({
           success : true ,
           data : result
       })
    } catch (error) {
        console.log("error : ",error)
        return ({
           success : false ,
           data : null
       })
        
    }
}
//added file into user table
async addFileIntoTable(userId,fileName){

    try {
        const user = await userModel.findById(userId).exec()
        if(user ) {
            user.uploadedFiles = [...user.uploadedFiles , fileName] 
            await user.save()
            return {success:true}
            
        }
    } catch (error) {
        console.log(error)
        return {success:false}
    }
}
//delete file from user table
    async deleteAndUpdate(idUser,id) {
       try {
           const user = await userModel.findById(idUser);
           if(user){
               const uploadedFiles = user.uploadedFiles;
               const newFilesArray = uploadedFiles.filter((element)=>element!==id)
               user.uploadedFiles = newFilesArray ;
               await user.save()
                return {success : true , msg : "file deleted from user"}
           }
           return {success:false , msg :"user not found"}
           
       } catch (error) {    
           console.log(error)
           return {success:false , msg:error.toString()}
           
       }
    }    





}





















module.exports = new userDao()