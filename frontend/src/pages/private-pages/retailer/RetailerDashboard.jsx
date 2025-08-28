import React, { useEffect } from "react";
import { useState } from "react";
import { useVerifyRouteQuery } from "../../../services/LoginRegisterApi";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "./sidebar-pages/Sidebar";
import Navbar from "./nav-pages/Navbar";
import ContentDisplay from "./ContentDisplay";

function RetailerDashboard() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { data, isLoading, error } = useVerifyRouteQuery(userId);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [content, setContent] = useState({ title: 'Welcome to the Dashboard!', body: 'This is the main content area. Select a link from the sidebar or navbar to view different content.', component: 'Dashboard Overview' });

  const handleContentChange = (title, body, componentName) => {
    setContent({
      title,
      body,
      component: componentName,
    });
  };

  // Redirect if unauthorized
  useEffect(() => {
    if (!isLoading && (error || !data?.status)) {
      navigate("/unified-health-tech/login");
    }
  }, [error, data, isLoading, navigate]);

  if (isLoading) return <div>Loading...</div>;
  
  // Map of page names to their components

  
  return (
     <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* Sidebar - This component contains the left navigation menu */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        onContentChange={handleContentChange}
      />

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
        {/* Navbar - This component contains the top bar */}
        <Navbar
          setIsSidebarOpen={setIsSidebarOpen}
          isSidebarOpen={isSidebarOpen}
          onContentChange={handleContentChange}
        />

        {/* Content Section - Main area for displaying content */}
        <div className="p-8 flex-1">
          <ContentDisplay content={content} />
        </div>
      </div>
    </div>
  );
}

export default RetailerDashboard;
