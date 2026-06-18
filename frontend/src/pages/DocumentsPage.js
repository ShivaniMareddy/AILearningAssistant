import { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
function DocumentsPage() {
    const navigate = useNavigate();

  const [documents, setDocuments] =
    useState([]);
  const [selectedFile, setSelectedFile] =
    useState(null);
    const [question,
  setQuestion] =
  useState("");

const [answer,
  setAnswer] =
  useState("");
  const [confidence,
  setConfidence] =
  useState("");
const [
  selectedDocument,
  setSelectedDocument
] = useState("");

const [sources,
  setSources] =
  useState([]);
    useEffect(() => {

  const token =
    localStorage.getItem("token");

  if (!token) {

    navigate("/");

    return;

  }

  loadDocuments();

}, [navigate]);

  const loadDocuments = async () => {

    const response = await api.get(
      "/documents"
    );

    setDocuments(
      response.data
    );
  };
  const uploadPDF =
  async () => {

    if (!selectedFile) return;

    const formData =
      new FormData();

    formData.append(
      "file",
      selectedFile
    );

    await api.post(
      "/upload-pdf",
      formData
    );

    setSelectedFile(null);

    loadDocuments();
};
const askQuestion =
  async () => {

    if (!question.trim())
      return;

    const response =
  await api.post(
    "/ask",
    {
      question,
      selected_document:
        selectedDocument
    }
  );

    setAnswer(
  response.data.answer
);

setConfidence(
  response.data.confidence
);

setSources(
  response.data.sources
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

    <h1>📄 Document Assistant</h1>

    <div className="documents-layout">

      {/* LEFT PANEL */}

      <div className="documents-sidebar">

        <h3>Upload PDF</h3>

        <input
          type="file"
          accept=".pdf"
          onChange={(e) =>
            setSelectedFile(
              e.target.files[0]
            )
          }
        />

        <button
          onClick={uploadPDF}
        >
          Upload PDF
        </button>

        <hr />

        <h3>Uploaded Documents</h3>

        {documents.length === 0 ? (

  <p>
    No documents uploaded yet
  </p>

) : (

  documents.map(
    (document) => (

      <div
        key={document.id}
        className="document-item"
      >
        📄 {document.filename}
      </div>

    )
  )

)}

      </div>

      {/* RIGHT PANEL */}

      <div className="documents-content">
        <h4>Select Document</h4>

<select
  value={selectedDocument}
  onChange={(e) =>
    setSelectedDocument(
      e.target.value
    )
  }
>
  <option value="">
    All Documents
  </option>

  {documents.map((document) => (
    <option
      key={document.id}
      value={document.filename}
    >
      {document.filename}
    </option>
  ))}
</select>

<br />
<br />

        <h3>Ask a Question</h3>

        <div className="question-box">

          <input
            type="text"
            placeholder="Ask about your PDFs..."
            value={question}
            onChange={(e) =>
              setQuestion(
                e.target.value
              )
            }
          />

          <button
            onClick={askQuestion}
          >
            Ask
          </button>

        </div>

        <div className="answer-card">

          <h3>Answer</h3>

          {answer ? (

  <p>{answer}</p>

) : (

  <p className="answer-placeholder">
    Ask a question to get started...
  </p>

)}

          {confidence && (

            <>
              <hr />

              <p className="confidence-badge">
  Confidence: {confidence}%
</p>

              <p>
                <b>Sources:</b>
              </p>

              <ul>

                {sources.map(
                  (
                    source,
                    index
                  ) => (

                    <li key={index}>
                      {source}
                    </li>

                  )
                )}

              </ul>

            </>

          )}

        </div>

      </div>

    </div>

  </div>
);
}

export default DocumentsPage;