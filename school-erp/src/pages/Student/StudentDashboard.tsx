import React, { useState, useEffect } from 'react';
import { IndianRupee, FileText, CheckSquare, CalendarClock, Inbox } from 'lucide-react';
import { api } from '../../api/axios';

export const StudentDashboard: React.FC = () => {
  const [classes, setClasses] = useState<any[]>([]);

  const StatCard = ({ title, value, icon: Icon, colorClass }: any) => (
    <div className="bg-white p-6 rounded-xl border border-[#E8EDF2] flex items-center gap-4 shadow-2xs">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClass}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold font-poppins text-slate-800">{value}</h3>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold font-poppins text-slate-800 mb-2">Student Portal Overview</h2>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Due Fees" value="₹0" icon={IndianRupee} colorClass="bg-emerald-100 text-emerald-600" />
        <StatCard title="Upcoming Exams" value="0" icon={FileText} colorClass="bg-blue-100 text-blue-600" />
        <StatCard title="Pending Assignments" value="0" icon={CheckSquare} colorClass="bg-amber-100 text-amber-600" />
        <StatCard title="My Attendance" value="100%" icon={CalendarClock} colorClass="bg-purple-100 text-purple-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Classes */}
        <div className="bg-white p-6 rounded-xl border border-[#E8EDF2] shadow-2xs">
          <h3 className="text-lg font-bold font-poppins text-slate-800 mb-4">Today's Academic Schedule</h3>
          {classes.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <Inbox className="w-10 h-10 mb-2 stroke-1 text-slate-300" />
              <h4 className="text-sm font-bold text-slate-700">No Scheduled Lectures Today</h4>
              <p className="text-xs text-slate-400 mt-1">Timetable slots configured by the administration will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {classes.map((slot, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl border bg-white border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-colors">
                  <div className="bg-slate-100 px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 min-w-[100px] text-center">
                    {slot.time}
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1A4A7A]">{slot.subject}</h4>
                    {slot.teacher && <p className="text-sm font-semibold text-slate-500">{slot.teacher} • {slot.room}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
