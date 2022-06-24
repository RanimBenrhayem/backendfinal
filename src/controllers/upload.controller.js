const { StatusCodes } = require("http-status-codes");
const userDao = require("../dao/user.dao");
const mongoose = require("mongoose");

class UploadController {
  // id file table is added into user table (function upload is in uploadservice.js , it is send in the parametre de router )
  async uploadProcess(req, res) {
    try {


        return res.status(StatusCodes.OK).json("file uploaded successfully, you can now check your files list");
      
      
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

  downloadFileById(req,res){

    const gfs = req.app.locals.gfs;
  
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

        gfs.openDownloadStream(mongoose.Types.ObjectId(req.params.id)).pipe(res); //get the content of the file
      });
  }
  

   getFileById(req,res){
    const gfs = req.app.locals.gfs;
      const file = gfs
      .find({
       _id: mongoose.Types.ObjectId(req.params.id),
       "metadata.userId" : req.infos.authId
      })
     return file.forEach(doc => res.json(doc));
    }


  //delete file from file table and user table
  async deleteFileFromDB(req, res) {
    const gfs = req.app.locals.gfs;
    const  userId  =req.infos.authId;
  
    const file = gfs
      .find({
        _id: mongoose.Types.ObjectId(req.params.id),
        "metadata.userId" : userId
      })
      .toArray((err, files) => {
        if (!files || files.length === 0) {
          return res.status(404).json({
            err: "no files exist",
          });
        }
        gfs.delete(files[0]._id, (err, data) => {
          if (err) return res.status(404).json({ err: err.message });

          return res.status(StatusCodes.OK).json("file deleted successfully!");
        });
      });
  }

getUserSingleFiles(req,res){
const gfs = req.app.locals.gfs; //defini dans index.js
const userId =  req.infos.authId;
const file = gfs.find({
"metadata.userId" :  userId }).toArray((err,files)=>res.status(StatusCodes.OK).json(files))
}}


module.exports = new UploadController();
