import React, { useState } from 'react';
import { X, Sparkles, Calendar, DollarSign, Download, GraduationCap, ArrowUpRight } from 'lucide-react';
import { FEE_STRUCTURE, SCHOOL_INFO } from '../data/schoolData';
import { Class11AdmissionForm } from './Class11AdmissionForm';
import { Class12PromotionForm } from './Class12PromotionForm';

interface AdmissionsOverviewProps {
  isModal?: boolean;
  onClose?: () => void;
  defaultTab?: 'CLASS_11' | 'CLASS_12';
}

export const AdmissionsOverview: React.FC<AdmissionsOverviewProps> = ({ isModal = false, onClose, defaultTab = 'CLASS_11' }) => {
  const [activeFormTab, setActiveFormTab] = useState<'CLASS_11' | 'CLASS_12'>(defaultTab);

  const content = (
    <div className="space-y-8 font-sans">
      
      {/* HEADER BANNER - Gold #F5C518 Accent & Navy #1E3A8A */}
      <div className="bg-gradient-to-r from-[#1E3A8A] via-blue-900 to-[#1E3A8A] text-white p-6 sm:p-8 rounded-2xl shadow-xl relative overflow-hidden border-2 border-[#F5C518]/40">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F5C518]/10 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-[#F5C518] text-[#1E3A8A] font-extrabold font-poppins text-xs px-3.5 py-1 rounded-full uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 fill-[#1E3A8A]" />
            Official Senior Secondary Portal 2027–28
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold font-poppins text-white">
            Class 11th Admission & Class 12th Promotion
          </h2>
          
          <p className="text-blue-100 text-sm sm:text-base mt-2 font-light">
            Empower your career trajectory with specialized Senior Secondary wings: Science (PCM/PCB), Commerce, and Humanities. Integrated CBSE Board + JEE / NEET / CUET coaching.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-poppins">
            <span className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 text-white">
              📅 Phase-1 Stream Allotment: <strong>March 31, 2027</strong>
            </span>
            <span className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 text-white">
              🎓 Class 11 ➔ 12 Re-Registration: <strong>Open Now</strong>
            </span>
          </div>
        </div>
      </div>

      {/* 4-STEP ADMISSION PROCESS */}
      <div>
        <h3 className="text-xl font-bold font-poppins text-[#1E3A8A] mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#F5C518]" />
          Senior Secondary Admission & Promotion Flow
        </h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs relative">
            <div className="w-8 h-8 rounded-full bg-[#1E3A8A] text-[#F5C518] font-bold font-poppins text-sm flex items-center justify-center mb-3">
              1
            </div>
            <h4 className="font-poppins font-bold text-slate-900 text-sm">Online Registration</h4>
            <p className="text-slate-600 text-xs mt-1">Class 11 New Admission or Class 12 Internal Promotion form with stream choice.</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs relative">
            <div className="w-8 h-8 rounded-full bg-[#1E3A8A] text-[#F5C518] font-bold font-poppins text-sm flex items-center justify-center mb-3">
              2
            </div>
            <h4 className="font-poppins font-bold text-slate-900 text-sm">Academic Merit Evaluation</h4>
            <p className="text-slate-600 text-xs mt-1">Evaluation of Class 10th board marks or Class 11th annual marksheet record.</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs relative">
            <div className="w-8 h-8 rounded-full bg-[#1E3A8A] text-[#F5C518] font-bold font-poppins text-sm flex items-center justify-center mb-3">
              3
            </div>
            <h4 className="font-poppins font-bold text-slate-900 text-sm">Confidential Verification</h4>
            <p className="text-slate-600 text-xs mt-1">Instant OTP verification sent to registered Gmail & Mobile with zero screen leak.</p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs relative">
            <div className="w-8 h-8 rounded-full bg-[#1E3A8A] text-[#F5C518] font-bold font-poppins text-sm flex items-center justify-center mb-3">
              4
            </div>
            <h4 className="font-poppins font-bold text-slate-900 text-sm">Admin Approval & Official Mail</h4>
            <p className="text-slate-600 text-xs mt-1">Direct review by Principal. Approval or decision letter sent to applicant's email.</p>
          </div>
        </div>
      </div>

      {/* FEE STRUCTURE ESTIMATOR TABLE */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-bold font-poppins text-[#1E3A8A] flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-[#F5C518]" />
              Classes 11th & 12th Fee Structure (2027–28)
            </h3>
            <p className="text-slate-500 text-xs mt-0.5">Transparent quarterly tuition, lab equipment, and annual board charges.</p>
          </div>

          <div className="flex items-center gap-2">
            <button className="text-xs font-bold font-poppins text-[#1E3A8A] bg-blue-50 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-1.5 cursor-pointer">
              <Download className="w-3.5 h-3.5" />
              Download Senior Fee Circular PDF
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#1E3A8A] text-white font-poppins">
                <th className="p-3 rounded-tl-lg">Grade & Stream</th>
                <th className="p-3">Tuition Fee (Quarterly)</th>
                <th className="p-3">Lab & Development</th>
                <th className="p-3">Annual Charges</th>
                <th className="p-3 rounded-tr-lg">Total Annual (Est.)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {FEE_STRUCTURE.map((item, idx) => (
                <tr key={idx} className="hover:bg-blue-50/50 transition-colors">
                  <td className="p-3 font-semibold text-slate-900 font-poppins">{item.grade}</td>
                  <td className="p-3 font-medium">₹{item.tuitionFee.toLocaleString()}</td>
                  <td className="p-3 font-medium">₹{item.developmentFee.toLocaleString()}</td>
                  <td className="p-3 font-medium">₹{item.annualCharges.toLocaleString()}</td>
                  <td className="p-3 font-bold text-[#1E3A8A]">₹{item.totalAnnual.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* APPLICATION ENGINE SELECTOR TABS: CLASS 11 vs CLASS 12 */}
      <div id="senior-registration-section" className="pt-2 space-y-4">
        <div className="bg-slate-100 p-1.5 rounded-2xl flex flex-col sm:flex-row gap-2 border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveFormTab('CLASS_11')}
            className={`flex-1 py-3 px-5 rounded-xl font-poppins font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
              activeFormTab === 'CLASS_11'
                ? 'bg-[#1E3A8A] text-white shadow-md'
                : 'bg-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className={`w-4 h-4 ${activeFormTab === 'CLASS_11' ? 'text-[#F5C518]' : 'text-slate-400'}`} />
            <span>Class 11th New Admission (Class 10 Passouts)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFormTab('CLASS_12')}
            className={`flex-1 py-3 px-5 rounded-xl font-poppins font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
              activeFormTab === 'CLASS_12'
                ? 'bg-[#1E3A8A] text-white shadow-md'
                : 'bg-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ArrowUpRight className={`w-4 h-4 ${activeFormTab === 'CLASS_12' ? 'text-[#F5C518]' : 'text-slate-400'}`} />
            <span>Class 11th ➔ 12th Internal Promotion (Enrolled Students)</span>
          </button>
        </div>

        {/* ACTIVE FORM RENDER */}
        {activeFormTab === 'CLASS_11' ? (
          <Class11AdmissionForm onClose={onClose} isModal={isModal} />
        ) : (
          <Class12PromotionForm onClose={onClose} isModal={isModal} />
        )}
      </div>

    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans overflow-y-auto">
        <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 my-8 flex flex-col max-h-[92vh]">
          
          <div className="bg-[#1E3A8A] text-white p-4 px-6 flex items-center justify-between shrink-0">
            <span className="font-poppins font-bold text-sm text-[#F5C518] flex items-center gap-2">
              <Sparkles className="w-4 h-4 fill-[#F5C518]" />
              RIPS Admission Portal
            </span>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white text-[#1E3A8A] flex items-center justify-center hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto flex-1">
            {content}
          </div>

        </div>
      </div>
    );
  }

  return (
    <section id="admissions-overview" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {content}
      </div>
    </section>
  );
};
