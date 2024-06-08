import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Comments, MyWorks } from "../../components";
import { getUser } from "../../api/requests";
import { useParams } from "react-router-dom";

export default function RunnerProfile() {
  const { userId } = useParams();
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await getUser(userId);
        setUserData(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, [userId]);
  const handleClick = () => {};
  const handleSelect = () => {};

  return (
    <div className=" bg-gray-100">
      <div className=" container mx-auto py-8">
        <div className=" grid grid-cols-4 sm:grid-cols-12 gap-6 px-4">
          <div className=" col-span-4 sm:col-span-3">
            <div className=" bg-white shadow rounded-lg p-6">
              <div className=" flex flex-col items-center">
                <img
                  src={currentUser.avatar}
                  alt="profilePic"
                  className=" w-32 h-32 bg-gray-300 rounded-full mb-4 shrink-0"
                />
                <h1 className=" text-xl font-bold">{currentUser.username}</h1>
                <p className=" text-gray-700 uppercase">
                  {currentUser.userType}
                </p>
                <div className=" mt-6 justify-center">
                  {currentUser.userType === "runner" ? (
                    <button
                      onClick={handleClick}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <button
                      onClick={handleSelect}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                    >
                      Select and Chat
                    </button>
                  )}
                </div>

                <div className=" flex flex-col">
                  <hr className="my-6 border-t border-b-gray-600" />
                  <span className=" text-gray-700 uppercase font-bold tracking-wider mb-2">
                    Information
                  </span>
                  <ul>
                    <li className=" mb-2">Email: {currentUser.email}</li>
                    <li className=" mb-2">Location: {currentUser.location}</li>
                    <li className=" mb-2">
                      Categories: {currentUser.category}
                    </li>
                    <li className=" mb-2">Ratings: {currentUser.ratings}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className=" col-span-4 sm:col-span-9">
            <div className=" bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">About Me:</h2>
              <p className="text-gray-700">{currentUser.about}</p>
              <hr className="my-6 border-t border-b-gray-600" />

              <h2 className=" text-xl font-bold mt 6 mb-4">My works</h2>
              <div className=" mb-6 flex gap-10">
                {/* {images.map((_ , index) => (
                  <img
                    key={index}
                    src={src}
                    alt={`Image ${index + 1}`}
                    style={{ width: "150px", height: "150px" }}
                  />
                ))} */}
              </div>

              <h2 className=" text-xl font-bold mt 6 mb-4">Comments: </h2>
              <div>
                <Comments
                data={userData}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
