import React, { useState, useEffect, useRef } from "react";
import { Menu as MenuIcon, ChevronDown, User } from "lucide-react";

function Navbar({ setIsSidebarOpen, isSidebarOpen, onContentChange }) {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navRef = useRef(null);

 

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      ref={navRef}
      className="bg-white border-b border-gray-200 shadow-sm p-4 sticky top-0 z-40"
    >
      <div className="flex items-center justify-between">
        {/* Left side: Menu button + Logo */}
        <div className="flex items-center space-x-2">
          {!isSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-full hover:bg-gray-200 cursor-pointer"
            >
              <MenuIcon size={24} />
            </button>
          )}

          <button
            className="text-xl font-semibold text-gray-800 cursor-pointer"
            onClick={() =>
              onContentChange("Dashboard Overview", "", "Dashboard Overview")
            }
          >
            Logo here
          </button>
        </div>

       

        {/* Right: User */}
        <div className="flex items-center space-x-4">
          <span className="text-gray-700 font-medium">Name</span>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
              <User size={18} />
            </div>
            
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
