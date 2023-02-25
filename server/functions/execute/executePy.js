const { exec } = require("child_process");

const executePy = (filepath) => {
  console.log(filepath);
  const cmd = `python ${filepath}`;
  console.log("cmd",cmd)
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      error && reject({ error, stderr });
      stderr && reject(stderr);
      resolve(stdout);
    });
  });
};

module.exports = {
  executePy,
};
