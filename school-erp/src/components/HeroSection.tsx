import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Award, Users, BookOpen, Menu } from 'lucide-react';
import { SCHOOL_INFO } from '../data/schoolData';

interface HeroSectionProps {
  onOpenDrawer: () => void;
  onOpenAdmissions: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenDrawer, onOpenAdmissions }) => {
  return (
    <section className="relative bg-gradient-to-br from-[#1E3A8A] via-blue-900 to-[#12265c] text-white py-16 lg:py-24 overflow-hidden">
      {/* Subtle background decorative shapes */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#F5C518]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT CONTENT BLOCK */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center gap-2 bg-blue-800/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-blue-400/30">
              <span className="w-2 h-2 rounded-full bg-[#F5C518] animate-pulse"></span>
              <span className="text-xs font-semibold font-poppins text-[#F5C518] tracking-wide">
                CLASSES 11TH & 12TH ADMISSIONS OPEN • SESSION 2027–28
              </span>
            </div>

            {/* TESTING PURPOSE NOTICE BANNER */}
            <div className="bg-gradient-to-r from-amber-500/25 via-yellow-400/20 to-amber-600/25 border-2 border-[#F5C518] backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-2xl relative overflow-hidden">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#F5C518] text-[#1E3A8A] flex items-center justify-center shrink-0 font-bold text-xl shadow-md">
                  ⚠️
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="bg-[#F5C518] text-[#1E3A8A] text-[11px] font-black px-2.5 py-0.5 rounded-md uppercase tracking-wide">
                      FOR TESTING PURPOSE ONLY
                    </span>
                    <span className="text-amber-300 text-xs font-semibold">
                      • Preview Mode
                    </span>
                  </div>
                  <p className="text-white font-medium text-xs sm:text-sm leading-relaxed">
                    This portal is set up for <strong>testing purpose only</strong>. If you want to change or update anything (content, streams, fee structure, pictures, or layout), <strong>we will change and update it as per your requirements</strong>.
                  </p>
                </div>
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-poppins text-white leading-tight">
              Inspiring Excellence in <span className="text-[#F5C518] underline decoration-[#F5C518]/40 decoration-wavy">Classes 11th & 12th</span>
            </h1>

            <p className="text-blue-100 text-base sm:text-lg max-w-2xl font-light leading-relaxed">
              Welcome to <strong className="text-white font-semibold">Royal International Senior Secondary School</strong>. Dedicated exclusively to <strong>Grades 11 & 12</strong> with specialized Science (PCM/PCB), Commerce, and Humanities streams, integrated JEE/NEET/CUET coaching, and CBSE board mastery.
            </p>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              
              {/* PRIMARY GOLD CTA - Admission Overview 2027–28 */}
              <button
                onClick={onOpenAdmissions}
                id="hero-admissions-cta"
                className="bg-[#F5C518] hover:bg-[#e5b60e] text-[#1E3A8A] font-poppins font-bold text-sm px-6 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 flex items-center gap-3 cursor-pointer group"
              >
                <Sparkles className="w-5 h-5 fill-[#1E3A8A]" />
                <span>Class 11th & 12th Admissions</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* SECONDARY DRAWER TRIGGER - Explore RIPS */}
              <button
                onClick={onOpenDrawer}
                id="hero-explore-cta"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/30 font-poppins font-semibold text-sm px-6 py-4 rounded-xl transition-all backdrop-blur-md flex items-center gap-2.5 cursor-pointer"
              >
                <Menu className="w-5 h-5 text-[#F5C518]" />
                <span>Explore Senior School</span>
              </button>

            </div>

            {/* QUICK STATS STRIP */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-blue-800/60">
              <div>
                <div className="text-2xl lg:text-3xl font-extrabold font-poppins text-[#F5C518]">100%</div>
                <div className="text-xs text-blue-200">CBSE 12th Board Pass</div>
              </div>
              <div>
                <div className="text-2xl lg:text-3xl font-extrabold font-poppins text-[#F5C518]">450+</div>
                <div className="text-xs text-blue-200">JEE / NEET / CUET Ranks</div>
              </div>
              <div>
                <div className="text-2xl lg:text-3xl font-extrabold font-poppins text-[#F5C518]">3</div>
                <div className="text-xs text-blue-200">Streams: Sci, Com & Arts</div>
              </div>
              <div>
                <div className="text-2xl lg:text-3xl font-extrabold font-poppins text-[#F5C518]">15:1</div>
                <div className="text-xs text-blue-200">Senior Student Ratio</div>
              </div>
            </div>

          </div>

          {/* RIGHT VISUAL HERO IMAGE & CARD */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Image Frame */}
              <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 relative">
                <img
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1000"
                  alt="RIPS Students Campus Life"
                  className="w-full h-80 sm:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E3A8A]/80 via-transparent to-transparent"></div>
                
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-xl text-slate-800 shadow-lg border border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#1E3A8A] text-[#F5C518] flex items-center justify-center font-bold">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-poppins font-bold text-sm text-[#1E3A8A]">
                        Ranked #1 School in Region
                      </h4>
                      <p className="text-xs text-slate-600">
                        Education World School Ranking 2025–26
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -top-4 -left-4 bg-[#F5C518] text-[#1E3A8A] p-3 rounded-xl shadow-lg border-2 border-white font-poppins font-bold text-xs flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#1E3A8A]" />
                <span>CBSE Accredited Campus</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
