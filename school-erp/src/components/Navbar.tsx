import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Phone, Mail, MapPin, Sparkles, Search, GraduationCap, Clock } from 'lucide-react';
import { SCHOOL_INFO } from '../data/schoolData';

interface NavbarProps {
  onOpenDrawer: () => void;
  onOpenAdmissions: () => void;
  onOpenSearch: () => void;
  activeSection: string;
  onNavigateSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenDrawer,
  onOpenAdmissions,
  onOpenSearch,
  activeSection,
  onNavigateSection
}) => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full font-sans transition-all duration-300">
      {/* TOP TESTING & DEMO NOTICE BANNER */}
      <div className="bg-gradient-to-r from-amber-400 via-[#F5C518] to-amber-300 text-slate-950 px-4 py-2 text-xs sm:text-sm font-semibold border-b border-amber-500/40 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="bg-[#1E3A8A] text-[#F5C518] px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-extrabold tracking-wider uppercase flex items-center gap-1.5 shadow-xs shrink-0">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              TESTING PURPOSE ONLY
            </span>
            <span className="text-slate-950 font-bold">
              Notice: This website is for testing purpose only. If you want to change anything, we will change and update it.
            </span>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 bg-[#1E3A8A]/10 text-[#1E3A8A] px-2.5 py-0.5 rounded-md text-[11px] font-extrabold tracking-wide uppercase border border-[#1E3A8A]/20 shrink-0">
            ✨ Customization on Request
          </span>
        </div>
      </div>

      {/* TOP EMERGENCY & INFORMATION STRIP */}
      <div className="bg-[#1E3A8A] text-white text-xs py-1.5 px-4 hidden md:block border-b border-blue-900/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6 text-slate-200">
            <span className="flex items-center gap-1.5 text-[#F5C518] font-bold">
              <Clock className="w-3.5 h-3.5 text-[#F5C518]" />
              <span>Timing: {SCHOOL_INFO.schoolTiming}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#F5C518]" />
              <span>{SCHOOL_INFO.phone}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#F5C518]" />
              <span>{SCHOOL_INFO.email}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#F5C518]" />
              <span>{SCHOOL_INFO.address}</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="bg-blue-900/80 text-[#F5C518] px-2.5 py-0.5 rounded-full text-[11px] font-semibold border border-[#F5C518]/30">
              {SCHOOL_INFO.cbseAffiliation}
            </span>
            <button
              onClick={onOpenAdmissions}
              className="text-[#F5C518] font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Class 11th & 12th Admissions Open</span>
              <Sparkles className="w-3 h-3 fill-[#F5C518]" />
            </button>
          </div>
        </div>
      </div>

      {/* MAIN NAVBAR */}
      <nav className={`w-full bg-white transition-all duration-300 ${scrolled ? 'shadow-md py-2.5' : 'py-3.5 border-b border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          
          {/* RIPS LOGO & BRAND */}
          <div 
            onClick={() => onNavigateSection('hero')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-xl bg-[#1E3A8A] flex items-center justify-center text-[#F5C518] shadow-md group-hover:scale-105 transition-transform">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black font-poppins text-[#1E3A8A] tracking-wider">
                  RIPS
                </span>
                <span className="text-[10px] font-bold text-[#F5C518] bg-[#1E3A8A] px-1.5 py-0.2 rounded font-poppins">
                  CLASSES 11 & 12
                </span>
              </div>
              <p className="text-[11px] font-semibold text-slate-600 tracking-tight hidden sm:block">
                Royal International Senior Secondary School
              </p>
            </div>
          </div>

          {/* DESKTOP NAVIGATION LINKS */}
          <div className="hidden lg:flex items-center gap-7 font-poppins text-xs font-semibold text-slate-700">
            <button 
              onClick={() => onNavigateSection('hero')}
              className={`hover:text-[#1E3A8A] transition-colors cursor-pointer ${activeSection === 'hero' ? 'text-[#1E3A8A] border-b-2 border-[#1E3A8A] pb-0.5' : ''}`}
            >
              Home
            </button>
            <button 
              onClick={() => onNavigateSection('infrastructure')}
              className={`hover:text-[#1E3A8A] transition-colors cursor-pointer ${activeSection === 'infrastructure' ? 'text-[#1E3A8A] border-b-2 border-[#1E3A8A] pb-0.5' : ''}`}
            >
              Infrastructure
            </button>
            <button 
              onClick={() => onNavigateSection('campus-life')}
              className={`hover:text-[#1E3A8A] transition-colors cursor-pointer ${activeSection === 'campus-life' ? 'text-[#1E3A8A] border-b-2 border-[#1E3A8A] pb-0.5' : ''}`}
            >
              Campus Life
            </button>
            <button 
              onClick={() => onNavigateSection('gallery')}
              className={`hover:text-[#1E3A8A] transition-colors cursor-pointer ${activeSection === 'gallery' ? 'text-[#1E3A8A] border-b-2 border-[#1E3A8A] pb-0.5' : ''}`}
            >
              Gallery
            </button>
            <button 
              onClick={() => onNavigateSection('blogs')}
              className={`hover:text-[#1E3A8A] transition-colors cursor-pointer ${activeSection === 'blogs' ? 'text-[#1E3A8A] border-b-2 border-[#1E3A8A] pb-0.5' : ''}`}
            >
              Blogs
            </button>
          </div>

          {/* ACTION BUTTONS & EXPLORE DRAWER TRIGGER */}
          <div className="flex items-center gap-3">
            {/* Quick Search Button */}
            <button
              onClick={onOpenSearch}
              id="navbar-search-btn"
              className="p-2.5 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
              title="Search menu & site"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Direct Admissions Overview CTA */}
            <button
              onClick={onOpenAdmissions}
              id="navbar-admission-btn"
              className="hidden sm:flex items-center gap-1.5 bg-[#F5C518] text-[#1E3A8A] font-poppins font-bold text-xs px-3.5 py-2.5 rounded-xl shadow-xs hover:bg-[#e5b60e] transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 fill-[#1E3A8A]" />
              <span>11th & 12th Admissions</span>
            </button>

            {/* EXPLORE RIPS SLIDE-IN DRAWER TRIGGER BUTTON */}
            <button
              onClick={onOpenDrawer}
              id="open-explore-drawer-btn"
              className="flex items-center gap-2 bg-[#1E3A8A] text-white font-poppins font-semibold text-xs px-4 py-2.5 rounded-xl shadow-md hover:bg-blue-900 transition-all cursor-pointer group active:scale-95"
            >
              <Menu className="w-4 h-4 text-[#F5C518] group-hover:rotate-90 transition-transform duration-300" />
              <span>Explore RIPS</span>
            </button>

            {/* STUDENT LOGIN CTA */}
            <button
              onClick={() => navigate('/login?role=student')}
              id="student-login-btn"
              className="flex items-center gap-2 bg-[#F5C518] text-[#1E3A8A] font-poppins font-semibold text-xs px-4 py-2.5 rounded-xl shadow-md hover:bg-[#e5b60e] transition-all cursor-pointer group active:scale-95"
            >
              <GraduationCap className="w-4 h-4 text-[#1E3A8A]" />
              <span>Student Login</span>
            </button>
          </div>

        </div>
      </nav>
    </header>
  );
};
