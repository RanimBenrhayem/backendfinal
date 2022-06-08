const roleModel = require('../models/role.model') 


class roleDao{

async findOneRoleById (id){
    {
        try{
const result = await roleModel.findById(id).exec()
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
}

async getAllRoles(){
    try {
        const Result = await roleModel.find().exec()
        return ({
            success : true ,
            data : Result
        })
    } catch (error) {
        console.log(error)
        return ({
            success : false ,
            data : null
        })
    }
}
async getRoleByName(name){
try {
    const find = await roleModel.findOne({
        name 

    }).exec()
    return ({
        success:true,
        data : find
    })
} catch (error) {
    console.log(error)
    return ({
        success : false ,
        data : null
    })
}
}

}
module.exports = new roleDao()