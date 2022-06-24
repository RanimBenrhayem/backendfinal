const alasql = require("alasql");
const path = require("path");
const crypto = require("crypto");

async function joinFiles(file1Name, file2Name, attribut1, attribut2) {
  try {

    const crypted = await crypto.randomBytes(16).toString("hex");
    const result = await alasql.promise(
      
      `SELECT * [except ${attribut1}] FROM  CSV('${file1Name}') AS File1 ,  CSV('${file2Name}') AS File2 WHERE File1.${attribut1} = File2.${attribut2} `
     
    );

    return {
      success: true,
      data: {
        joinedFileName: `${crypted}.csv`,
        joinedResult: result,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      data: null,
    };
  }
}

module.exports = joinFiles;
