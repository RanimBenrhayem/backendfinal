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
}
module.exports = new comDao();
