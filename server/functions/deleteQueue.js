const Queue = require("bull");
const path = require("path");
const { exec } = require("node:child_process");
const deleteQueue = new Queue("job-runner-queue",{
  redis:{
    host:process.env.REDIS_HOST || "redis",
    port:process.env.REDIS_PORT || 6379,
  }
});
const NUM_WORKERS = 5;

deleteQueue.process(NUM_WORKERS, async ({data}) => {
  const {code,extension} = data;
  let ex ;
  if(extension==="java"){
    ex="class";
  }
  if(extension==="cpp"){
    ex="exe";
  }
  const file1Path = path.join(`${code}.${extension}`);
  const file2Path = extension!="py"? path.join(`${code}.${ex}`):"";
  console.log("file1",file1Path);
  console.log("file2",file2Path);
  const cmd = (extension!="py") ? `rm ${file1Path} ${file2Path}` : `rm ${file1Path}` 
  try {
      exec(cmd, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        
    });    
    return true;
  } catch (err) {
    throw Error(JSON.stringify(err));
  }
});

deleteQueue.on("failed", (error) => {
  console.error(error.data.id, error.failedReason);
});
deleteQueue.on("completed", (job) => {
  console.log(`Deleted ${job.data.code}`);
});

const addDeleteJobToQueue = async (filePath) => {
  console.log("Deleted!")
  console.log(filePath)
  let file = filePath.split(".");
  let code = file[0];
  let extension = file[1];
  console.log(file);
  console.log("new Job:-",file);
  deleteQueue.add({
    code:code,
    extension:extension
  });
};

module.exports = {
  addDeleteJobToQueue,
};
