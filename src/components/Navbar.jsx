import React from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faThumbsUp,
  faLightbulb,
  faUsers,
  faFileAlt,
  faTrash,
  faCog,
  faQuestionCircle,
  faSignOutAlt,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { Sun, Moon } from "lucide-react";

const Navbar = ({
  theme,
  toggleTheme,
  username,
  menuOpen,
  toggleMenu,
  handleLogout,
  roleId,
}) => {
  return (
    <div className="relative">
      {/* Top Banner */}
      <div
        className={`fixed top-0 left-0 w-full flex items-center justify-between px-6 py-3 shadow-md z-50 ${
          theme === "light"
            ? "bg-white text-gray-800"
            : "bg-gray-900 text-gray-100"
        }`}
      >
        {/* Hamburger Icon */}
        <button
          className={`p-2 rounded-md focus:outline-none ${
            theme === "light" ? "bg-gray-200 hover:bg-gray-300" : "bg-gray-700"
          }`}
          onClick={toggleMenu}
        >
          <FontAwesomeIcon icon={faBars} size="lg" />
        </button>

        {/* Centered Title */}
        <h1 className="text-2xl font-bold mx-auto">Mind Palace</h1>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={`p-3 rounded-full shadow-lg transition-all ${
            theme === "light"
              ? "bg-gray-200 text-blue-600 hover:bg-gray-300"
              : "bg-gray-700 text-yellow-400 hover:bg-gray-600"
          }`}
        >
          {theme === "light" ? <Moon /> : <Sun />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 transform transition-transform duration-300 ease-in-out z-40 ${
          theme === "light" ? "bg-gray-100 text-gray-800" : "bg-gray-800 text-white"
        } ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col h-full">
          <div className="mt-20">
            <NavLink
              to="/"
              activeClassName="active"
              className={`side-menu-item flex items-center px-6 py-4 hover:${
                theme === "light" ? "bg-gray-200" : "bg-gray-700"
              }`}
            >
              <FontAwesomeIcon icon={faHome} className="menu-icon mr-3" />
              <span>Home</span>
            </NavLink>
            {(roleId === 3 || roleId === 1) && (
              <NavLink
                to="/approvals"
                activeClassName="active"
                className={`side-menu-item flex items-center px-6 py-4 hover:${
                  theme === "light" ? "bg-gray-200" : "bg-gray-700"
                }`}
              >
                <FontAwesomeIcon icon={faThumbsUp} className="menu-icon mr-3" />
                <span>Approvals</span>
              </NavLink>
            )}
            <NavLink
              to="/my-ideas"
              activeClassName="active"
              className={`side-menu-item flex items-center px-6 py-4 hover:${
                theme === "light" ? "bg-gray-200" : "bg-gray-700"
              }`}
            >
              <FontAwesomeIcon icon={faLightbulb} className="menu-icon mr-3" />
              <span>My Ideas</span>
            </NavLink>
            <NavLink
              to="/groups"
              activeClassName="active"
              className={`side-menu-item flex items-center px-6 py-4 hover:${
                theme === "light" ? "bg-gray-200" : "bg-gray-700"
              }`}
            >
              <FontAwesomeIcon icon={faUsers} className="menu-icon mr-3" />
              <span>Groups</span>
            </NavLink>
            <NavLink
              to="/draft"
              activeClassName="active"
              className={`side-menu-item flex items-center px-6 py-4 hover:${
                theme === "light" ? "bg-gray-200" : "bg-gray-700"
              }`}
            >
              <FontAwesomeIcon icon={faFileAlt} className="menu-icon mr-3" />
              <span>My Drafts</span>
            </NavLink>
            <NavLink
              to="/bin"
              activeClassName="active"
              className={`side-menu-item flex items-center px-6 py-4 hover:${
                theme === "light" ? "bg-gray-200" : "bg-gray-700"
              }`}
            >
              <FontAwesomeIcon icon={faTrash} className="menu-icon mr-3" />
              <span>My Bin</span>
            </NavLink>
          </div>

          {/* Bottom Menu */}
          <div className="mt-auto">
            <NavLink
              to="/settings"
              className={`side-menu-item flex items-center px-6 py-4 hover:${
                theme === "light" ? "bg-gray-200" : "bg-gray-700"
              }`}
            >
              <FontAwesomeIcon icon={faCog} className="menu-icon mr-3" />
              <span>Settings</span>
            </NavLink>
            <NavLink
              to="/help"
              className={`side-menu-item flex items-center px-6 py-4 hover:${
                theme === "light" ? "bg-gray-200" : "bg-gray-700"
              }`}
            >
              <FontAwesomeIcon icon={faQuestionCircle} className="menu-icon mr-3" />
              <span>Help</span>
            </NavLink>
            <button
              onClick={handleLogout}
              className={`side-menu-item flex items-center px-6 py-4 hover:${
                theme === "light" ? "bg-gray-200" : "bg-gray-700"
              } w-full text-left`}
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="menu-icon mr-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
