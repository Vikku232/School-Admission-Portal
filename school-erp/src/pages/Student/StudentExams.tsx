import React, { useState } from 'react';
import { Table } from '../../components/shared/Table';
import { Badge } from '../../components/shared/Badge';
import { Download, Inbox } from 'lucide-react';

export const StudentExams: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const [upcomingExams, setUpcomingExams] = useState<any[]>([]);
  const [pastExams, setPastExams] = useState<any[]>([]);

  return (
    <div className="bg-white p-6 rounded-xl border border-[#E8EDF2] flex flex-col h-[calc(100vh-120px)] shadow-xs">
      <div className="mb-6">
        <h2 className="text-xl font-bold font-poppins text-slate-800">Exams & Academic Evaluations</h2>
        <p className="text-xs text-slate-500 mt-0.5">View board schedules, internal assessments, and term results.</p>
      </div>

      <div className="flex border-b border-slate-200 mb-6">
        <button 
          className={`pb-3 px-4 font-semibold text-xs cursor-pointer ${activeTab === 'upcoming' ? 'border-b-2 border-[#1A4A7A] text-[#1A4A7A] font-bold' : 'text-slate-500'}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming Exams ({upcomingExams.length})
        </button>
        <button 
          className={`pb-3 px-4 font-semibold text-xs cursor-pointer ${activeTab === 'past' ? 'border-b-2 border-[#1A4A7A] text-[#1A4A7A] font-bold' : 'text-slate-500'}`}
          onClick={() => setActiveTab('past')}
        >
          Past Results ({pastExams.length})
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === 'upcoming' ? (
          upcomingExams.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <Inbox className="w-10 h-10 mb-2 stroke-1 text-slate-300" />
              <h4 className="text-sm font-bold text-slate-700">No Upcoming Exams Scheduled</h4>
              <p className="text-xs text-slate-400 mt-1">Official date sheets announced by examination wing will appear here.</p>
            </div>
          ) : (
            <Table<any> 
              data={upcomingExams}
              keyExtractor={(row) => row.id}
              columns={[
                { header: 'Subject', accessor: (row) => <span className="font-semibold text-[#1A4A7A] text-xs">{row.subject}</span> },
                { header: 'Date', accessor: (row) => row.date },
                { header: 'Syllabus', accessor: (row) => row.syllabus },
                { 
                  header: 'Status', 
                  accessor: (row) => <Badge status={row.status} /> 
                }
              ]}
            />
          )
        ) : (
          pastExams.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <Inbox className="w-10 h-10 mb-2 stroke-1 text-slate-300" />
              <h4 className="text-sm font-bold text-slate-700">No Past Results Published Yet</h4>
              <p className="text-xs text-slate-400 mt-1">Graded term exam report cards will appear here.</p>
            </div>
          ) : (
            <Table<any> 
              data={pastExams}
              keyExtractor={(row) => row.id}
              columns={[
                { header: 'Subject', accessor: (row) => <span className="font-semibold text-xs">{row.subject}</span> },
                { header: 'Exam Date', accessor: (row) => row.date },
                { header: 'Score Obtained', accessor: (row) => <span className="font-bold text-emerald-600 font-mono text-xs">{row.score}</span> },
                { 
                  header: 'Status', 
                  accessor: (row) => <Badge status={row.status} /> 
                }
              ]}
            />
          )
        )}
      </div>
    </div>
  );
};
