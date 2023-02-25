const Job = require("../models/Job")

const getJobById = async(id)=>{
    return await Job.findById(id);
}
const createJob = async(language,filepath,problemId)=>{
    return await new Job({ language, filepath,problemId }).save()
}
const updateJob = async({
    jobId,
    startedAt,
    completedAt,
    output,
    status
})=>{
    console.log(jobId)
    console.log(startedAt)
    console.log(completedAt)
    console.log(output)
    console.log(status)
    return await Job.findByIdAndUpdate(jobId,{
        startedAt:startedAt,
        completedAt:completedAt,
        output:output,
        status:status
    })
}
module.exports={
    getJobById,
    createJob,
    updateJob
}