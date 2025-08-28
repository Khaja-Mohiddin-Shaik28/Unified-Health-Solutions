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
import DashboardOverview from "../DashboardOverview";

function Sidebar({ isSidebarOpen, setIsSidebarOpen, onContentChange }) {
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [activeItem, setActiveItem] = useState(null);
    const sidebarRef = useRef(null);

    const sidebarItems = [
        {
            name: 'Transactions',
            icon: <LayoutDashboard size={20} />,
            dropdown: [{ name: 'Transaction Overview' }, { name: 'Analytics' }],
        },
        {
            name: 'Masters',
            icon: <FileText size={20} />,
            dropdown: [
                { name: 'Batches' }, { name: 'Products' }, { name: 'Companies' }, 
                { name: 'Customers/Supplier' }, { name: 'Composition' }, 
                { name: 'Rack No.' }, { name: 'Stock Value' }, 
                { name: 'Accounts' }, { name: 'Acc Groups' }, { name: 'Acc sub groups' }
            ],
        },
        {
            name: 'Reports',
            icon: <LineChart size={20} />,
            dropdown: [
                { name: 'Sales' }, { name: 'Purchases' }, { name: 'Receipts' },
                { name: 'Payments' }, { name: 'Vouchers' }, { name: 'Credit Sales' },
                { name: 'Credit Purchases' }, { name: 'EInvoice/E Way Bill' },
                { name: 'Order for Supplier' }
            ],
        },
        {
            name: 'Tools',
            icon: <Hammer size={20} />,
            dropdown: [{ name: 'Settings' }, { name: 'Integrations' }],
        },
        {
            name: 'Security',
            icon: <Shield size={20} />,
            dropdown: [
                { name: 'Password Change' }, { name: 'Who Am I' }, 
                { name: 'Control Settings' }, { name: 'Add New User' }
            ],
        },
        {
            name: 'Backup',
            icon: <Cloud size={20} />,
            dropdown: [{ name: 'Create Backup' }, { name: 'Restore' }],
        },
        {
            name: 'Automation',
            icon: <Cloud size={20} />,
            dropdown: [
                { name: 'Global items Search' }, { name: 'Suppliers Stock' }, 
                { name: 'Invoice Exports' }, { name: 'Profit Orders' }, 
                { name: 'My Business graph' }, { name: 'Post Card' }, 
                { name: 'Restart/Close Weblink' }, { name: 'Chrome Driver Download' }
            ],
        },
        {
            name: 'Help',
            icon: <HelpCircle size={20} />,
            dropdown: [{ name: 'Text/Chat' }, { name: 'Customer care' }],
        },
        {
            name: 'Quit',
            icon: <LogOut size={20} />,
            dropdown: [{ name: 'Log Out' }, { name: 'Close' }],
        },
    ];

    const handleDropdownClick = (itemName) => {
        setActiveDropdown(activeDropdown === itemName ? null : itemName);
    };

    const handleLinkClick = (name) => {
        onContentChange(name, '', name);
        setActiveItem(name);
        setActiveDropdown(null);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setActiveDropdown(null);
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
                    <span
                        className="text-xl font-semibold text-gray-800 ml-6"
                        
                    >
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

                        {item.dropdown && activeDropdown === item.name && (
                            <ul className="pl-8 transition-all duration-300 overflow-hidden">
                                {item.dropdown.map((subItem) => (
                                    <li key={subItem.name}>
                                        <button
                                            onClick={() => handleLinkClick(subItem.name)}
                                            className={`block w-full text-left p-2 rounded-md cursor-pointer 
                                                ${activeItem === subItem.name ? "bg-purple-100 text-purple-600" : "text-gray-600 hover:text-blue-500"}`}
                                        >
                                            {subItem.name}
                                        </button>
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
