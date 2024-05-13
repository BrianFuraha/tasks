import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { images } from "../../assets";
import { navlinks, navlink } from "../../constants";
import { useDispatch } from "react-redux";
import {
  deleteUserFailure,
  deleteUserSuccess,
  signOutUserStart,
} from "../../redux/user/userSlice";

const Icon = ({ styles, name, imgUrl, isActive, handleClick, disabled }) => (
  <div
    className={`w-[48px] h-[48px] rounded-[10px] ${
      isActive && isActive === name && "bg-purple-50"
    } flex justify-center items-center ${
      !disabled && "cursor-pointer"
    } ${styles}`}
    onClick={handleClick}
  >
    {!isActive ? (
      <img src={imgUrl} alt="wera_logo" className="w-1/2 h-1/2" />
    ) : (
      <img
        src={imgUrl}
        alt="wera_logo"
        className={`w-1/2 h-1/2 ${isActive !== name && "grayscale"}`}
      />
    )}
  </div>
);

export default function Sidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isActive, setIsActive] = useState("dashboard");
  return (
    <div className="flex justify-between items-center flex-col sticky top-5 h-[93vh]">
      <Link to="/hero">
        <Icon
          styles="w-[52px] h-[52px] bg-gray-100 shadow-2xl"
          imgUrl={images.logo}
        />
      </Link>

      <div className="flex-1 flex flex-col justify-between items-center bg-gray-100 rounded-[20px] w-[52px] py-4 mt-12 shadow-2xl ">
        <div className="flex flex-col justify-center items-center gap-3">
          {navlinks.map((link) => (
            <Icon
              key={link.name}
              {...link}
              isActive={isActive}
              handleClick={() => {
                if (!link.disabled) {
                  setIsActive(link.name);
                  navigate(link.link);
                }
              }}
            />
          ))}
        </div>
        <div className="flex flex-col justify-center items-center gap-3">
          {navlink.map((link) => (
            <Icon
              key={link.name}
              {...link}
              isActive={isActive}
              handleClick={async () => {
                try {
                  dispatch(signOutUserStart());
                  const res = await fetch("/api/auth/signout");
                  const data = await res.json();
                  if (data.success === false) {
                    dispatch(deleteUserFailure(data.message));
                    return;
                  }
                  dispatch(deleteUserSuccess(data));
                } catch (error) {
                  dispatch(deleteUserFailure(data.message));
                }
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
