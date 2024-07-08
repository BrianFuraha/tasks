import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";

import { ChatBox, Conversation } from "../../components";
import "./chat.css";
import { newChat, userChats } from "../../api/requests";
import { useLocation } from "react-router-dom";

export default function Chats() {
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [sendMessage, setSendMessage] = useState(null);
  const [receiveMessage, setReceiveMessage] = useState(null);
  const socket = useRef();
  const location = useLocation();
  const { userId } = location.state || {};
  const [userChat, setUserChat] = useState(null);

  // Fetch user chats
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const { data } = await userChats(currentUser._id);
        setChats(data);
        console.log(data)
      } catch (error) {
        console.error("Error fetching user chats:", error);
      }
    };
    fetchChats();
  }, [currentUser]);

  // Connect to Socket.io
  useEffect(() => {
    if (currentUser?._id) {
      socket.current = io("ws://localhost:8800");

      socket.current.emit("new-user-add", currentUser._id);

      socket.current.on("get-users", (users) => {
        setOnlineUsers(users);
      });

      // Cleanup on component unmount
      return () => {
        socket.current.disconnect();
      };
    }
  }, [currentUser]);

  // Send message to socket server
  useEffect(() => {
    if (sendMessage !== null) {
      socket.current.emit("send-message", sendMessage);
    }
  }, [sendMessage]);

  // Receive message from socket server
  useEffect(() => {
    socket.current.on("receive-message", (data) => {
      console.log("Received message:", data);
      setReceiveMessage(data);
    });
  }, []);

  // Check online status of chat members
  const checkOnlineStatus = (chat) => {
    const chatMember = chat.members.find(
      (member) => member !== currentUser._id
    );
    const online = onlineUsers.find((user) => user.userId === chatMember);
    return online ? true : false;
  };

  // Function to find user chat based on userId
  const findUserChat = (chats, userId) => {
    for (let chat of chats) {
      if (chat.members.includes(userId)) {
        return chat;
      }
    }
    return null;
  };

  // Find or create user chat
  useEffect(() => {
    const findOrCreateChat = async () => {
      const chat = findUserChat(chats, userId);
      if (chat !== null) {
        setUserChat(chat); // Set existing chat if found
      } else {
        try {
          const createChat = {
            senderId: currentUser._id,
            receiverId: userId,
          };
          const newChatData = await newChat(createChat); // Create new chat
          setUserChat(newChatData);

          // Update the local state with the new list of chats
          const { data } = await userChats(currentUser._id);
          setChats(data); // Update chats state with new list of chats
        } catch (error) {
          console.error("Error creating new chat:", error);
        }
      }
    };

    // Call findOrCreateChat only when necessary (e.g., userId or chats change)
    if (userId && chats.length > 0) {
      findOrCreateChat();
    }
  }, [chats, userId, currentUser._id]);
 // Ensure all necessary dependencies are included

  // Handle click on conversation to set current chat
  const handleConversationClick = (chat) => {
    console.log("Conversation clicked");
    setCurrentChat(chat);
    setUserChat(chat);
  };

  // Determine which chat to display
  const chatToDisplay = userChat || currentChat;

  return (
    <div className="Chat">
      {/* Left side */}
      <div className="Left-side-chat">
        <div className="Chat-container hide-scrollbar bg-white shadow-md sm:w-[200px] w-[100px] h-[590px]">
          <div className="Chat-list hide-scrollbar">
            {chats.map((chat, index) => (
              <div key={index} onClick={() => handleConversationClick(chat)}>
                <Conversation
                  data={chat}
                  currentUserId={currentUser._id}
                  online={checkOnlineStatus(chat)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="sm:ml-1 ml-7 Right-side-chat">
        <ChatBox
          chat={chatToDisplay}
          currentUser={currentUser._id}
          setSendMessage={setSendMessage}
          receiveMessage={receiveMessage}
        />
      </div>
    </div>
  );
}
