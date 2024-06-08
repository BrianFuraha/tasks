import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";

export default function profileCard() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const handleClick = () => {
    navigate('/profile');
  };
  return currentUser.userType === 'user' ? (
    <div>
      <h1 className=" text-3xl font-semibold text-center my-7 ">Profile</h1>
      <div className="max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className=" flex flex-col ">
          <img
            src={currentUser.avatar}
            alt="profile"
            className=" rounded-full h-24 w-24 object-cover self-center mt-2 "
          />
        </div>
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2">User Information</div>
          {currentUser.userType == "runner" ? (
            <div className="text-gray-700 text-base">
              <p>Name: {currentUser.username}</p>
              <p>Email: {currentUser.email}</p>
              <p>Location: {currentUser.location}</p>
              <p>About me: {currentUser.about}</p>
              <p>Categories: {currentUser.category}</p>
              <p>User Type: {currentUser.userType}</p>
              <p>Ratings: {currentUser.ratings}</p>
              <p>Comments: {currentUser.comments}</p>
            </div>
          ) : (
            <div className="text-gray-700 text-base">
              <p>Name: {currentUser.username}</p>
              <p>Email: {currentUser.email}</p>
              <p>Location: {currentUser.location}</p>
              <p>User Type: {currentUser.userType}</p>
            </div>
          )}
        </div>
        <div className="px-6 py-4">
          <button
            onClick={handleClick}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  ) : <Navigate to={`/runnerProfile/${currentUser._id}`} />;
}
