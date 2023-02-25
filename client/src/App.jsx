import "./App.scss";
import CodeMirror from "@uiw/react-codemirror";
import { dracula } from "@uiw/codemirror-theme-dracula";
import Header from "./header/Header";
import Functions from "./functions/Functions";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import moment from "moment";
import stubs from "./stubs";
function App() {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [jobId, setJobId] = useState(null);
  const [status, setStatus] = useState(null);
  const [jobDetails, setJobDetails] = useState(null);
  const [questions, setQuestions] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState("");
  const[disableSubmit,setDisable] = useState(false);
  const fetchQuestions = async () => {
    try {
      const { data } = await axios.get("/api/v1/problem/getAll");
      console.log(data.problems);
      setQuestions(data.problems);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    setCode(stubs[language]);
  }, [language]);

  useEffect(() => {
    const defaultLang = localStorage.getItem("default-language") || "cpp";
    setLanguage(defaultLang);
  }, []);

  let pollInterval;

  const handleSubmit = async () => {
    setDisable(true)
    if(selectedQuestion===undefined || selectedQuestion===""){
      setOutput("No selected problem.");
      setStatus("Bad request");
      clearInterval(pollInterval);
    }
    const payload = {
      language,
      code,
      problemId:selectedQuestion._id
    };
    console.log(jobId)
    try {
      setOutput("");
      setStatus(null);
      setJobId(null);
      setJobDetails(null);
      const { data } = await axios.post("/api/v1/job/run", payload);
      if (data.jobId) {
        setJobId(data.jobId);
        setStatus("Submitted.");

        // poll here
        pollInterval = setInterval(async () => {
          const { data: statusRes } = await axios.get(`api/v1/job/status`, {
            params: {
              id: data.jobId,
            },
          });
          const { success, job, error } = statusRes;
          console.log(statusRes);
          if (success) {
            const { status: jobStatus, output: jobOutput } = job;
            setStatus(jobStatus);
            setJobDetails(job);
            if (jobStatus === "pending") return;
            setOutput(jobOutput);
            setDisable(false)
            clearInterval(pollInterval);
          } else {
            console.error(error);
            setOutput(error);
            setStatus("Bad request");
            setDisable(false)
            clearInterval(pollInterval);

          }
        }, 1000);
      } else {
        setOutput("Retry again.");
      }
    } catch ({ response }) {
      if (response) {
        const errMsg = response.data.err.stderr;
        setOutput(errMsg);
      } else {
        setOutput("Please retry submitting.");
      }
    }
  };

  // const setDefaultLanguage = () => {
  //   localStorage.setItem("default-language", language);
  //   console.log(`${language} set as default!`);
  // };

  const renderTimeDetails = () => {
    if (!jobDetails) {
      return "";
    }
    let { submittedAt, startedAt, completedAt } = jobDetails;
    let result = "";
    submittedAt = moment(submittedAt).toString();
    // result += `Job Submitted At: ${submittedAt}  `;
    if (!startedAt || !completedAt) return result;
    const start = moment(startedAt);
    const end = moment(completedAt);
    const diff = end.diff(start, "seconds", true);
    result += `Execution Time: ${diff}s`;
    return <h1>{result}</h1>;
  };
  const renderQuestions = () => {
    return (
      <div
        style={{ display: "flex", flexDirection: "column", padding: "2rem" }}
      >
        {questions !== null && questions != undefined ? (
          questions?.map((question, index) => (
            <>
              <h1
                onClick={() => setSelectedQuestion(question)}
                style={{ margin: "1rem 0 1rem 0" }}
              >
                <a href="#" className="question">
                  {index + 1}.{question.statement.substring(0, 20)}...
                </a>
              </h1>
            </>
          ))
        ) : (
          <h1>Fetching questions...</h1>
        )}
      </div>
    );
  };
  
  const renderInput = () => {
    return (
      <div className="inputBox">
        <h1>
          <i>Input:-</i>
        </h1>
        <textarea
          name="quest"
          value={selectedQuestion.input}
          cols="10"
          rows="10"
          className="input"
        ></textarea>
      </div>
    );
  };
  const renderExpOutput = () => {
    return (
      <div className="inputBox">
        <h1>
          <i>Output:-</i>
        </h1>
        <textarea
          name="quest"
          value={selectedQuestion.output}
          cols="10"
          rows="10"
          className="input"
        ></textarea>
      </div>
    );
  };
  const renderProblemDescription = () => {
    return (
      <div className="problemDesc">
        <h1>
          <i>Statement</i>:- {selectedQuestion.statement}
        </h1>
        {renderInput()}
        {renderExpOutput()}
      </div>
    );
  };

  const renderCodeIde = () => {
    return (
      <div className="container">
        <div className="wrap">
          <Functions />
          {output === "" ? (
            renderProblemDescription()
          ) : (
          <>
            <textarea
              name="quest"
              value={output}
              cols="100"
              rows="10"
              style={{ color: status === "success" ? "green" : "red" }}
              className="left-half"
            ></textarea>
            {renderTimeDetails()}
          </>
          )
          
          }
        </div>

        <div className="right-half">
          <select
            value={language}
            onChange={(e) => {
              const shouldSwitch = window.confirm(
                "Are you sure you want to change language? WARNING: Your current code will be lost."
              );
              if (shouldSwitch) {
                setLanguage(e.target.value);
              }
            }}
          >
            <option value="cpp">C++</option>
            <option value="py">Python</option>
          </select>
          <CodeMirror
            className="ide"
            value={code}
            height="78vh"
            width="100%"
            theme={dracula}
            keymap="sublime"
            mode="python"
            onChange={(value) => setCode(value)}
          />
          <div className="btn">
            <button id="item0">Custom Input</button>
            <button id="item1">Run Code</button>
            <button id="item2" disabled={disableSubmit} onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="App">
      <Header />
      {selectedQuestion == "" ? (
        <>{renderQuestions()}</>
      ) : (
        <>{renderCodeIde()}</>
      )}
    </div>
  );
}

export default App;
