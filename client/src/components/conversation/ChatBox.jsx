import React, { useEffect, useState } from "react";
import { format } from "timeago.js";
import InputEmoji from "react-input-emoji";

import { getMessages, getUser } from "../../api/requests";
import "./chatBox.css";

const chatBox = ({ chat, currentUser }) => {
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  //fetching data for header
  useEffect(() => {
    const userId = chat?.members?.find((id) => id !== currentUser);

    const getUserData = async () => {
      try {
        const { data } = await getUser(userId);
        setUserData(data);
      } catch (error) {
        console.log(error);
      }
    };
    if (chat !== null) getUserData();
  }, [chat, currentUser]);

  //fetching data for messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await getMessages(chat._id);
        setMessages(data);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    if (chat !== null) fetchMessages();
  }, [chat]);

  const handleChange = (newMessage) => {
    setNewMessage(newMessage);
  };

  return (
    <>
      <div className="ChatBox-container shadow-md ">
        {chat ? (
          <>
            <div className="chat-header">
              <div className="follower">
                <div>
                  <div className=" online-dot"></div>
                  <img
                    src={userData?.avatar}
                    alt="profile pic"
                    className="followerImage"
                    style={{ width: "50px", height: "50px" }}
                  />
                  <div className="name" style={{ fontSize: "0.8rem" }}>
                    <span>{userData?.username}</span>
                  </div>
                </div>
              </div>
              <hr style={{ width: "85%", border: "0.1px solid #ececec" }} />
            </div>

            {/** chatBox messages */}
            <div className="chat-body hide-scrollbar">
              {messages.map((message) => (
                <>
                  <div
                    className={
                      message.senderId === currentUser
                        ? "message own"
                        : "message"
                    }
                  >
                    <span>{message.text}</span>
                    <span>{format(message.createdAt)}</span>
                  </div>
                </>
              ))}
            </div>
            {/**chat sender */}
            <div className="chat-sender">
              <div>+</div>
              <InputEmoji value={newMessage} onChange={handleChange} />
              <div className="send-button button">
                Send
              </div>
            </div>
          </>
        ) : (
          <span className=" chatbox-empty-message">Tap on a chat to start conversation...</span>
        )}
      </div>
    </>
  );
};

export default chatBox;
