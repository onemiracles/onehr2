import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import DarkModeToggle from './DarkModeToggle';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-primary-800 dark:bg-gray-900 text-white shadow-lg">
      <div className="mx-4 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex gap-2 items-center">
            <div className="flex-shrink-0 flex items-center">
              <button
                onClick={toggleSidebar}
                className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
              >
                <FontAwesomeIcon icon={faBars} />
              </button>
              <img className="h-8 w-auto" src="/logo.png" alt="Company Logo" />
            </div>
            <DarkModeToggle />
          </div>
          <div className="flex items-center">
            <Link to="/profile" className="px-3 py-2 rounded-md text-sm font-medium">
              <FontAwesomeIcon icon={faUser} className="mr-2" />
              {user.email}
            </Link>
            <button
              onClick={logout}
              className="px-3 py-2 rounded-md text-sm font-medium"
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;