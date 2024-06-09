import React, { useEffect, useState } from "react";
import { getUser } from "../../api/requests";
import { format } from "timeago.js";

export default function Comment({ userId, comment, date }) {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const { data } = await getUser(userId);
        if (userId) {
          setUserData(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getUserData();
  }, [userId]);

  if (!userData) {
    return <div>Loading...</div>;
  }
  return (
    <div className=" p-5 border rounded text=grey-500 mb-2">
      <div className=" flex items-center">
        <img
          src={userData.avatar}
          alt="profile pic"
          className=" w-16 h-16 rounded-full mr-3"
        />
        <div className=" text-sm">
          <p className=" font-medium leading-none text-gray-900">
            {userData.username}
          </p>
          <p className=" mt-1">Rated: </p>
        </div>
      </div>
      <div className=" flex">
        <span className=" mt-2 text-sm text-gray-900">{comment}</span>
        <span className=" ml-auto text-[0.7rem] text-gray-500">
          {format(date)}
        </span>
      </div>
    </div>
  );
}
