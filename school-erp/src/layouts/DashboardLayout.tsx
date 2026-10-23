import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Topbar } from '../components/layout/Topbar';

/**
 * Shell layout for all authenticated routes.
 * Includes the fixed Sidebar, sticky Topbar, and a main content area.
 */
export const DashboardLayout: React.FC = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const location = useLocation();

  // Generate a page title based on the current route
  const getPageTitle = (path: string) => {
    const parts = path.split('/').filter(Boolean);
    if (parts.length < 2) return 'Dashboard';
    const lastPart = parts[parts.length - 1];
    return lastPart.charAt(0).toUpperCase() + lastPart.slice(1).replace('-', ' ');
  };

  const title = getPageTitle(location.pathname);

  return (
    <div className="min-h-screen bg-[#F5F8FC] flex font-sans text-[#1A1A1A]">
      {/* Sidebar Component */}
      <Sidebar 
        isMobileOpen={isMobileSidebarOpen} 
        onMobileClose={() => setIsMobileSidebarOpen(false)} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:ml-[220px] min-w-0 transition-all duration-300">
        <Topbar 
          title={title} 
          onMobileMenuClick={() => setIsMobileSidebarOpen(true)} 
        />
        
        {/* Page Content rendered by React Router Outlet */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
