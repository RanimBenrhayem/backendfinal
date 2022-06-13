const express = require("express"); //'express' c'est le package deja installé
const cors = require('cors') //pour que le serveur accepte la requete qui vient du port 3000
const mongoose = require("mongoose");
const userRouter = require("./routers/user.router");
const adminRouter = require('./routers/admin.router')
require("dotenv").config()
const uploadRouter = require("./routers/upload.router")
const commentsRouter = require("./routers/comments.router");
const chartRouter = require("./routers/chart.router")
const password = require("./routers/passwordf.router")

const app = express(); //instance d'express nommé app

app.use(cors())
app.use(express.json())
app.use("/user", userRouter); 
app.use("/uploads" , uploadRouter)
app.use('/admin',adminRouter)
app.use("/comments", commentsRouter);
app.use("/password" , password)
app.use("/chart" , chartRouter)

const mongoURI = process.env.database_uri;


//database connexion
 mongoose
  .connect(
    process.env.database_uri
  )
  .then(
    () => {
      console.log("Database connected ");
    },
    (err) => {
      console.log("error   " , err);
    }
  );
  


const conn = mongoose.createConnection(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  // init gfs
let gfs ;
let gfsJoin;
conn.once("open", () => {
  // init stream
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "uploads"
  });
  gfsJoin = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "join"
  });
  app.locals.gfs=gfs;
  app.locals.gfsJoin = gfsJoin;
});

//Demarrage serveur
app.listen(8080, () => {
  console.log("server started on port 8080");
});
