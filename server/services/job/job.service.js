const { generateFile } = require("../../functions/generateFile");
const jobRepository = require("../../repository/job.repository")
const {addJobToQueue} =  require("../../jobQueue");
const { getProblem } = require("../../repository/problem.repository");
const getStatus= async (req, res) => {
        const jobId = req.query.id;
      
        if (jobId === undefined) {
          return res
            .status(400)
            .json({ success: false, error: "Missing id query param" });
        }
      
        const job = await jobRepository.getJobById(jobId);
      
        if (job === undefined) {
          return res.status(400).json({ success: false, error: "Couldn't find job" });
        }
      
        return res.status(200).json({ success: true, job });
}

const runCode = async (req,res) => {
  const { language = "cpp", code,problemId} = req.body;
  if (code === undefined) {
    return res.status(400).json({ success: false, error: "Empty code body!" });
  }
  console.log(language, "Length:", code.length);
  const problem = await getProblem(problemId);
  // need to generate file with content from the request
  const filepath = await generateFile(language, code,problem.input);
  // write into DB
  const job = await jobRepository.createJob(language,filepath,problemId);

  const jobId = job["_id"];

  // process the execution
  addJobToQueue(jobId);

  res.status(201).json({ jobId });
}

module.exports ={
  getStatus,
  runCode
}