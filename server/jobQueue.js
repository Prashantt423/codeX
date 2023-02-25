const Queue = require("bull");
const jobRepository = require("./repository/job.repository");
const { execute } = require("./functions/execute/execute.main");
const { getProblem } = require("./repository/problem.repository");
const { judge } = require("./judge");
// const { addDeleteJobToQueue } = require("./functions/deleteQueue");

const jobQueue = new Queue("job-runner-queue",{
  redis:{
    host:process.env.REDIS_HOST || "redis",
    port:process.env.REDIS_PORT || 6379,
  }
});
const NUM_WORKERS = 5;

jobQueue.process(NUM_WORKERS, async ({ data }) => {
  console.log(data)
  const jobId = data.id;
  const job = await jobRepository.getJobById(jobId);
  const problem = await getProblem(job.problemId);
  console.log(job);
  console.log(problem);
  if (job === undefined) {
    throw Error(`cannot find Job with id ${jobId}`);
  }
  let startedAt,completedAt,output;
  try {
    startedAt = new Date();
    output = await execute(job.filepath,job.language,job.input);
    output = await judge(output,problem.output);
    let completedAt = new Date();
    let status = "success";
    await jobRepository.updateJob({jobId,startedAt,completedAt,output,status});
    return true;
  } catch (err) {
    completedAt= new Date();
    output = JSON.stringify(err.stderr);
    let status = "error";
    await jobRepository.updateJob({jobId,startedAt,completedAt,output,status});
    throw Error(JSON.stringify(err));
  }
});

jobQueue.on("failed", (error) => {
  console.error(error.data.id, error.failedReason);
});
jobQueue.on("completed", (job) => {
  console.error("Job completed:- ",job.id);
});

const addJobToQueue = async (jobId) => {
  console.log("new Job:-",jobId);
   jobQueue.add({
    id: jobId,
  });
};

module.exports = {
  addJobToQueue,
};
