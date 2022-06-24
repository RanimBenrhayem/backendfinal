const commentsModel = require("../models/comments.model"); //importation du model

class comDao {
  //recherche commentaire par id
  async findComById(id) {
    try {
      const result = await commentsModel.findById(id).exec();
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        data: null,
      };
    }
  }

  async findByUserId (userId) {
    try{
      const comments = await  commentsModel.find({userId:userId},{_id:1}).exec() //retour que id user (nommé projection)
      return {success:true,data:comments}
    }catch (e) {
      console.log(e)
      return {success:false,data:null}
    }
  }
  async deleteAllCommentsOfAUser(commentIds) { 
    try{
      const comments = await commentsModel.deleteMany({_id : {$in:commentIds}}).exec()
      return {success:true}
    }catch (e) {
      console.log(e)
      return {success:false}
    }
  }
}
module.exports = new comDao();