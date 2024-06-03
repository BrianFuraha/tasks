import React, { useEffect, useRef, useState } from "react";
import { format } from "timeago.js";
import InputEmoji from "react-input-emoji";

import { addMessage, getMessages, getUser } from "../../api/requests";
import "./chatBox.css";

const ChatBox = ({ chat, currentUser, setSendMessage, receiveMessage }) => {
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
      } catch (error) {
        console.log(error);
      }
    };
    if (chat !== null) fetchMessages();
  }, [chat]);

  const handleChange = (newMessage) => {
    setNewMessage(newMessage);
  };

  const handleSend = async (e) => {
    e.preventDefault();

    const message = {
      senderId: currentUser,
      text: newMessage,
      chatId: chat._id,
    };

    // send message to socket server
    const receiverId = chat.members.find((id) => id !== currentUser);
    setSendMessage({ ...message, receiverId });

    // send message to db
    try {
      const { data } = await addMessage(message);
      setMessages([...messages, data]);
      setNewMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  //allways scroll to the last message
  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    console.log("Message Arrived: ", receiveMessage);
    if (receiveMessage !== null && receiveMessage.chatId === chat._id) {
      setMessages([...messages, receiveMessage]);
    }
  }, [receiveMessage]);

  const scroll = useRef();
  const imageRef = useRef();

  const ownMessageStyle = {
    backgroundColor: "#24e4f0",
    color: "white",
    padding: "0.7rem",
    borderRadius: "1rem 1rem 0 1rem",
    maxWidth: "28rem",
    width: "fit-content",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    alignSelf: "flex-end",
  };

  const otherMessageStyle = {
    backgroundColor: "#fff9c4",
    color: "black",
    padding: "0.7rem",
    borderRadius: "1rem 1rem 1rem 0",
    maxWidth: "28rem",
    width: "fit-content",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    alignSelf: "flex-start",
  };
  const timeStyle = {
    fontSize: "0.7rem",
    color: "#888",
    alignSelf: "end",
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
                <div
                  key={message._id}
                  ref={scroll}
                  style={
                    message.senderId === currentUser
                      ? ownMessageStyle
                      : otherMessageStyle
                  }
                >
                  <span>{message.text}</span>
                  <span style={timeStyle}>{format(message.createdAt)}</span>
                </div>
              ))}
            </div>
            {/**chat sender */}
            <div className="chat-sender">
              <div onClick={() => imageRef.current.click()}>+</div>
              <InputEmoji value={newMessage} onChange={handleChange} />
              <div className="send-button button" onClick={handleSend}>
                Send
              </div>
              <input
                type="file"
                name=""
                id=""
                style={{ display: "none" }}
                ref={imageRef}
              />
            </div>{" "}
          </>
        ) : (
          <span className=" chatbox-empty-message">
            Tap on a chat to start conversation...
          </span>
        )}
      </div>
    </>
  );
};

export default ChatBox;
