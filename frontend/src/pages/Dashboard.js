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
    <div>
      <h1>AI Learning Assistant</h1>

      <hr />

      <h2>Dashboard</h2>
      <button onClick={logout}>
  Logout
</button>

<br />
<br />

      <ul>
        <li>
          <Link to="/chat">💬 Chat Assistant</Link>
        </li>

        <li>
          <Link to="/documents">📄 Documents</Link>
        </li>

        <li>
          <Link to="/playground">💻 Coding Playground</Link>
        </li>

        <li>
          <Link to="/snippets">📝 Snippets</Link>
        </li>
      </ul>
    </div>
  );
}

export default Dashboard;