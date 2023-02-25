const judge = async (output,expOutput)=>{
    output = output.trim();
    expOutput = expOutput.trim();
    console.log("Your output:-\n",output);
    console.log("Judge output:-\n",expOutput);
    return output==expOutput ?  "Correct" :"wrong";
}

module.exports = {
    judge
}