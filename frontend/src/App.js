import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

import ChatPage from "./pages/ChatPage";
import DocumentsPage from "./pages/DocumentsPage";
import CodingPlayground from "./pages/CodingPlayground";
import SnippetsPage from "./pages/SnippetsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/documents" element={<DocumentsPage />} />
        <Route path="/playground" element={<CodingPlayground />} />
        <Route path="/snippets" element={<SnippetsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;