const { getProblem, setProblem, getAllProblems } = require("../../repository/problem.repository")

const addQuestion = async (req, res) => {
    console.log(req.body);
    const {statement,input,output} = req.body;
    const problem = await setProblem(statement,output,input);
    res.status(201).json({ problem });
}

const getAllQuestions = async(req,res)=>{
  const problems = await getAllProblems();
  res.status(201).json({problems});
}
const getQuestion = async (req, res) => {
  
    const problem =  await getProblem(req.query.id);
    res.status(201).json({ problem });
}
module.exports ={
  addQuestion,
  getQuestion,
  getAllQuestions
}