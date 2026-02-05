import React, { useState, useRef, useEffect } from 'react';
import { FiMenu, FiSearch, FiMoon, FiMaximize2, FiBell, FiSettings, FiUser, FiCalendar, FiHelpCircle, FiLock, FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const Header = ({ toggleSidebar, onLogout }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setIsProfileOpen(false);
    // Call the onLogout prop to update authentication state
    if (onLogout) {
      onLogout();
    }
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="px-8 py-4 flex items-center justify-between">
        
        {/* Left Section - Menu & Search */}
        <div className="flex items-center gap-6 flex-1">
          
          {/* Menu Button */}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition text-gray-700"
          >
            <FiMenu size={24} />
          </button>

          {/* Search Bar */}
          <div className="relative hidden md:block max-w-xs flex-1">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
            />
          </div>
        </div>

        {/* Right Section - Icons & Profile */}
        <div className="flex items-center gap-6">
          
          {/* Dark Mode Button */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-lg hover:bg-gray-100 transition text-gray-700"
            title="Toggle Dark Mode"
          >
            <FiMoon size={20} />
          </button>

          {/* Fullscreen Button */}
          <button
            className="p-2 rounded-lg hover:bg-gray-100 transition text-gray-700"
            title="Fullscreen"
          >
            <FiMaximize2 size={20} />
          </button>

          {/* Notifications Button */}
          <div className="relative">
            <button
              className="p-2 rounded-lg hover:bg-gray-100 transition text-gray-700 relative"
              title="Notifications"
            >
              <FiBell size={20} />
              {notifications > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>
          </div>

          {/* Settings Button */}
          <button
            className="p-2 rounded-lg hover:bg-gray-100 transition text-gray-700"
            title="Settings"
          >
            <FiSettings size={20} />
          </button>

          {/* Profile Avatar with Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 hover:bg-gray-100 rounded-lg p-1 transition"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 hover:border-indigo-500 transition">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop"
                  alt="User Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-lg font-bold text-gray-800">Welcome Gaston!</p>
                </div>

                {/* Dropdown Menu Items */}
                <div className="py-1">
                  <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50">
                    <FiUser className="w-5 h-5" />
                    <span>My Schedules</span>
                  </a>
                  
                  <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50">
                    <FiCalendar className="w-5 h-5" />
                    <span>Pricing</span>
                  </a>
                  
                  <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50">
                    <FiHelpCircle className="w-5 h-5" />
                    <span>Help</span>
                  </a>
                  
                  <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50">
                    <FiLock className="w-5 h-5" />
                    <span>Lock screen</span>
                  </a>
                  
                  <div className="border-t border-gray-100 my-2"></div>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50"
                  >
                    <FiLogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;