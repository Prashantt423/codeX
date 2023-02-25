const mongoose = require("mongoose");

const ProblemSchema = mongoose.Schema({
  statement:{
    type:String
  },
  output :{
    type:String
  },
  input:{
    type:String
  },
  
});

// default export
module.exports = mongoose.model("Problem", ProblemSchema);
