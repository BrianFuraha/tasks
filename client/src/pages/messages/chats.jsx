import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";

import { ChatBox, Conversation } from "../../components";
import "./chat.css";
import { userChats } from "../../api/requests";

export default function chats() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [sendMessage, setSendMessage] = useState(null);
  const [receiveMessage, setReceiveMessage] = useState(null);
  const socket = useRef();
  // const dispatch = useDispatch();

  // Get the chat in chat section
  useEffect(() => {
    const getChats = async () => {
      try {
        const { data } = await userChats(currentUser._id);
        setChats(data);
      } catch (error) {
        console.log(error);
      }
    };
    getChats();
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

  // send message to socket server
  useEffect(() => {
    if (sendMessage !== null) {
      socket.current.emit("send-message", sendMessage);
    }
  }, [sendMessage]);

  // receive message from socket server
  useEffect(() => {
    socket.current.on("receive-message", (data) => {
      console.log("data:" ,data);
      setReceiveMessage(data);
    });
  }, []);

  const checkOnlineStatus = (chat) => {
    const chatMember = chat.members.find(
      (member) => member !== currentUser._id
    );
    const online = onlineUsers.find((user) => user.userId === chatMember);
    return online ? true : false;
  };

  return (
    <div className="Chat">
      {/*left side */}
      <div className="Left-side-chat ">
        <div className="Chat-container hide-scrollbar bg-white shadow-md sm:w-[200px] w-[100px] h-[590px]">
          <div className="Chat-list">
            {chats.map((chat, index) => (
              <div key={index} onClick={() => setCurrentChat(chat)}>
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

      {/*right side */}
      <div className=" sm:ml-1 ml-7 Right-side-chat">
        <ChatBox
          chat={currentChat}
          currentUser={currentUser._id}
          setSendMessage={setSendMessage}
          receiveMessage={receiveMessage}
        />
      </div>
    </div>
  );
}
