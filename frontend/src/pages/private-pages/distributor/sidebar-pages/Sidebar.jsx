import React, { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  FileText,
  LineChart,
  Hammer,
  Shield,
  Cloud,
  HelpCircle,
  LogOut,
  Menu as MenuIcon,
  ChevronDown,
} from "lucide-react";
import SidebarItem from "./SidebarItem";

function Sidebar({ isSidebarOpen, setIsSidebarOpen, onContentChange }) {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeSub, setActiveSub] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const sidebarRef = useRef(null);

  const sidebarItems = [
    {
      name: "Transactions",
      icon: <LayoutDashboard size={20} />,
      dropdown: [{ name: "Retail Sales Bill" }, { name: "Purchases Bill" }],
    },
    {
      name: "Inventory",
      icon: <FileText size={20} />,
      dropdown: [{ name: "Stock Inward" }, { name: "Stock Outward" }],
    },
    {
      name: "Orders",
      icon: <LineChart size={20} />,
      dropdown: [
        {
          name: "Received",
          subDropdown: [
            { name: "Orders by Date" },
            { name: "Orders by Company" },
          ],
        },
        { name: "Completed" },
      ],
    },
    {
      name: "Company/Party",
      icon: <Hammer size={20} />,
      dropdown: [{ name: "Add new" }, { name: "Search" }],
    },
    {
      name: "Security",
      icon: <Shield size={20} />,
      dropdown: [{ name: "Password Change" }],
    },
    {
      name: "Backup",
      icon: <Cloud size={20} />,
      dropdown: [{ name: "Regular Backup" }],
    },
    {
      name: "Help",
      icon: <HelpCircle size={20} />,
      dropdown: [{ name: "Toll Free no" }],
    },
    {
      name: "Quit",
      icon: <LogOut size={20} />,
      dropdown: [{ name: "Log Out" }, { name: "Close" }],
    },
  ];

  const handleDropdownClick = (itemName) => {
    setActiveDropdown(activeDropdown === itemName ? null : itemName);
  };

  const handleSubDropdownClick = (subName) => {
    setActiveSub(activeSub === subName ? null : subName);
  };

  const handleLinkClick = (name) => {
    onContentChange(name, "", name);
    setActiveItem(name);
    setActiveDropdown(null);
    setActiveSub(null);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setActiveDropdown(null);
        setActiveSub(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={sidebarRef}
      className={`fixed inset-y-0 left-0 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out 
            ${isSidebarOpen ? "translate-x-0 w-64" : "-translate-x-full w-64"} overflow-y-auto`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <MenuIcon size={24} className="text-gray-600" />
          <span className="text-xl font-semibold text-gray-800 ml-6">
            Dashboard
          </span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-full hover:bg-gray-200 focus:outline-none cursor-pointer"
        >
          <ChevronDown
            size={20}
            className={`transform transition-transform duration-200 ${
              isSidebarOpen ? "rotate-90" : "rotate-270"
            }`}
          />
        </button>
      </div>

      <nav className="mt-4">
        {sidebarItems.map((item) => (
          <div key={item.name}>
            <SidebarItem
              name={item.name}
              icon={item.icon}
              hasDropdown={!!item.dropdown}
              onClick={() => handleDropdownClick(item.name)}
              isDropdownOpen={activeDropdown === item.name}
            />

            {/* Dropdown */}
            {item.dropdown && activeDropdown === item.name && (
              <ul className="pl-8 transition-all duration-300 overflow-visible">
                {item.dropdown.map((subItem) => (
                  <li key={subItem.name} className="relative">
                    <button
                      onClick={() =>
                        subItem.subDropdown
                          ? handleSubDropdownClick(subItem.name) // toggle sub dropdown
                          : handleLinkClick(subItem.name) // normal navigation
                      }
                      className={`flex items-center justify-between w-full p-2 rounded-md cursor-pointer 
                        ${
                          activeItem === subItem.name
                            ? "bg-purple-100 text-purple-600"
                            : "text-gray-600 hover:text-blue-500"
                        }`}
                    >
                      <span>{subItem.name}</span>

                      {/* Arrow for sub dropdown */}
                      {subItem.subDropdown && (
                        <ChevronDown
                          size={16}
                          className={`transform transition-transform ${
                            activeSub === subItem.name ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </button>

                    {/* 🔽 Sub-dropdown appears BELOW */}
                    {subItem.subDropdown && activeSub === subItem.name && (
                      <ul className="pl-6 mt-1 space-y-1">
                        {subItem.subDropdown.map((nestedItem) => (
                          <li key={nestedItem.name}>
                            <button
                              onClick={() => handleLinkClick(nestedItem.name)}
                              className={`block w-full text-left p-2 rounded-md cursor-pointer 
                                ${
                                  activeItem === nestedItem.name
                                    ? "bg-purple-100 text-purple-600"
                                    : "text-gray-600 hover:text-blue-500"
                                }`}
                            >
                              {nestedItem.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;
