const { exec } = require("node:child_process");
const path = require("path");
const codeDirPath = path.join(__dirname, "..", "..", "bin", "codes");

const executeCpp = (fileId) => {
  let filePath = path.join(codeDirPath,fileId);
  let inputPath = path.join(codeDirPath,fileId,"input.txt");
  console.log("input-path:-",inputPath);
  return new Promise((resolve, reject) => {
    exec(
      `cd ${filePath} && g++ code.cpp && ./a.out < ${inputPath}`,
      (error, stdout, stderr) => {
        error && reject({ error, stderr });
        stderr && reject(stderr);
        resolve(stdout);
      }
    );
  });
};

module.exports = {
  executeCpp,
};
