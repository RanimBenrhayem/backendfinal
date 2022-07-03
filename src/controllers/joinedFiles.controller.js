const joinedFilesModel = require("../models/joinFiles.model");
const fileDao = require("../dao/file.dao");
const { StatusCodes } = require("http-status-codes");
const join = require("../services/join");
const { default: mongoose } = require("mongoose");
const path = require("path");

class JoinedFilesContollers {
  async joinProcess(req, res) {
    try {
      const { fileName1, fileName2, attribut1, attribut2 } = req.body;
      const gfs = req.app.locals.gfs;
      let bufs = [];
      let result;
      let result2;
      let file1;
      let file2;
      const userId = req.infos.authId;

      const file = gfs
        .find({
          _id: mongoose.Types.ObjectId(fileName1),
          // "metadata.userId" :  userId
        })
        .toArray((err, files) => {
          if (!files || files.length === 0) {
            return res
              .status(StatusCodes.NOT_FOUND)
              .json(` File with this name : ${fileName1} not found`);
          }
          file1 = files[0].metadata.originalFileName; 

          gfs
            .openDownloadStream(mongoose.Types.ObjectId(fileName1))
            .on("data", (chunk) => { //on data : le fichier arrive dans des parties
              bufs.push(chunk);      //mettre le fichier dans le tableau bufs
            })
            .on("end", () => {   // une fois terminée
              const fbuf = Buffer.concat(bufs); 
              result = fbuf.toString();
              bufs = [];
              const find = gfs
                .find({
                  _id: mongoose.Types.ObjectId(fileName2),
                  "metadata.userId": userId,
                })
                .toArray((err, files) => {
                  if (!files || files.length === 0) {
                    return res
                      .status(StatusCodes.NOT_FOUND)
                      .json(` File with this name : ${fileName2} not found`);
                  }
                  file2 = files[0].metadata.originalFileName;

                  gfs
                    .openDownloadStream(mongoose.Types.ObjectId(fileName2))
                    .on("data", (chunk) => bufs.push(chunk))
                    .on("end", async () => {
                      const fbuf2 = Buffer.concat(bufs);
                      result2 = fbuf2.toString();
                     
                      const joinedFile = await join(
                        result,
                        result2,
                        attribut1,
                        attribut2
                      );
                      if (joinedFile.success === false) {
                        return res
                          .status(StatusCodes.INTERNAL_SERVER_ERROR)
                          .json("join failed !");
                      }
                      
                      const deleteColumn = joinedFile.data.joinedResult.map(
                        (element) => {
                          const { [attribut1]: toDelete, ...others } = element;
                          return others;
                        }
                      );
                     
                      return res
                        .attachment(joinedFile.data.joinedFileName) //return filename
                        .json({
                          joinedResult: deleteColumn,
                          originalFileName: `${file1}_${file2}_with_${attribut1}_${attribut2}.csv`,
                        });
                   
                    });
                });
            });
        });
    } catch (error) {
      console.log(error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
  }
  async saveJoinedFilesIntoDataBase() {
    const joined = await join(file1Name, file2Name, attribut1, attribut2);
    const joinedModel = new joinedFilesModel({
      fileName1,
      fileName2,
      attribut1,
      attribut2,
      fileName: success.data.joinedFileName,
    });
    await joinedModel.save();

    return res
      .status(StatusCodes.CREATED)
      .json("Joined File uploaded successfully");
  }
  catch(error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json("error during the join .. please try again");
  }

  async deleteJoinedFileFromDB(req, res) {
    const gfsjoin = req.app.locals.gfsJoin;
    if (req.infos.role == "admin") {
      const file = gfsjoin
        .find({
          _id: mongoose.Types.ObjectId(req.params.id),
        })
        .toArray((err, files) => {
          if (!files || files.length === 0) {
            return res.status(404).json({
              err: "No files exist",
            });
          }
          console.log(files[0]._id);
          gfsjoin.delete(files[0]._id, (err, data) => {
            if (err) return res.status(404).json({ err: err.message });

            return res
              .status(StatusCodes.OK)
              .json("File deleted successfully!");
          });
        });
    } else {
      const file = gfsjoin
        .find({
          _id: mongoose.Types.ObjectId(req.params.id),
          "metadata.userId": req.infos.authId,
        })
        .toArray((err, files) => {
          if (!files || files.length === 0) {
            return res.status(404).json({
              err: "No files exist",
            });
          }
          console.log(files[0]._id);
          gfsjoin.delete(files[0]._id, (err, data) => {
            if (err) return res.status(404).json({ err: err.message });

            return res
              .status(StatusCodes.OK)
              .json("File deleted successfully!");
          });
        });
    }
  }
  getJoinedFilesById(req, res) {
    const gfs = req.app.locals.gfsJoin;
    let fileInfo;
    if (req.infos.role == "admin") {
      const file = gfs.find({
        _id: mongoose.Types.ObjectId(req.params.id),
      });
      return file.forEach((doc) => res.json(doc));
    } else {
      const file = gfs.find({
        _id: mongoose.Types.ObjectId(req.params.id),
        "metadata.userId": req.infos.authId,
      });
      return file.forEach((doc) => res.json(doc));
    }
  }

  getUserJoinedFiles(req, res) {
    const gfs = req.app.locals.gfsJoin;

    const userId = req.infos.authId;
    const file = gfs
      .find({
        "metadata.userId": userId,
      })
      .toArray((err, files) => res.status(StatusCodes.OK).json(files));
  }

  downloadJoinedFileById(req, res) {
    const gfs = req.app.locals.gfsJoin;
   
      const file = gfs
        .find({
          _id: mongoose.Types.ObjectId(req.params.id),
          "metadata.userId": req.infos.authId,
        })
        .toArray((err, files) => {
          if (!files || files.length === 0) {
            return res.status(404).json({
              err: "No files exist",
            });
          }

          gfs
            .openDownloadStream(mongoose.Types.ObjectId(req.params.id))
            .pipe(res);
        });
    }
  }


module.exports = new JoinedFilesContollers();
