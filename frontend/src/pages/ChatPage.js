import { useState, useEffect } from "react";
import api from "../services/api";

function ChatPage() {

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
    loadConversations();
  }, []);

  const loadConversations = async () => {
    

    const token =
      localStorage.getItem("token");
    console.log(
        "LOAD TOKEN:",
        token
        );

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
  console.log(
    "SEND TOKEN:",
    token
    );

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
    <div>

      <h1>Chat Assistant</h1>
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

<hr />

      <h3>Your Conversations</h3>

      <ul>

        {conversations.map(
          (conversation) => (

            <li key={conversation.id}>

  <span
    onClick={() =>
      loadMessages(
        conversation.id
      )
    }
    style={{
      cursor: "pointer"
    }}
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
    Delete
  </button>

</li>
          )
        )}

      </ul>

      <hr />

      <h3>Messages</h3>

      {messages.map(
        (message) => (

          <p key={message.id}>
            <b>
              {message.sender}
            </b>
            :
            {" "}
            {message.message}
          </p>

        )
      )}
      <hr />

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
  );
}

export default ChatPage;