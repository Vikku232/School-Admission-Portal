import React from 'react';
import { Menu, Bell } from 'lucide-react';

interface TopbarProps {
  onMobileMenuClick: () => void;
  title?: string;
}

export const Topbar: React.FC<TopbarProps> = ({ onMobileMenuClick, title = 'Dashboard' }) => {
  return (
    <header className="h-[56px] bg-white border-b border-[#E8EDF2] flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30 shadow-xs">
      <div className="flex items-center gap-3">
        {/* Mobile Menu Toggle */}
        <button 
          className="p-1.5 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100 md:hidden"
          onClick={onMobileMenuClick}
        >
          <Menu className="w-6 h-6" />
        </button>
        
        <h1 className="text-lg font-bold text-[#1A4A7A] font-poppins">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
      </div>
    </header>
  );
};
