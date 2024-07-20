import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";

export default function profileCard() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const handleClick = () => {
    navigate("/profile");
  };
  return currentUser.userType === "user" ? (
    <div className=" w-full h-full flex justify-center items-center">
      <div className=" w-[20rem] mx-auto flex flex-col gap-2 px-4 shadow-lg border border-gray-300 rounded-lg bg-white dark:bg-gray-900 hover:shadow-2xl shadow-green-500/40 hover:shadow-green-500">
        <div className=" w-full flex justify-center items-center">
          <img
            className=" w-[8rem] h-[8rem] rounded-full outline-offset-2 outline-1 outline-dashed outline-blue-400 shadow-lg relative -top-[4rem] "
            src={currentUser.avatar}
            alt="profile image"
          />
        </div>

        <div className=" w-full h-full text-center flex flex-col gap-4 relative -top-10">
          <h1 className=" uppercase text-lg font-semibold dark:text-white">
            {currentUser.userType}
          </h1>

          <h2 className=" text-xl font-serif capitalize text-gray-700 dark:text-gray-300">
            Name: {currentUser.username}
          </h2>
          <h2 className=" text-xl font-serif capitalize text-gray-700 dark:text-gray-300">
            Email: {currentUser.email}
          </h2>
          <h2 className=" text-xl font-serif capitalize text-gray-700 dark:text-gray-300">
            Location: {currentUser.location}
          </h2>
          <button
            onClick={handleClick}
            className=" w-[60%] mx-auto rounded-3xl bg-blue-500 hover:bg-blue-700 text-white py-2 px-4"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  ) : (
    <Navigate to={"/runnerProfile"} />
  );
}
