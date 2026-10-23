import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { 
  LayoutDashboard, Users, UserCheck, BookOpen, 
  CalendarClock, IndianRupee, FileText, ClipboardList, 
  LogOut, School 
} from 'lucide-react';

interface SidebarProps {
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onMobileClose }) => {
  const role = useAuthStore((state) => state.user?.role);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  // Define navigation links based on user role
  const getNavLinks = () => {
    switch (role) {
      case 'admin':
        return [
          { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
          { to: '/admin/admissions', icon: UserCheck, label: '11th Admissions' },
          { to: '/admin/students', icon: Users, label: 'All Students' },
          { to: '/admin/teachers', icon: UserCheck, label: 'Teachers' },
          { to: '/admin/grades', icon: BookOpen, label: 'Grades & Courses' },
          { to: '/admin/timetable', icon: CalendarClock, label: 'Timetable' },
          { to: '/admin/fees', icon: IndianRupee, label: 'Fee Structure' },
          { to: '/admin/payments', icon: FileText, label: 'Payments' },
          { to: '/admin/analytics', icon: ClipboardList, label: 'Analytics' },
        ];
      case 'teacher':
        return [
          { to: '/teacher/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
          { to: '/teacher/students', icon: Users, label: 'My Students' },
          { to: '/teacher/exams', icon: FileText, label: 'Exams' },
          { to: '/teacher/assignments', icon: BookOpen, label: 'Assignments' },
          { to: '/teacher/attendance', icon: UserCheck, label: 'Attendance' },
        ];
      case 'student':
        return [
          { to: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
          { to: '/student/fees', icon: IndianRupee, label: 'Fees & Invoices' },
          { to: '/student/exams', icon: FileText, label: 'Exams & Results' },
          { to: '/student/assignments', icon: BookOpen, label: 'Assignments' },
          { to: '/student/attendance', icon: UserCheck, label: 'Attendance' },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden"
          onClick={onMobileClose}
        ></div>
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 left-0 z-50 h-screen bg-[#0F2744] text-white flex flex-col w-[220px] transition-transform duration-300
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Logo Area */}
        <div className="h-14 flex items-center px-5 border-b border-white/10 shrink-0">
          <School className="w-6 h-6 text-[#F5C518] mr-2" />
          <h1 className="font-poppins font-bold text-lg tracking-wide">SchoolERP</h1>
        </div>

        {/* Role Badge */}
        <div className="px-5 py-4 border-b border-white/10 shrink-0">
          <div className="bg-white/10 text-blue-100 text-xs font-bold uppercase tracking-wider py-1.5 px-3 rounded-lg inline-block font-poppins">
            {role} Portal
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={onMobileClose}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${isActive 
                    ? 'bg-blue-600/30 text-white border border-blue-500/30' 
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'}
                `}
              >
                <Icon className="w-5 h-5" />
                {link.label}
              </NavLink>
            );
          })}
        </nav>

        {/* User Footer */}
        <div className="border-t border-white/10 p-4 shrink-0">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold uppercase">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate text-white">{user?.name}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white/5 text-slate-300 hover:bg-red-500/20 hover:text-red-400 transition-colors text-sm font-semibold"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};
