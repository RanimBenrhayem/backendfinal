const StatusCodes =  require ("http-status-codes");
const userModel = require ("../models/user.model")

 async  function userGuard  (req,res,next) {
    try{
        const {authEmail,authId,authRole} = req.infos ;
        console.log(authId)
        const userexists = await  userModel.findById(authId).populate('roleId').exec() ;
       
        if(!userexists) {
            return res.status(StatusCodes.NOT_FOUND).json("user not found")
        }
        console.log(userexists.roleId._id)
        if(authEmail!==userexists.email ||  authRole !== userexists.roleId._id.toString()) {
            return res.status(StatusCodes.FORBIDDEN).json("unathorized action1")
        }
        if(userexists.roleId.name == 'admin') {
            req.infos.role = "admin"
            return next();
        }
       
        req.infos.role = "user";
        return next();

    }catch(e){
console.log(e)
return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("error")
    }
}

module.exports = userGuard