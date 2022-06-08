const bcrypt = require('bcrypt');
const saltRounds = 10; //10 represente de degré de complexité de encrypted password

class PasswordService {

    async encryption (password){
        try {
            const encryptedPassword = await bcrypt.hash(password,saltRounds)
            return ({
                success : true,
                data : encryptedPassword
            })


        } catch (error) {
            return ({
                sucess : false,
                data : null
            })
            
        }

    }

async decryption (encryptedPassword,password){
 try {
    const decryptedPassword = await bcrypt.compare(password,encryptedPassword) 
    return ({
        success : true ,
        data : decryptedPassword
    })





 } catch (error) {
     return ({
         success : false ,
         data : null
     })
 }


}








}
module.exports = new PasswordService()