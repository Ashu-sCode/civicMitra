import React from 'react';
import { 
  X, Home, FileText, Search, Info, Phone, Sun, Moon, Download,
  Shield, User, Settings, LogOut, ChevronRight
} from 'lucide-react';
import { useTheme } from "../context/ThemeContext";
import { Link } from 'react-router-dom';

const MobileSidebar = ({ 
  isMenuOpen, 
  closeMenu, 
  navLinks, 
  isInstallable, 
  handleInstallApp 
}) => {
  const { isDarkMode, toggleTheme } = useTheme();

  // Profile menu items
  const profileItems = [
    { name: 'My Profile', icon: User, path: '/profile' },
    { name: 'Settings', icon: Settings, path: '/settings' },
    { name: 'Logout', icon: LogOut, path: '/logout', isDestructive: true }
  ];

  return (
    <>
      {/* Sidebar Panel */}
      <div className={`lg:hidden fixed inset-y-0 left-0 z-50 w-72 flex flex-col bg-white dark:bg-gray-900 shadow-2xl transform transition-transform duration-300 ease-out ${
        isMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-5 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="font-bold text-lg">CivicMitra</div>
              <div className="text-blue-100 text-xs">सिविक मित्र</div>
            </div>
          </div>
          <button
            onClick={closeMenu}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
            aria-label="Close Menu"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* User Profile */}
        <div className="flex-shrink-0 p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-md">
              U
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                User Name
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                user@example.com
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="px-4 space-y-1">
            <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-3 mb-2">
              Navigation
            </div>
            {navLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={closeMenu}
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 font-medium group"
                >
                  <div className="w-9 h-9 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors duration-200">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span className="flex-1">{link.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="my-4 border-t border-gray-200 dark:border-gray-700" />

          {/* Profile Section */}
          <div className="px-4 space-y-1">
            <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-3 mb-2">
              Account
            </div>
            {profileItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={closeMenu}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 font-medium ${
                    item.isDestructive 
                      ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors duration-200 ${
                    item.isDestructive
                      ? 'bg-red-100 dark:bg-red-900/30 group-hover:bg-red-200 dark:group-hover:bg-red-900/50'
                      : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30'
                  }`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span className="flex-1">{item.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="my-4 border-t border-gray-200 dark:border-gray-700" />

          {/* Theme Toggle */}
          <div className="px-4">
            <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-3 mb-2">
              Preferences
            </div>
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
            >
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  {isDarkMode ? <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" /> : <Sun className="w-5 h-5 text-yellow-500" />}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                </span>
              </div>
              <div className="w-12 h-6 bg-gray-200 dark:bg-gray-600 rounded-full p-0.5 transition-colors duration-200">
                <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}`} />
              </div>
            </button>
          </div>
        </nav>

        {/* Footer */}
        <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 space-y-3">
          {isInstallable && (
            <button
              onClick={() => {
                handleInstallApp();
                closeMenu();
              }}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl transition-all duration-200 font-medium shadow-md hover:shadow-lg"
            >
              <Download className="w-5 h-5" />
              <span>Install CivicMitra</span>
            </button>
          )}
          <div className="text-center space-y-1 text-xs text-gray-500 dark:text-gray-400">
            <div>Version 1.0.0 • Made in India 🇮🇳</div>
            <div>Digital India • आत्मनिर्भर भारत</div>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {isMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-all duration-300"
          onClick={closeMenu}
        />
      )}
    </>
  );
};

export default MobileSidebar;
