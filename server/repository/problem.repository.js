const Problem = require("../models/problem")

const getProblem = async (id) => {
    return await Problem.findById(id);
}
const getAllProblems=async()=>{
    return await Problem.find({});
}

const setProblem = async (statement,output,input)=>{
    return await new Problem({statement,output,input}).save();
}
module.exports={
    getProblem,
    setProblem,
    getAllProblems
}