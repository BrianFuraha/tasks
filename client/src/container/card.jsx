import React from "react";
import { useNavigate } from "react-router-dom";

export default function card({ data }) {
  const navigate = useNavigate();
  const handleClick = (id) => {
    navigate("/runnerProfile", { state: { userId: id } });
  };
  const handleChat = (id) => {
    navigate("/messages", { state: { userId: id } });
  };
  return (
    <div className=" max-w-sm mx-auto bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl shadow-green-500/40 hover:shadow-green-500">
      <div className=" border-b px-4 pb-6">
        <div className=" text-center my-4">
          <img
            className=" h-32 w-32 rounded-full border-4 border-white dark:border-gray-800 mx-auto my-4"
            src={data.avatar}
            alt="picture"
          />
          <div className=" py-2">
            <h3 className=" font-bold text-2xl text-gray-800 dark:text-white mb-1">
              {data.username}
            </h3>
            <div className=" inline-flex text-gray-700 dark:text-gray-300 items-center">
              <svg
                className="h-5 w-5 text-gray-400 dark:text-gray-600 mr-1"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <path d="M5.64 16.36a9 9 0 1 1 12.72 0l-5.65 5.66a1 1 0 0 1-1.42 0l-5.65-5.66zm11.31-1.41a7 7 0 1 0-9.9 0L12 19.9l4.95-4.95zM12 14a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
              </svg>
              {data.location}
            </div>
            <p>Ratings:</p>
            <p>Categories</p>
          </div>
        </div>
        <div className="flex gap-2 px-2">
          <button
            onClick={() => handleClick(data._id)}
            className="flex-1 rounded-full bg-blue-600 dark:bg-blue-800 text-white dark:text-white antialiased font-bold hover:bg-blue-800 dark:hover:bg-blue-900 px-4 py-2"
          >
            Profile
          </button>
          <button
            className="flex-1 rounded-full border-2 border-gray-400 dark:border-gray-700 font-semibold text-black dark:text-white px-4 py-2"
            onClick={() => handleChat(data._id)}
          >
            Message
          </button>
        </div>
      </div>
    </div>
  );
}
