const { StatusCodes } = require("http-status-codes");
const userDao = require("../dao/user.dao");
const mongoose = require("mongoose");

class UploadController {
  // id file table is added into user table (function upload is in uploadservice.js , it is send in the parametre de router )
  async uploadProcess(req, res) {
    try {
      //console.log(req)
      //  const fileName = req.info.fileName ;
      // console.log(req.info)
      // return res.json(req.file)
      // const originaleFileName = req.info.originaleFileName;
     // const userId = req.params.userId;
      // const { success } = await userDao.addFileIntoTable(userId, req.file.id);



        return res.status(StatusCodes.OK).json("file uploaded successfully");
      
      
    } catch (error) {
      console.log(error);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json("error occurred while uploading file , please try again!!!");
    }
  }
  //return fileuploaded (table)
  async getFileByFileName(req, res) {
    const gfs = req.app.locals.gfs;
    if(req.infos.role == "admin") {
      const file = gfs
      .find({
        filename: req.params.filename,
      })
      .toArray((err, files) => {
        if (!files || files.length === 0) {
          return res.status(404).json({
            err: "no files exist",
          });
        }

        gfs.openDownloadStreamByName(req.params.filename).pipe(res);
      });
    } else {
      const file = gfs
      .find({
        filename: req.params.filename,
        "metadata.userId" : req.infos.authId
      })
      .toArray((err, files) => {
        if (!files || files.length === 0) {
          return res.status(404).json({
            err: "no files exist",
          });
        }

        gfs.openDownloadStreamByName(req.params.filename).pipe(res);
      });
    }
    
  }

  downloadFileById(req,res){

    const gfs = req.app.locals.gfs;
    if(req.infos.role == "admin") {
      const file = gfs
      .find({
       _id: mongoose.Types.ObjectId(req.params.id)
      })
      .toArray((err, files) => {
        if (!files || files.length === 0) {
          return res.status(404).json({
            err: "no files exist",
          });
        }

        gfs.openDownloadStream(mongoose.Types.ObjectId(req.params.id)).pipe(res);
      });
    }else {
      const file = gfs
      .find({
       _id: mongoose.Types.ObjectId(req.params.id),
       "metadata.userId" : req.infos.authId
      })
      .toArray((err, files) => {
        if (!files || files.length === 0) {
          return res.status(404).json({
            err: "no files exist",
          });
        }

        gfs.openDownloadStream(mongoose.Types.ObjectId(req.params.id)).pipe(res);
      });
    }
    
  }
  

   getFileById(req,res){
    const gfs = req.app.locals.gfs;
    let fileInfo;
    if(req.infos.role== "admin") {
      const file = gfs
      .find({
       _id: mongoose.Types.ObjectId(req.params.id),
      })
     return file.forEach(doc => res.json(doc));
    } else {
      const file = gfs
      .find({
       _id: mongoose.Types.ObjectId(req.params.id),
       "metadata.userId" : req.infos.authId
      })
     return file.forEach(doc => res.json(doc));
    }
   

  }

  

  //delete file from file table and user table
  async deleteFileFromDB(req, res) {
    const gfs = req.app.locals.gfs;
    const  userId  = req.infos.role == "admin" ?req.params.userId : req.infos.authId;
   // console.log(userId)
    //const result = await userDao.deleteAndUpdate(idUser, req.params.id);
    // if (result.success === false) {
    //   return res.status(StatusCodes.BAD_REQUEST).json(result.msg);
    // }
    const file = gfs
      .find({
        _id: mongoose.Types.ObjectId(req.params.id),
        "metadata.userId" : userId
      })
      .toArray((err, files) => {
        // console.log("aaaaaaaaaaaa")
        if (!files || files.length === 0) {
          return res.status(404).json({
            err: "no files exist",
          });
        }
        console.log(files[0]._id);
        gfs.delete(files[0]._id, (err, data) => {
          if (err) return res.status(404).json({ err: err.message });

          return res.status(StatusCodes.OK).json("file deleted successfully!");
        });
      });
  }

 getUserSingleFiles(req,res){
  const gfs = req.app.locals.gfs;

 const userId =  req.infos.role == "admin" ?req.params.userId : req.infos.authId;
 const file = gfs.find({
   "metadata.userId" :  userId }).toArray((err,files)=>res.status(StatusCodes.OK).json(files))
   // let responseArray=[]
 //file.toArray((files)=>console.log(files))
//const aa=  file.map(doc => {responseArray.push(doc)});
//file.on("data" , (a)=>console.log(a))
 //return res.status(StatusCodes.OK).json(responseArray)

}





}

module.exports = new UploadController();
