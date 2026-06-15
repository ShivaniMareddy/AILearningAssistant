import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
    const navigate = useNavigate();

const logout = () => {

  localStorage.removeItem(
    "token"
  );

  navigate("/");
};
  return (
    <div className="container">

  <div className="navbar">

    <div className="logo">
      🤖 AI Learning Assistant
    </div>
    <button
    className="logout-btn"
    onClick={logout}
  >
    Logout
  </button>

  </div>

  <div className="title-banner">

    <h1>AI Learning Assistant</h1>
    <p className="badge">
  Generative AI • RAG • Coding Assistant
</p>

    <p>
      By Shivani Mareddy
    </p>

    <p>
      Intelligent Learning, Coding &
      Document Analysis Platform
    </p>

  </div>

  <h2>Dashboard</h2>

  <div className="dashboard-grid">

    <Link
  to="/chat"
  className="dashboard-card"
>
  <h3>💬 Chat Assistant</h3>

  <p>
    Talk with AI and manage
    conversations
  </p>
</Link>

    <Link
      to="/documents"
      className="dashboard-card"
    >
      <h3>📄 Documents</h3>
       <p>
    Upload PDFs and ask questions
    using RAG
  </p>
    </Link>

    <Link
      to="/playground"
      className="dashboard-card"
    >
      <h3>💻 Coding Playground</h3>
       <p>
    Run Python, Java and JavaScript
    code with AI assistance
  </p>
    </Link>

    <Link
      to="/snippets"
      className="dashboard-card"
    >
      <h3>📝 Snippets</h3>
       <p>
    Save and manage reusable
    code snippets
  </p>
    </Link>

    </div>

  <div
    style={{
      marginTop:"50px",
      textAlign:"center",
      color:"#64748b",
      fontSize:"14px"
    }}
  >
    <hr />

    <p>
      AI Learning Assistant
    </p>

    <p>
      Developed by Shivani Mareddy
    </p>

    <p>
      React • FastAPI • PostgreSQL • ChromaDB • Ollama
    </p>

  </div>

</div>
  );
}

export default Dashboard;