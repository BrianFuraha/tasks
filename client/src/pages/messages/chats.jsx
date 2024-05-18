import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ChatBox, Conversation } from "../../components";


import "./chat.css";
import { userChats } from "../../api/requests";

export default function chats() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);

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
  return (
    <div className="Chat">
      {/*left side */}
      <div className="Left-side-chat ">
        <div className="Chat-container hide-scrollbar bg-white shadow-md sm:w-[200px] w-[100px] h-[590px]">
          <div className="Chat-list">
            {chats.map((chat) => (
              <div onClick={() => setCurrentChat(chat)}>
                <Conversation data={chat} currentUserId={currentUser._id} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/*right side */}
      <div className=" sm:ml-1 ml-7 Right-side-chat">
        <ChatBox chat={currentChat} currentUser={currentUser._id} />
      </div>
    </div>
  );
}
