import React, { useState, useEffect } from 'react';
import { Users, FileText, CheckSquare, CalendarClock, Inbox } from 'lucide-react';
import { api } from '../../api/axios';

export const TeacherDashboard: React.FC = () => {
  const [studentCount, setStudentCount] = useState<number>(0);
  const [todaySchedule, setTodaySchedule] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/students');
        if (Array.isArray(res.data)) {
          setStudentCount(res.data.length);
        }
      } catch (err) {
        setStudentCount(0);
      }
    };
    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon: Icon, colorClass }: any) => (
    <div className="bg-white p-6 rounded-xl border border-[#E8EDF2] flex items-center gap-4 shadow-xs">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClass}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold font-poppins text-slate-800">{value}</h3>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold font-poppins text-slate-800">Faculty Academic Overview</h2>
        <p className="text-xs text-slate-500 mt-0.5">Live metrics and daily teaching schedule.</p>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Enrolled Students" value={studentCount.toString()} icon={Users} colorClass="bg-blue-100 text-blue-600" />
        <StatCard title="Exams Pending" value="0" icon={FileText} colorClass="bg-emerald-100 text-emerald-600" />
        <StatCard title="Active Assignments" value="0" icon={CheckSquare} colorClass="bg-amber-100 text-amber-600" />
        <StatCard title="My Attendance" value="100%" icon={CalendarClock} colorClass="bg-indigo-100 text-indigo-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Classes */}
        <div className="bg-white p-6 rounded-xl border border-[#E8EDF2] shadow-xs">
          <h3 className="text-base font-bold font-poppins text-slate-800 mb-4">Today's Teaching Schedule</h3>
          {todaySchedule.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <Inbox className="w-10 h-10 mb-2 stroke-1 text-slate-300" />
              <h4 className="text-sm font-bold text-slate-700">No Scheduled Classes Today</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Classroom lecture slots configured in the central timetable by the administration will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {todaySchedule.map((slot, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-colors">
                  <div className="bg-slate-100 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 min-w-[140px] text-center">
                    {slot.time}
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1A4A7A] text-xs">{slot.subject}</h4>
                    <p className="text-xs font-semibold text-slate-500">Class {slot.cls}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Notices */}
        <div className="bg-white p-6 rounded-xl border border-[#E8EDF2] shadow-xs">
          <h3 className="text-base font-bold font-poppins text-slate-800 mb-4">Staff Notice Board</h3>
          <div className="space-y-4">
            <div className="p-4 rounded-xl border-l-4 border-amber-500 bg-amber-50/50">
              <h4 className="font-bold text-slate-800 text-xs">Senior Secondary Academic Syllabus</h4>
              <p className="text-xs text-slate-600 mt-1">Please ensure Class 11 & 12 term course completion tracks according to CBSE annual curriculum guidelines.</p>
            </div>
            <div className="p-4 rounded-xl border-l-4 border-blue-500 bg-blue-50/50">
              <h4 className="font-bold text-slate-800 text-xs">Faculty Portal Integration</h4>
              <p className="text-xs text-slate-600 mt-1">Student attendance and grade entries are now synchronized directly with live school database records.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
