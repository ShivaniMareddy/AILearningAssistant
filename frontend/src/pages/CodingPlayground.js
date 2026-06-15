import { useState } from "react";
import api from "../services/api";

function CodingPlayground() {

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
    <div>

      <h1>Coding Playground</h1>

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

      <br />
      <br />

      <textarea
        rows="15"
        cols="80"
        placeholder="Write code here..."
        value={code}
        onChange={(e) =>
          setCode(
            e.target.value
          )
        }
      />

      <br />
      <br />

      <button onClick={runCode}>
        Run Code
      </button>

      <hr />

      <h3>Output</h3>

      <pre>{output}</pre>

      <h3>Error</h3>

      <pre>{error}</pre>

      <h3>AI Explanation</h3>

      <p>{aiExplanation}</p>

    </div>
  );
}

export default CodingPlayground;