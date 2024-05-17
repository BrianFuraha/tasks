import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Conversation } from "../../components";
import { userChats } from "../../api/chats.Request";

export default function chats() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const getChats = async () => {
      try {
        const { data } = await userChats(currentUser._id);
        setChats(data);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    getChats();
  }, [currentUser]);
  return (
    <div className="relative isolate px-6 pt-1 lg:px-8 flex-col grid grid-cols-2 gap-4">
      {/*left side */}
      <div className=" w-[90%] flex flex-col gap-4">
        <div className=" flex flex-col gap-4 rounded-2xl h-auto min-h-[80vh] overflow-hidden pl-3 bg-white shadow-md">
          <h2 className="pl-1">leftchats</h2>
          <div className=" flex flex-col gap-4">
            {chats.map((chat) => (
              <div key={chat._id}>
                <Conversation data={chat} currentUserId={currentUser._id} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/*right side */}
      <div className=" w-auto flex flex-col gap-4">rightchats</div>
    </div>
  );
}
