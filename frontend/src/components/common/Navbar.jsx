// src/components/Navbar/Navbar.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  Menu,
  Home,
  FileText,
  Search,
  Info,
  Phone,
  Sun,
  Moon,
  Download,
  Shield,
  User,
  Settings,
  LogOut,
  ChevronDown,
  LayoutDashboard,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import MobileSidebar from "./MobileSidebar";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const location = useLocation();

  // PWA install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () =>
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
  }, []);

  const handleInstallApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setIsInstallable(false);
    setDeferredPrompt(null);
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const navLinks = [
    { name: "Home", path: "/", icon: Home },
    { name: "Report Issue", path: "/report", icon: FileText },
    { name: "Track Status", path: "/track-report", icon: Search },
    { name: "Nearby Reports", path: "/report-list", icon: Search },
    { name: "About Us", path: "/about", icon: Info },
    { name: "Contact", path: "/contact", icon: Phone },
  ];

  const profileItems = [
    { name: "My Profile", path: "/profile", icon: User },
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Settings", path: "/settings", icon: Settings },
    { name: "Logout", path: "/logout", icon: LogOut, isDestructive: true },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      <nav className="bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3 cursor-pointer">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg shadow-md flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">🇮🇳</span>
                </div>
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl md:text-2xl font-bold text-blue-700 dark:text-blue-400 tracking-tight">
                  CivicMitra
                </h1>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium hidden sm:block">
                  सिविक मित्र • Citizen Services
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => {
                const IconComponent = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-blue-50 dark:bg-gray-800 text-blue-600 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400"
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Desktop Utility Buttons */}
            <div className="hidden lg:flex items-center space-x-3">
              {/* PWA Install */}
              {isInstallable && (
                <button
                  onClick={handleInstallApp}
                  className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg text-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Install</span>
                </button>
              )}

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
                aria-label={
                  isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
                }
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600" />
                )}
              </button>

              {/* Profile Dropdown */}
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    U
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                    {profileItems.map((item) => {
                      const IconComponent = item.icon;
                      return (
                        <Link
                          key={item.name}
                          to={item.path}
                          onClick={() => setIsProfileOpen(false)}
                          className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                            item.isDestructive
                              ? "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          }`}
                        >
                          <IconComponent className="w-4 h-4" />
                          <span>{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Hamburger */}
            <div className="lg:hidden flex items-center">
              <button
                aria-label="Toggle Menu"
                aria-expanded={isMenuOpen}
                onClick={toggleMenu}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
              >
                <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <MobileSidebar
        isMenuOpen={isMenuOpen}
        closeMenu={() => setIsMenuOpen(false)}
        navLinks={navLinks}
        isInstallable={isInstallable}
        handleInstallApp={handleInstallApp}
      />
    </>
  );
};

export default Navbar;
