import { useState, useEffect } from "react";
import api from "../services/api";

function SnippetsPage() {

  const [language, setLanguage] =
    useState("Python");

  const [code, setCode] =
    useState("");

  const [snippets, setSnippets] =
    useState([]);

  useEffect(() => {
    loadSnippets();
  }, []);

  const loadSnippets = async () => {

    const response =
      await api.get("/snippets");

    setSnippets(
      response.data
    );
  };

  const saveSnippet =
    async () => {

      await api.post(
        "/save-snippet",
        {
          language,
          code
        }
      );

      setCode("");

      loadSnippets();
  };

  const deleteSnippet =
    async (snippetId) => {

      await api.delete(
        `/snippet/${snippetId}`
      );

      loadSnippets();
  };

  return (
    <div>

      <h1>Code Snippets</h1>

      <select
        value={language}
        onChange={(e) =>
          setLanguage(
            e.target.value
          )
        }
      >
        <option>Python</option>
        <option>Java</option>
        <option>JavaScript</option>
      </select>

      <br />
      <br />

      <textarea
        rows="10"
        cols="80"
        placeholder="Enter code..."
        value={code}
        onChange={(e) =>
          setCode(
            e.target.value
          )
        }
      />

      <br />
      <br />

      <button
        onClick={saveSnippet}
      >
        Save Snippet
      </button>

      <hr />

      <h3>Saved Snippets</h3>

      {snippets.map(
        (snippet) => (

          <div
            key={snippet.id}
          >

            <b>
              {snippet.language}
            </b>

            <pre>
              {snippet.code}
            </pre>

            <button
              onClick={() =>
                deleteSnippet(
                  snippet.id
                )
              }
            >
              Delete
            </button>

            <hr />

          </div>

        )
      )}

    </div>
  );
}

export default SnippetsPage;