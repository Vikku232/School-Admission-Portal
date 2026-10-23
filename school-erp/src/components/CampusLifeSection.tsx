import React from 'react';
import { Compass, Sparkles, HeartHandshake, Award } from 'lucide-react';
import { CAMPUS_LIFE_ITEMS } from '../data/schoolData';

interface CampusLifeSectionProps {
  onOpenAdmissions: () => void;
  highlightItem?: string;
}

export const CampusLifeSection: React.FC<CampusLifeSectionProps> = ({ onOpenAdmissions, highlightItem }) => {
  return (
    <section id="campus-life" className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-[#1E3A8A] px-3.5 py-1 rounded-full text-xs font-bold font-poppins mb-3">
            <Compass className="w-3.5 h-3.5 text-[#1E3A8A]" />
            <span>VIBRANT STUDENT EXPERIENCE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-poppins text-[#1E3A8A]">
            Campus Life & Clubs at RIPS
          </h2>
          <p className="text-slate-600 mt-2 text-sm sm:text-base font-normal">
            Beyond text-books: cultivating character, leadership, sportsmanship, and lifelong creative passions.
          </p>
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-2 gap-8">
          {CAMPUS_LIFE_ITEMS.map((item) => {
            const isHighlighted = highlightItem && item.name.toLowerCase().includes(highlightItem.toLowerCase());

            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl overflow-hidden border shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row ${
                  isHighlighted ? 'border-[#F5C518] ring-2 ring-[#F5C518]/50' : 'border-slate-200'
                }`}
              >
                <div className="sm:w-2/5 h-48 sm:h-auto relative shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-[#1E3A8A] text-[#F5C518] p-1.5 rounded-lg shadow-sm">
                    <Award className="w-4 h-4" />
                  </div>
                </div>

                <div className="p-6 sm:w-3/5 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold font-poppins text-[#1E3A8A]">
                      {item.name}
                    </h3>
                    <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">
                      Active Student Groups
                    </span>
                    <button
                      onClick={onOpenAdmissions}
                      className="text-xs font-bold font-poppins text-[#1E3A8A] hover:underline cursor-pointer"
                    >
                      Join RIPS Life →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
