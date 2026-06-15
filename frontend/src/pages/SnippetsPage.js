import { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
function SnippetsPage() {
    const navigate = useNavigate();

  const [language, setLanguage] =
    useState("Python");

  const [code, setCode] =
    useState("");

  const [snippets, setSnippets] =
    useState([]);

  useEffect(() => {

  const token =
    localStorage.getItem("token");

  if (!token) {

    navigate("/");

    return;

  }

  loadSnippets();

}, []);

 const loadSnippets = async () => {

  const token =
    localStorage.getItem("token");

  

  try {

    const response =
      await api.get(
        "/snippets",
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

    setSnippets(
      response.data
    );

  } catch (error) {

  console.log(
    "STATUS:",
    error.response?.status
  );

  console.log(
  "DATA:",
  JSON.stringify(
    error.response?.data
  )
);

  alert(
    "Failed to load snippets"
  );

}
};

  const saveSnippet =
    async () => {

      const token =
  localStorage.getItem("token");

await api.post(
  "/save-snippet",
  {
    language,
    code
  },
  {
    headers: {
      Authorization:
        `Bearer ${token}`
    }
  }
);

      setCode("");

      loadSnippets();
  };

  const deleteSnippet =
    async (snippetId) => {

      const token =
  localStorage.getItem("token");

await api.delete(
  `/snippet/${snippetId}`,
  {
    headers: {
      Authorization:
        `Bearer ${token}`
    }
  }
);

      loadSnippets();
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

    <h1>📝 Code Snippets</h1>

    <div className="snippets-layout">

      {/* LEFT PANEL */}

      <div className="snippet-editor">

        <h3>Create Snippet</h3>

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

        <textarea
          rows="12"
          placeholder="Enter code..."
          value={code}
          onChange={(e) =>
            setCode(
              e.target.value
            )
          }
        />

        <button
          onClick={saveSnippet}
        >
          Save Snippet
        </button>

      </div>

      {/* RIGHT PANEL */}

      <div className="snippet-list">

        <h3>Saved Snippets</h3>

        {snippets.length === 0 ? (

          <p>
            No snippets saved yet.
          </p>

        ) : (

          snippets.map(
            (snippet) => (

              <div
                key={snippet.id}
                className="snippet-card"
              >

                <div className="snippet-header">

                  <span>
                    {snippet.language}
                  </span>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      deleteSnippet(
                        snippet.id
                      )
                    }
                  >
                    Delete
                  </button>

                </div>

                <pre>
                  {snippet.code}
                </pre>

              </div>

            )
          )

        )}

      </div>

    </div>

  </div>
);
}

export default SnippetsPage;