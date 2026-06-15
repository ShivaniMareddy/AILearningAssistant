import { useState, useEffect } from "react";
import api from "../services/api";

function DocumentsPage() {

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

const [sources,
  setSources] =
  useState([]);
    useEffect(() => {
    loadDocuments();
  }, []);

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
          question
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
    <div>

      <h1>Documents</h1>
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
<h3>Ask a Question</h3>

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

<br />
<br />

<b>Answer:</b>

<p>{answer}</p>
<p>
  <b>Confidence:</b>
  {confidence}%
</p>

<p>
  <b>Sources:</b>
</p>

<ul>
  {sources.map(
    (source, index) => (
      <li key={index}>
        {source}
      </li>
    )
  )}
</ul>

<hr />

      <h3>Uploaded Documents</h3>

      <ul>

        {documents.map(
          (document) => (

            <li key={document.id}>
              {document.filename}
            </li>

          )
        )}

      </ul>

    </div>
  );
}

export default DocumentsPage;