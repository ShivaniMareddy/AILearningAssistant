import { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
function CodingPlayground() {
    const navigate = useNavigate();
    useEffect(() => {

  const token =
    localStorage.getItem("token");

  if (!token) {
    navigate("/");
  }

}, [navigate]);

  const [language, setLanguage] =
    useState("python");

  const [code, setCode] =
    useState("");

  const [output, setOutput] =
    useState("");

  const [error, setError] =
    useState("");

  const [aiExplanation,
    setAiExplanation] =
    useState("");

  const runCode = async () => {

    let endpoint = "";

    if (language === "python")
      endpoint = "/run-python";

    if (language === "java")
      endpoint = "/run-java";

    if (language === "javascript")
      endpoint = "/run-javascript";

    const response =
      await api.post(
        endpoint,
        {
          code
        }
      );

    setOutput(
      response.data.output
    );

    setError(
      response.data.error
    );

    setAiExplanation(
      response.data.ai_explanation || ""
    );
  };

  return (
  <div className="container">
    <div
  style={{
    display:"flex",
    justifyContent:"space-between",
    alignItems:"center"
  }}
>

  <button
    className="back-btn"
    onClick={() =>
      navigate("/dashboard")
    }
  >
    ← Dashboard
  </button>

  <button
    className="logout-btn"
    onClick={() => {

      localStorage.removeItem(
        "token"
      );

      navigate("/");

    }}
  >
    Logout
  </button>

</div>

    <h1>💻 Coding Playground</h1>

    <div className="playground-layout">

      <div className="editor-card">

        <h3>Code Editor</h3>

        <select
          value={language}
          onChange={(e) =>
            setLanguage(
              e.target.value
            )
          }
        >
          <option value="python">
            Python
          </option>

          <option value="java">
            Java
          </option>

          <option value="javascript">
            JavaScript
          </option>
        </select>

        <textarea
          rows="15"
          placeholder="Write code here..."
          value={code}
          onChange={(e) =>
            setCode(
              e.target.value
            )
          }
        />

        <button
          onClick={runCode}
        >
          Run Code
        </button>

      </div>

      <div className="results-card">

        <div className="result-section">

          <h3>Output</h3>

          <pre>
            {output ||
              "Run code to see output"}
          </pre>

        </div>

        <div className="result-section">

          <h3>Error</h3>

          <pre>
            {error ||
              "No errors"}
          </pre>

        </div>

        <div className="result-section">

          <h3>AI Explanation</h3>

          <p>
            {aiExplanation ||
              "AI explanation will appear here"}
          </p>

        </div>

      </div>

    </div>

  </div>
);
}

export default CodingPlayground;