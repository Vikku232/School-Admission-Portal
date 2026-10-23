import React, { useState } from 'react';
import { Building2, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { INFRASTRUCTURE_ITEMS } from '../data/schoolData';

interface InfrastructureSectionProps {
  highlightItem?: string;
  onOpenAdmissions: () => void;
}

export const InfrastructureSection: React.FC<InfrastructureSectionProps> = ({ highlightItem, onOpenAdmissions }) => {
  const [selectedFacility, setSelectedFacility] = useState<string | null>(null);

  return (
    <section id="infrastructure" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-[#1E3A8A] px-3.5 py-1 rounded-full text-xs font-bold font-poppins mb-3">
            <Building2 className="w-3.5 h-3.5 text-[#1E3A8A]" />
            <span>WORLD-CLASS FACILITIES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-poppins text-[#1E3A8A]">
            Campus Infrastructure at RIPS
          </h2>
          <p className="text-slate-600 mt-2 text-sm sm:text-base font-normal">
            Designed to foster intellectual curiosity, physical agility, creative expression, and safety at every turn.
          </p>
        </div>

        {/* CARDS GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {INFRASTRUCTURE_ITEMS.map((item) => {
            const isHighlighted = highlightItem && item.name.toLowerCase().includes(highlightItem.toLowerCase());
            
            return (
              <div
                key={item.id}
                className={`group rounded-2xl overflow-hidden border bg-white transition-all duration-300 hover:shadow-xl flex flex-col ${
                  isHighlighted 
                    ? 'border-[#F5C518] ring-2 ring-[#F5C518]/50 shadow-lg' 
                    : 'border-slate-200 hover:border-blue-200'
                }`}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
                  <span className="absolute bottom-3 left-3 bg-[#1E3A8A]/90 text-white font-poppins font-semibold text-xs px-2.5 py-1 rounded-lg backdrop-blur-xs">
                    RIPS Facility
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold font-poppins text-slate-900 group-hover:text-[#1E3A8A] transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      100% Operational
                    </span>
                    <button
                      onClick={onOpenAdmissions}
                      className="text-xs font-bold font-poppins text-[#1E3A8A] hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Inquire Facility</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
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
