const alasql = require("alasql");
const path = require("path");
const crypto = require("crypto");

async function joinFiles(file1Name, file2Name, attribut1, attribut2) {
  try {
    console.log(attribut1,attribut2,)
    console.log(file1Name)
    console.log(file2Name)
    const crypted = await crypto.randomBytes(16).toString("hex");
    const result = await alasql.promise(
      // `SELECT * FROM CSV('${file1Name}' ) AS File1 , CSV('${file2Name}') AS File2 WHERE File1.${attribut1} = File2.${attribut2} `
      `SELECT * [except ${attribut1}] FROM  CSV('${file1Name}') AS File1 ,  CSV('${file2Name}') AS File2 WHERE File1.${attribut1} = File2.${attribut2} `
      // `SELECT * [except File1.${attribut1}] FROM CSV('${file1Name}') AS File1 RIGHT JOIN  CSV('${file2Name}') AS File2 ON File1.${attribut1} = File2.${attribut2} `

    );
    console.log(result);
    const toCsv = await alasql.promise(
      `SELECT * INTO CSV ("./${crypted}.csv",{headers:true} ) FROM ?`,
      [result]
    );
    // return res.attachment(path.resolve(path.join(__dirname,".." ,".." , `${crypted}.csv`))).sendFile(path.resolve(path.join(__dirname,".." ,".." , "my.csv")))
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
