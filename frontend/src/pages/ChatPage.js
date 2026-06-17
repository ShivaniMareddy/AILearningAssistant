import { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
function ChatPage() {

  const navigate = useNavigate();

  const [conversations, setConversations] =
    useState([]);

  const [messages, setMessages] =
    useState([]);
  const [newConversationTitle,
    setNewConversationTitle] =
    useState("");

  const [selectedConversation,
    setSelectedConversation] =
    useState(null);
  const [newMessage, setNewMessage] =
    useState("");
  useEffect(() => {

  const token =
    localStorage.getItem("token");

  if (!token) {

    navigate("/");

    return;

  }

  loadConversations();

}, [navigate]);

  const loadConversations = async () => {
    

    const token =
      localStorage.getItem("token");

    try {

  const response = await api.get(
    "/conversations",
    {
      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  );

  setConversations(
    response.data
  );

} catch (error) {

  console.log(
    "CHAT ERROR:",
    error.response?.data
  );

}
  };

  const loadMessages = async (
    conversationId
  ) => {

    const token =
      localStorage.getItem("token");

    const response = await api.get(
      `/conversation/${conversationId}`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );

    setMessages(
      response.data
    );

    setSelectedConversation(
      conversationId
    );
  };
  const sendMessage = async () => {

  if (!newMessage.trim()) return;

  const token =
    localStorage.getItem("token");
  console.log("selectedConversation =", selectedConversation);
console.log("message =", newMessage);


  await api.post(
    "/message/send",
    {
      conversation_id:
        selectedConversation,
      message:
        newMessage
    },
    {
      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  );
  

  setNewMessage("");

  loadMessages(
    selectedConversation
  );
};
const createConversation =
  async () => {

    try {

      if (
        !newConversationTitle.trim()
      ) return;

      const token =
        localStorage.getItem("token");

      await api.post(
        "/conversation/create",
        {
          title:
            newConversationTitle
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      setNewConversationTitle("");

      loadConversations();

    } catch (error) {

      console.log(
        error.response?.data
      );

      alert(
        "Failed to create conversation"
      );

    }
};
const deleteConversation =
  async (conversationId) => {

    const token =
      localStorage.getItem("token");

    await api.delete(
      `/conversation/${conversationId}`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );

    loadConversations();

    setMessages([]);
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
    

    <h1>💬 Chat Assistant</h1>

    <div className="chat-layout">

      {/* LEFT PANEL */}

      <div className="sidebar">

        <h3>Conversations</h3>

        <input
          type="text"
          placeholder="Conversation Title"
          value={newConversationTitle}
          onChange={(e) =>
            setNewConversationTitle(
              e.target.value
            )
          }
        />

        <button
          onClick={createConversation}
        >
          New Conversation
        </button>

        <br />
        <br />

        {conversations.map(
          (conversation) => (

            <div
              key={conversation.id}
              className={
  selectedConversation ===
  conversation.id
    ? "conversation-item conversation-active"
    : "conversation-item"
}
            >

              <span
                onClick={() =>
                  loadMessages(
                    conversation.id
                  )
                }
              >
                {conversation.title}
              </span>

              <button
                onClick={() =>
                  deleteConversation(
                    conversation.id
                  )
                }
              >
                X
              </button>

            </div>

          )
        )}

      </div>

      {/* RIGHT PANEL */}

      <div className="chat-window">

        <h3>Messages</h3>

        <div className="messages-area">
            {messages.length === 0 && (

    <div
      style={{
        textAlign:"center",
        marginTop:"150px",
        color:"#64748b"
      }}
    >
      Select a conversation
      and start chatting 🚀
    </div>

  )}

          {messages.map(
            (message) => (

              <div
                key={message.id}
                className={
                  message.sender === "User"
                    ? "message-user"
                    : "message-ai"
                }
              >

                <b>
                  {message.sender}
                </b>

                <br />

                <ReactMarkdown remarkPlugins={[remarkGfm]}>
  {message.message}
</ReactMarkdown>

              </div>

            )
          )}

        </div>

        <div className="message-box">

          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) =>
              setNewMessage(
                e.target.value
              )
            }
          />

          <button
            onClick={sendMessage}
          >
            Send
          </button>

        </div>

      </div>

    </div>

  </div>
);
}

export default ChatPage;