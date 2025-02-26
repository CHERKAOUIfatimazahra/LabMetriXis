import React from "react";
import { FaFlask, FaBell } from "react-icons/fa";

const Header = ({
  title,
  userName,
  userInitials,
  notificationCount,
  bgColor,
  hoverColor,
}) => {
  return (
    <header className={`${bgColor} text-white shadow-md`}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <FaFlask className="text-2xl" />
          <h1 className="text-xl font-semibold">{title}</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <FaBell className={`text-xl cursor-pointer hover:${hoverColor}`} />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              {notificationCount}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div
              className={`h-8 w-8 rounded-full ${bgColor.replace(
                "500",
                "800"
              )} flex items-center justify-center`}
            >
              <span className="text-sm font-medium">{userInitials}</span>
            </div>
            <span className="hidden md:inline-block font-medium">
              {userName}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
