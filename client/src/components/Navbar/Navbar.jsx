import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { BellIcon } from "@heroicons/react/24/outline";

import { images } from "../../assets";
import { navlinks, navlink } from "../../constants";

export default function Navbar() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [isActive, setIsActive] = useState("dashboard");
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const [searchPlaceholder, setSearchPlaceholder] =
    useState("Search for runners");

  useEffect(() => {
    // Check if currentUser is null or undefined, redirect to home if no user
    if (currentUser === null) {
      navigate("/");
    }
  }, [currentUser, navigate]);
  useEffect(() => {
    const activePage =
      navlinks.find((link) => link.link === location.pathname) ||
      navlink.find((link) => link.link === location.pathname);

    if (activePage && activePage.name === "dashboard") {
      setSearchPlaceholder("Search for runners");
    } else if (activePage && activePage.name === "profile") {
      setSearchPlaceholder("Search for runners");
    } else {
      setSearchPlaceholder(`Search for ${activePage.name}`);
    }
  }, [location.pathname]);

  return (
    <div className="flex md:flex-row flex-col-reverse justify-between mb-[35px] gap-6">
      <div className="lg:flex-1 flex flex-row max-w-[458px] py-2 pl-4 pr-2 h-[52px] bg-gray-100 rounded-[100px] shadow-2xl">
        <input
          type="text"
          placeholder={searchPlaceholder}
          className="flex w-full font-epilogue font-normal text-[14px] placeholder:text-[#4b5264] text-white bg-transparent outline-none border-none "
        />

        <div className="w-[72px] h-full rounded-[20px] bg-[#4acd8d] flex justify-center items-center cursor-pointer shadow-2xl ">
          <img
            src={images.search}
            alt="search"
            className="w-[15px] h-[15px] object-contain"
          />
        </div>
      </div>
      <div className="sm:flex hidden flex-row justify-end gap-4">
        <p className="mt-2.5">{currentUser.username}</p>
        <Link to="/profile">
          <div>
            <img
              src={currentUser.avatar}
              alt="user"
              className="w-10 h-10 rounded-full bg-gray-100 flex justify-center items-center cursor-pointer shadow-2xl object-cover "
            />
          </div>
        </Link>
      </div>

      {/* small screen navigation */}
      <div className="sm:hidden flex justify-between items-center relative">
        <div className="w-[40px] h-[40px] rounded-[10px] bg-purple-50 flex justify-center items-center cursor-pointer ">
          <img
            src={images.logo}
            alt="user"
            className="w-[60%] h-[60%] object-contain "
          />
        </div>

        <img
          src={images.menu}
          alt="menu"
          className="w-[34px] h-[34px] object-contain cursor-pointer"
          onClick={() => setToggleDrawer((prev) => !prev)}
        />

        <div
          className={`absolute top-[60px] right-0 left-0 bg-gray-100 shadow-2xl z-10 shadow-secondary py-4 ${
            !toggleDrawer ? "-translate-y-[100vh]" : "trnslate-y-0"
          } transition-all duration-700`}
        >
          <ul className="mb-4">
            {navlinks.map((Link) => (
              <li
                key={Link.name}
                className={`flex p-4 ${isActive === Link.name && "bg-#3a3a43"}`}
                onClick={() => {
                  setIsActive(Link.name);
                  setToggleDrawer(false);
                  navigate(Link.link);
                }}
              >
                <img
                  src={Link.imgUrl}
                  alt={Link.name}
                  className={`w-[20px] h-[24px] object-contain ${
                    isActive === Link.name ? "grayscale-0" : "grayscale"
                  }`}
                />
                <p
                  className={`ml-[20px] font-epilogue font-semibold text-[14px] ${
                    isActive === Link.name ? "text-[#1dc071]" : "text-[#808191]"
                  }`}
                >
                  {Link.name}
                </p>
              </li>
            ))}
          </ul>

          <div className="flex mb-4">
            {navlink.map((Link) => (
              <li
                key={Link.name}
                className={`flex p-4 ${isActive === Link.name && "bg-#3a3a43"}`}
                onClick={() => {
                  setIsActive(Link.name);
                  setToggleDrawer(false);
                  navigate(Link.link);
                }}
              >
                <img
                  src={Link.imgUrl}
                  alt={Link.name}
                  className={`w-[20px] h-[24px] object-contain ${
                    isActive === Link.name ? "grayscale-0" : "grayscale"
                  }`}
                />
                <p
                  className={`ml-[20px] font-epilogue font-semibold text-[14px] ${
                    isActive === Link.name ? "text-[#1dc071]" : "text-[#808191]"
                  }`}
                >
                  {Link.name}
                </p>
              </li>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
