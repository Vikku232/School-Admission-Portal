import React from 'react';
import { GraduationCap, Phone, Mail, MapPin, Sparkles, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import { SCHOOL_INFO } from '../data/schoolData';

interface FooterProps {
  onOpenDrawer: () => void;
  onOpenAdmissions: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenDrawer,
  onOpenAdmissions,
  onNavigateSection
}) => {
  return (
    <footer className="bg-[#1E3A8A] text-white pt-16 pb-8 font-sans border-t-4 border-[#F5C518]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-blue-900">
          
          {/* COL 1: SCHOOL BRANDING */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F5C518] text-[#1E3A8A] flex items-center justify-center font-bold">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-black font-poppins text-white tracking-wider">RIPS</h3>
                <p className="text-[10px] text-[#F5C518] font-bold uppercase font-poppins">Royal International Senior Secondary (11th & 12th)</p>
              </div>
            </div>

            <p className="text-blue-100 text-xs leading-relaxed font-light">
              Exclusively dedicated to Classes 11th & 12th. Affiliated to CBSE, offering specialized Science (PCM/PCB), Commerce & Humanities streams with integrated competitive coaching (JEE/NEET/CUET).
            </p>

            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 bg-blue-950 text-[#F5C518] px-3 py-1 rounded-full text-xs font-semibold border border-blue-800">
                <ShieldCheck className="w-3.5 h-3.5" />
                {SCHOOL_INFO.cbseAffiliation}
              </span>
            </div>
          </div>

          {/* COL 2: QUICK SECTIONS */}
          <div className="space-y-3 font-poppins text-xs">
            <h4 className="text-sm font-bold text-[#F5C518] uppercase tracking-wider">Senior Academic Wings</h4>
            <ul className="space-y-2 text-blue-100">
              <li>
                <button onClick={() => onNavigateSection('infrastructure')} className="hover:text-[#F5C518] transition-colors cursor-pointer">
                  Senior Physics, Chem & Bio Labs
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('campus-life')} className="hover:text-[#F5C518] transition-colors cursor-pointer">
                  Senior Clubs & Tech Societies
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('gallery')} className="hover:text-[#F5C518] transition-colors cursor-pointer">
                  Event Gallery & Athletics
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('blogs')} className="hover:text-[#F5C518] transition-colors cursor-pointer">
                  Career Guidance & Exam Strategies
                </button>
              </li>
            </ul>
          </div>

          {/* COL 3: UTILITY SHORTCUTS */}
          <div className="space-y-3 font-poppins text-xs">
            <h4 className="text-sm font-bold text-[#F5C518] uppercase tracking-wider">Senior Utilities</h4>
            <ul className="space-y-2 text-blue-100">
              <li><button onClick={onOpenDrawer} className="hover:text-[#F5C518] cursor-pointer">Notice & Board Circulars</button></li>
              <li><button onClick={onOpenDrawer} className="hover:text-[#F5C518] cursor-pointer">Alumni Mentorship Network</button></li>
              <li><button onClick={onOpenDrawer} className="hover:text-[#F5C518] cursor-pointer">Admin Portal Login</button></li>
              <li><button onClick={onOpenDrawer} className="hover:text-[#F5C518] cursor-pointer">PGT Faculty Careers</button></li>
              <li><button onClick={onOpenDrawer} className="hover:text-[#F5C518] cursor-pointer">Pay Senior Fees Online</button></li>
            </ul>
          </div>

          {/* COL 4: CONTACT & ADMISSION CTA */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold font-poppins text-[#F5C518] uppercase tracking-wider">Admissions 2027–28</h4>
            <p className="text-blue-100 text-xs">
              Admissions open for Class 11th (Science, Commerce, Arts) and Class 12th Transfer seats.
            </p>

            <button
              onClick={onOpenAdmissions}
              className="w-full bg-[#F5C518] text-[#1E3A8A] font-poppins font-bold text-xs py-3 px-4 rounded-xl hover:bg-[#e5b60e] transition-all flex items-center justify-center gap-2 cursor-pointer uppercase shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5 fill-[#1E3A8A]" />
              Class 11th & 12th Admissions
            </button>

            <div className="text-xs text-blue-200 space-y-1.5 pt-2">
              <div className="flex items-center gap-2 text-[#F5C518] font-bold">
                <Clock className="w-3.5 h-3.5 text-[#F5C518]" /> School Timing: {SCHOOL_INFO.schoolTiming}
              </div>
              <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-[#F5C518]" /> {SCHOOL_INFO.phone}</div>
              <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-[#F5C518]" /> {SCHOOL_INFO.email}</div>
            </div>
          </div>

        </div>

        {/* BOTTOM COPYRIGHT */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-blue-300">
          <p>© {new Date().getFullYear()} {SCHOOL_INFO.fullName} (RIPS). All Rights Reserved.</p>
          <p className="mt-2 sm:mt-0">Designed for RIPS Official Portal</p>
        </div>

      </div>
    </footer>
  );
};
