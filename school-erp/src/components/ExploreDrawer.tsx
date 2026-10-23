import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ChevronDown, 
  ChevronRight, 
  Bell, 
  GraduationCap, 
  Users, 
  ShieldCheck, 
  Briefcase, 
  CreditCard, 
  Search,
  Sparkles,
  BookOpen,
  Image as ImageIcon,
  Building2,
  Compass
} from 'lucide-react';
import { UtilityItem } from '../types';
import { INFRASTRUCTURE_ITEMS, CAMPUS_LIFE_ITEMS } from '../data/schoolData';

interface ExploreDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdmissions: () => void;
  onSelectUtility: (utilityId: UtilityItem['id']) => void;
  onSelectTab: (tab: 'Event Gallery' | 'Blogs') => void;
  onSelectSectionItem: (category: 'infrastructure' | 'campus-life', itemTitle: string) => void;
}

export const ExploreDrawer: React.FC<ExploreDrawerProps> = ({
  isOpen,
  onClose,
  onOpenAdmissions,
  onSelectUtility,
  onSelectTab,
  onSelectSectionItem
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'Event Gallery' | 'Blogs'>('Event Gallery');
  const [expandedSections, setExpandedSections] = useState<{ infrastructure: boolean; campusLife: boolean }>({
    infrastructure: false,
    campusLife: false
  });

  const toggleAccordion = (section: 'infrastructure' | 'campusLife') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const utilities: { id: UtilityItem['id']; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'notice', label: 'Notice & Circular', icon: <Bell className="w-4 h-4 text-[#1E3A8A]" />, badge: 'New' },
    { id: 'alumni', label: 'Alumni', icon: <GraduationCap className="w-4 h-4 text-[#1E3A8A]" /> },
    { id: 'alumni-network', label: 'Alumni Network', icon: <Users className="w-4 h-4 text-[#1E3A8A]" /> },
    { id: 'admin-portal', label: 'Admin Portal', icon: <ShieldCheck className="w-4 h-4 text-[#1E3A8A]" /> },
    { id: 'career', label: 'Career', icon: <Briefcase className="w-4 h-4 text-[#1E3A8A]" />, badge: '3 Openings' },
    { id: 'pay-fees', label: 'Pay Fees', icon: <CreditCard className="w-4 h-4 text-[#1E3A8A]" /> },
    { id: 'search', label: 'Search', icon: <Search className="w-4 h-4 text-[#1E3A8A]" /> },
  ];

  const handleTabClick = (tab: 'Event Gallery' | 'Blogs') => {
    setActiveTab(tab);
    onSelectTab(tab);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50"
            aria-hidden="true"
          />

          {/* Slide-in drawer container (from right side) */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col font-sans overflow-hidden"
            id="rips-explore-drawer"
          >
            {/* HEADER BLOCK - Navy Background #1E3A8A */}
            <div className="bg-[#1E3A8A] text-white p-6 pt-7 relative shrink-0 border-b border-blue-900/40">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-[#F5C518] text-[#1E3A8A] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full font-poppins">
                      RIPS Official
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold font-poppins text-white tracking-wide">
                    Explore RIPS
                  </h2>
                  <p className="text-blue-100/90 text-sm mt-0.5 font-light">
                    All sections & menus
                  </p>
                </div>

                {/* White circular close button */}
                <button
                  onClick={onClose}
                  aria-label="Close menu"
                  id="close-drawer-btn"
                  className="w-9 h-9 rounded-full bg-white text-[#1E3A8A] flex items-center justify-center hover:bg-slate-100 hover:scale-105 transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <X className="w-5 h-5 stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* SCROLLABLE BODY CONTENT */}
            <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6">

              {/* PILL-SHAPED TABS: Event Gallery & Blogs */}
              <div>
                <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-full border border-slate-200">
                  <button
                    onClick={() => handleTabClick('Event Gallery')}
                    id="pill-event-gallery-btn"
                    className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-full font-poppins text-xs font-semibold transition-all duration-200 cursor-pointer ${
                      activeTab === 'Event Gallery'
                        ? 'bg-[#1E3A8A] text-white shadow-md'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    Event Gallery
                  </button>

                  <button
                    onClick={() => handleTabClick('Blogs')}
                    id="pill-blogs-btn"
                    className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-full font-poppins text-xs font-semibold transition-all duration-200 cursor-pointer ${
                      activeTab === 'Blogs'
                        ? 'bg-[#1E3A8A] text-white shadow-md'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    Blogs
                  </button>
                </div>

                {/* Quick preview prompt under tab */}
                <div className="mt-2 text-center">
                  <span className="text-[11px] text-slate-500">
                    Click tabs to view updated RIPS media & articles
                  </span>
                </div>
              </div>

              {/* MAIN SECTIONS LABEL & ACCORDION ROWS */}
              <div>
                <div className="flex items-center justify-between mb-2.5 px-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-poppins">
                    MAIN SECTIONS
                  </span>
                  <span className="h-px bg-slate-200 flex-1 ml-3"></span>
                </div>

                <div className="space-y-2">
                  {/* Infrastructure Accordion */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs hover:border-slate-300 transition-colors">
                    <button
                      onClick={() => toggleAccordion('infrastructure')}
                      id="accordion-infrastructure-btn"
                      className="w-full flex items-center justify-between p-3.5 text-left font-poppins text-sm font-semibold text-slate-800 hover:bg-slate-50/80 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1E3A8A] flex items-center justify-center">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <span>Infrastructure</span>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                          expandedSections.infrastructure ? 'rotate-180 text-[#1E3A8A]' : ''
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {expandedSections.infrastructure && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="border-t border-slate-100 bg-slate-50/70 overflow-hidden"
                        >
                          <div className="p-2 space-y-1">
                            {INFRASTRUCTURE_ITEMS.map((item) => (
                              <button
                                key={item.id}
                                onClick={() => {
                                  onSelectSectionItem('infrastructure', item.name);
                                  onClose();
                                }}
                                className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:text-[#1E3A8A] hover:bg-white rounded-lg flex items-center justify-between group transition-all cursor-pointer"
                              >
                                <span>{item.name}</span>
                                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 group-hover:text-[#1E3A8A] transition-all" />
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Campus Life Accordion */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs hover:border-slate-300 transition-colors">
                    <button
                      onClick={() => toggleAccordion('campusLife')}
                      id="accordion-campus-life-btn"
                      className="w-full flex items-center justify-between p-3.5 text-left font-poppins text-sm font-semibold text-slate-800 hover:bg-slate-50/80 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#1E3A8A] flex items-center justify-center">
                          <Compass className="w-4 h-4" />
                        </div>
                        <span>Campus Life</span>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                          expandedSections.campusLife ? 'rotate-180 text-[#1E3A8A]' : ''
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {expandedSections.campusLife && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="border-t border-slate-100 bg-slate-50/70 overflow-hidden"
                        >
                          <div className="p-2 space-y-1">
                            {CAMPUS_LIFE_ITEMS.map((item) => (
                              <button
                                key={item.id}
                                onClick={() => {
                                  onSelectSectionItem('campus-life', item.name);
                                  onClose();
                                }}
                                className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:text-[#1E3A8A] hover:bg-white rounded-lg flex items-center justify-between group transition-all cursor-pointer"
                              >
                                <span>{item.name}</span>
                                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 group-hover:text-[#1E3A8A] transition-all" />
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* UTILITIES LABEL & VERTICAL LIST OF ROWS */}
              <div>
                <div className="flex items-center justify-between mb-2.5 px-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-poppins">
                    UTILITIES
                  </span>
                  <span className="h-px bg-slate-200 flex-1 ml-3"></span>
                </div>

                <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-xl bg-white overflow-hidden shadow-2xs">
                  {utilities.map((util) => (
                    <button
                      key={util.id}
                      onClick={() => {
                        if (util.id === 'admin-portal') {
                          navigate('/admin/login');
                        } else {
                          onSelectUtility(util.id);
                        }
                        onClose();
                      }}
                      id={`utility-row-${util.id}`}
                      className="w-full flex items-center justify-between p-3 px-3.5 text-left text-xs font-medium text-slate-700 hover:bg-blue-50/50 hover:text-[#1E3A8A] transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-md bg-slate-100 group-hover:bg-blue-100/70 flex items-center justify-center transition-colors">
                          {util.icon}
                        </div>
                        <span className="font-poppins font-medium text-slate-800 group-hover:text-[#1E3A8A]">
                          {util.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {util.badge && (
                          <span className="bg-amber-100 text-[#1E3A8A] text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {util.badge}
                          </span>
                        )}
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#1E3A8A] group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* STICKY BOTTOM GOLD BUTTON - Admission Overview 2027–28 */}
            <div className="p-4 bg-white border-t border-slate-200 shadow-lg shrink-0">
              <button
                onClick={() => {
                  onOpenAdmissions();
                  onClose();
                }}
                id="drawer-admission-btn"
                className="w-full bg-[#F5C518] hover:bg-[#e5b60e] text-[#1E3A8A] font-poppins font-bold text-sm py-3.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all transform active:scale-[0.99] flex items-center justify-center gap-2.5 cursor-pointer uppercase tracking-wider"
              >
                <Sparkles className="w-4 h-4 text-[#1E3A8A] fill-[#1E3A8A]" />
                Class 11th & 12th Admissions 2027–28
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
