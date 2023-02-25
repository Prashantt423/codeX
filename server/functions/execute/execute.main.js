const { executeCpp } = require("./executeCpp");
const { executePy } = require("./executePy");

const execute = async (filepath,lang)=>{
    switch (lang) {
        case "cpp":
            return await executeCpp(filepath);
        case "py":
           return await executePy(filepath);
        default:
            break;
    }
}

module.exports ={
    execute
}