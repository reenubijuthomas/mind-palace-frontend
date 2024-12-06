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
  faUserCircle,
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
      {/* Top Navbar */}
      <div
        className={`fixed top-0 left-0 w-full flex items-center justify-between px-6 py-3 shadow-md z-50 transition-all ${theme === "light"
          ? "bg-gray-100 text-gray-800"
          : "bg-gray-900 text-gray-200"
          }`}
      >
        {/* Hamburger Icon */}
        <button
          className={`p-2 rounded-md focus:outline-none transition ${theme === "light" ? "bg-gray-200 hover:bg-gray-300" : "bg-gray-700 hover:bg-gray-600"
            }`}
          onClick={toggleMenu}
        >
          <FontAwesomeIcon icon={faBars} size="lg" />
        </button>

        <h1
          className={`text-2xl font-extrabold tracking-wide ${
            theme === "light" ? "text-indigo-600" : "text-indigo-400"
          } `}
        >
          Mind Palace
        </h1>



        {/* Right Side: Username & Theme Toggle */}
        <div className="flex items-center space-x-6">

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-4 rounded-full shadow-lg transition ${theme === "light"
              ? "bg-gray-200 text-blue-600 hover:bg-gray-300"
              : "bg-gray-700 text-yellow-400 hover:bg-gray-600"
              }`}
          >
            {theme === "light" ? <Moon size={28} /> : <Sun size={28} />}
          </button>
        </div>

      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 transform transition-transform duration-300 z-40 ${theme === "light" ? "bg-gray-100 text-gray-800" : "bg-gray-900 text-gray-200"
          } ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col h-full">
          <div className="mt-20 space-y-1">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `side-menu-item flex items-center px-6 py-4 rounded-lg transition ${isActive
                  ? theme === "light"
                    ? "bg-indigo-100 text-indigo-700"
                    : "bg-indigo-900 text-indigo-400"
                  : theme === "light"
                    ? "hover:bg-gray-200"
                    : "hover:bg-gray-700"
                }`
              }
            >
              <FontAwesomeIcon icon={faHome} className="menu-icon mr-3" />
              <span>Home</span>
            </NavLink>

            {(roleId === 3 || roleId === 1) && (
              <NavLink
                to="/approvals"
                className={({ isActive }) =>
                  `side-menu-item flex items-center px-6 py-4 rounded-lg transition ${isActive
                    ? theme === "light"
                      ? "bg-indigo-100 text-indigo-700"
                      : "bg-indigo-900 text-indigo-400"
                    : theme === "light"
                      ? "hover:bg-gray-200"
                      : "hover:bg-gray-700"
                  }`
                }
              >
                <FontAwesomeIcon icon={faThumbsUp} className="menu-icon mr-3" />
                <span>Approvals</span>
              </NavLink>
            )}

            <NavLink
              to="/my-ideas"
              className={({ isActive }) =>
                `side-menu-item flex items-center px-6 py-4 rounded-lg transition ${isActive
                  ? theme === "light"
                    ? "bg-indigo-100 text-indigo-700"
                    : "bg-indigo-900 text-indigo-400"
                  : theme === "light"
                    ? "hover:bg-gray-200"
                    : "hover:bg-gray-700"
                }`
              }
            >
              <FontAwesomeIcon icon={faLightbulb} className="menu-icon mr-3" />
              <span>My Ideas</span>
            </NavLink>

            <NavLink
              to="/groups"
              className={({ isActive }) =>
                `side-menu-item flex items-center px-6 py-4 rounded-lg transition ${isActive
                  ? theme === "light"
                    ? "bg-indigo-100 text-indigo-700"
                    : "bg-indigo-900 text-indigo-400"
                  : theme === "light"
                    ? "hover:bg-gray-200"
                    : "hover:bg-gray-700"
                }`
              }
            >
              <FontAwesomeIcon icon={faUsers} className="menu-icon mr-3" />
              <span>Groups</span>
            </NavLink>

            <NavLink
              to="/draft"
              className={({ isActive }) =>
                `side-menu-item flex items-center px-6 py-4 rounded-lg transition ${isActive
                  ? theme === "light"
                    ? "bg-indigo-100 text-indigo-700"
                    : "bg-indigo-900 text-indigo-400"
                  : theme === "light"
                    ? "hover:bg-gray-200"
                    : "hover:bg-gray-700"
                }`
              }
            >
              <FontAwesomeIcon icon={faFileAlt} className="menu-icon mr-3" />
              <span>My Drafts</span>
            </NavLink>

            <NavLink
              to="/bin"
              className={({ isActive }) =>
                `side-menu-item flex items-center px-6 py-4 rounded-lg transition ${isActive
                  ? theme === "light"
                    ? "bg-indigo-100 text-indigo-700"
                    : "bg-indigo-900 text-indigo-400"
                  : theme === "light"
                    ? "hover:bg-gray-200"
                    : "hover:bg-gray-700"
                }`
              }
            >
              <FontAwesomeIcon icon={faTrash} className="menu-icon mr-3" />
              <span>My Bin</span>
            </NavLink>
          </div>

          {/* Bottom Menu */}

          <div className="mt-auto space-y-1">
            <div
              className={`text-lg font-semibold ml-auto pr-6 pl-7 ${theme === "light" ? "text-gray-800" : "text-gray-200"
                }`}
            >
              Hi, {username}
            </div>


            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `side-menu-item flex items-center px-6 py-4 rounded-lg transition ${isActive
                  ? theme === "light"
                    ? "bg-indigo-100 text-indigo-700"
                    : "bg-indigo-900 text-indigo-400"
                  : theme === "light"
                    ? "hover:bg-gray-200"
                    : "hover:bg-gray-700"
                }`
              }
            >
              <FontAwesomeIcon icon={faCog} className="menu-icon mr-3" />
              <span>Settings</span>
            </NavLink>
            <NavLink
              to="/help"
              className={({ isActive }) =>
                `side-menu-item flex items-center px-6 py-4 rounded-lg transition ${isActive
                  ? theme === "light"
                    ? "bg-indigo-100 text-indigo-700"
                    : "bg-indigo-900 text-indigo-400"
                  : theme === "light"
                    ? "hover:bg-gray-200"
                    : "hover:bg-gray-700"
                }`
              }
            >
              <FontAwesomeIcon icon={faQuestionCircle} className="menu-icon mr-3" />
              <span>Help</span>
            </NavLink>
            <button
              onClick={handleLogout}
              className={`side-menu-item flex items-center px-6 py-4 rounded-lg transition w-full text-left ${theme === "light"
                ? "hover:bg-gray-200"
                : "hover:bg-gray-700"
                }`}
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
