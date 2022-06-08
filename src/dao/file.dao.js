class FileDao {
  async findFileByFileName(gfs, fileName) {
    const file = gfs
      .find({
        filename: fileName,
      })
      .toArray(async (err, files) => {
        if (!files || files.length === 0) {
        }

        let bufs = [];
        let result;
        // gfs
        //   .openDownloadStreamByName(fileName)
        //   .on("data", (chunk) => {
        //     bufs.push(chunk);
        //   })
        //   .on("end", () => {
        //     const fbuf = Buffer.concat(bufs);
        //     result = fbuf.toString();
        //     return result
        //   });
        await gfs
          .openDownloadStreamByName(fileName)
          .on("file", (a) => console.log(a));

        // console.log(   gfs.stream())
      });
  }
}
module.exports = new FileDao();
