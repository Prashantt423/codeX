const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");
const dirCodes = path.join(__dirname, "..", "bin", "codes");

if (!fs.existsSync(dirCodes)) {
  console.log("directory created\n",dirCodes);
  fs.mkdirSync(dirCodes, { recursive: true });
}

const generateFile = async (format, content="",input="") => {
  const jobId = uuid();
  const jobDir = path.join(dirCodes,jobId);
  if (!fs.existsSync(jobDir)) {
    console.log("Created files in \n",jobDir);
    fs.mkdirSync(jobDir, { recursive: true });
  }
  const codePath = path.join(jobDir, `code.${format}`);
  const inputPath = path.join(jobDir, "input.txt");
  await fs.writeFileSync(codePath, content);
  await fs.writeFileSync(inputPath, input);
  console.log(jobId);
  return jobId;

};

module.exports = {
  generateFile,
};
