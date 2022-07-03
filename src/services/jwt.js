const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");

class JwtHandling {
  async jwtSign(email, id, userType, expiresIn = "3d") { 
    try {
      //creation token
      const result = await jwt.sign({ email, userType, id }, //PAYLOAD
        process.env.JWT_SECRET  , { 
        expiresIn,//option
      });
      return { success: true, data: result };
    } catch (e) {
      console.log(e);
      return { success: false, data: null };
    }
  }
  jwtVerify = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json("undefined Bearer Authorization Header");
    }
    const token = authHeader.split(" ")[1]; //separation entre bearer et token

    if (token) {
      
      try {
        const { email, id, userType } = await jwt.verify(token, "branper"); //retreive email , id , usertype from token
        req.infos = { authEmail: email, authId: id, authRole: userType };
        return next(); //requete complete son chemin
      } catch (err) {
        return res.status(StatusCodes.UNAUTHORIZED).send("invalid token");
      }
    }
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send("undefined Bearer Authorization Header");
  };
}

module.exports = new JwtHandling();
