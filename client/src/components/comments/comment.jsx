import React, { useEffect, useState } from "react";
import { getUser } from "../../api/requests";
import { format } from "timeago.js";

export default function Comment({ userId, comment, date, images }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const { data } = await getUser(userId);
        if (data) {
          setUserData(data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getUserData();
  }, [userId]);

  

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userData) {
    return <div>User data not available</div>;
  }

  return (
    <div className="p-5 border rounded text-grey-500 mb-2">
      <div className="flex items-center">
        <img
          src={userData.avatar}
          alt="profile pic"
          className="w-16 h-16 rounded-full mr-3"
        />
        <div className="text-sm">
          <p className="font-medium leading-none text-gray-900">
            {userData.username}
          </p>
          <p className="mt-1">Rated: {userData.rating || "N/A"}</p>
        </div>
      </div>
      <div className="flex mt-2">
        <span className="text-sm text-gray-900">{comment}</span>
      </div>
      <div className="flex mt-2">
        {images.length > 0 &&
          images.map((img) => (
            <div key={img._id} className="mr-2">
              {/* {console.log("Image URL:", img.image)} Debugging line */}
              <img
                src={img.image}
                alt="comment image"
                className="max-w-[100px] h-auto"
              />
            </div>
          ))}
      </div>
      <div className="flex mt-2">
        <span className="ml-auto text-[0.7rem] text-gray-500">
          {format(date)}
        </span>
      </div>
    </div>
  );
}
