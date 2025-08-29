import React from 'react'
import { ChevronRight } from "lucide-react";

function SidebarItem({ name, icon, hasDropdown, onClick, isDropdownOpen }) {
  return (
    <button
      onClick={onClick}
      className={`group flex items-center space-x-3 p-4 rounded-md cursor-pointer w-full text-left transition-colors duration-200
        ${isDropdownOpen ? 'bg-purple-100 text-purple-600' : 'text-gray-700 hover:bg-gray-200 hover:text-blue-600'}`}
    >
      {icon}
      <span className="flex-1">{name}</span>
      {hasDropdown && (
        <ChevronRight
          size={20}
          className={`transform transition-transform duration-200 ${isDropdownOpen ? 'rotate-90' : 'rotate-0'}`}
        />
      )}
    </button>
  );
}

export default SidebarItem;
