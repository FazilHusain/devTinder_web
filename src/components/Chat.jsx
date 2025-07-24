// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/sockent";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const { targetUserId } = useParams();
  console.log(targetUserId);

  const user = useSelector((store) => store.user);
  const userId = user?._id;

  const fethChatMessages = async () => {
    const chat = await axios.get(BASE_URL + "/chat/" + targetUserId, {
      withCredentials: true,
    });
    console.log(chat.data.messages);

    const chatMessages = chat?.data?.messages.map((msg) => {
      const {senderId, text} = msg;
      return {
        firstName: senderId?.firstName,
        lastName: senderId?.lastName,
        text,
      };
    });
    setMessages(chatMessages);
  };

  useEffect(() => {
    fethChatMessages();
  }, []);
  useEffect(() => {
    if (!userId) {
      return;
    }
    const socket = createSocketConnection();
    socket.emit("joinChat", {
      firstName: user?.firstName,
      userId,
      targetUserId,
    });

    socket.on("messageReceived", ({ firstName, lastName, text }) => {
      console.log(firstName + " :  " + text);
      setMessages((messages) => [...messages, { firstName, lastName, text }]);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, targetUserId]);

  const sendMessage = () => {
    const socket = createSocketConnection();
    socket.emit("sendMessage", {
      firstName: user.firstName,
      lastName: user.lastName,
      userId,
      targetUserId,
      text: newMessage,
    });
    setNewMessage("");
  };

  return (
  <div className="w-full max-w-2xl mx-auto border border-gray-600 my-5 flex flex-col rounded-md bg-gray-900 min-h-screen sm:min-h-[60vh] sm:h-[70vh] overflow-hidden">
    <h1 className="border-b border-gray-600 p-4 text-lg font-semibold text-white">Chat</h1>

    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {messages.map((msg, index) => (
        <div
          className={`chat ${user.firstName === msg.firstName ? "chat-end" : "chat-start"}`}
          key={index}
        >
          <div className="chat-header text-white flex items-center gap-2">
            {msg.firstName + " " + msg.lastName}
            <time className="text-xs opacity-50">12:45</time>
          </div>
          <div className="chat-bubble bg-blue-600 text-white">{msg.text}</div>
          <div className="chat-footer opacity-50 text-xs text-gray-300">Seen</div>
        </div>
      ))}
    </div>

    <div className="p-4 border-t border-gray-600 flex items-center gap-2 bg-gray-800 sticky bottom-0 z-10">
      <input
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        className="flex-1 border border-gray-500 bg-gray-700 text-white rounded p-2 placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-500"
        placeholder="Type your message..."
      />
      <button
        className="btn btn-secondary bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
        onClick={sendMessage}
      >
        Send
      </button>
    </div>
  </div>
);

};

export default Chat;
