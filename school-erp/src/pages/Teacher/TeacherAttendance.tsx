import React, { useState, useEffect } from 'react';
import { api } from '../../api/axios';
import { Table } from '../../components/shared/Table';
import { Badge } from '../../components/shared/Badge';
import { Button } from '../../components/shared/Button';
import { CheckCircle2, UserCheck, Inbox } from 'lucide-react';
import toast from 'react-hot-toast';

export const TeacherAttendance: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      try {
        const res = await api.get('/students');
        if (Array.isArray(res.data)) {
          setStudents(res.data.map(s => ({ ...s, attendanceStatus: 'PRESENT' })));
        } else {
          setStudents([]);
        }
      } catch (err) {
        setStudents([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const handleMarkAttendance = () => {
    if (students.length === 0) {
      toast.error('No enrolled students available in database to mark attendance');
      return;
    }
    toast.success('Attendance submitted successfully for today.');
  };

  return (
    <div className="space-y-6">
      
      {/* Teacher's Own Attendance Card */}
      <div className="bg-white p-6 rounded-xl border border-[#E8EDF2] flex justify-between items-center shadow-xs">
        <div>
          <h2 className="text-xl font-bold font-poppins text-slate-800">My Attendance Register</h2>
          <p className="text-xs text-slate-500 mt-0.5">Faculty daily biometric clock-in timestamp • School Hours: 10:00 AM – 04:00 PM</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge status="PRESENT" />
          <Button variant="secondary" className="cursor-not-allowed opacity-70 text-xs">
            Clocked In • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Button>
        </div>
      </div>

      {/* Mark Student Attendance */}
      <div className="bg-white p-6 rounded-xl border border-[#E8EDF2] shadow-xs">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-bold font-poppins text-slate-800">Mark Class Attendance</h3>
            <p className="text-xs text-slate-500 mt-0.5">Senior Secondary Wing • {new Date().toLocaleDateString()}</p>
          </div>
          {students.length > 0 && (
            <Button variant="primary" onClick={handleMarkAttendance}>
              <CheckCircle2 className="w-4 h-4" /> Submit Register
            </Button>
          )}
        </div>

        {students.length === 0 && !isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <Inbox className="w-10 h-10 mb-2 stroke-1 text-slate-300" />
            <h4 className="text-sm font-bold text-slate-700">No Students Enrolled in Class</h4>
            <p className="text-xs text-slate-400 mt-1">Once students are enrolled by the admin, attendance register will become available here.</p>
          </div>
        ) : (
          <Table<any> 
            data={students}
            isLoading={isLoading}
            keyExtractor={(row) => row.id}
            columns={[
              { header: 'Student ID', accessor: (row) => row.id },
              { header: 'Student Name', accessor: (row) => <span className="font-semibold text-xs text-slate-800">{row.name}</span> },
              { header: 'Class / Section', accessor: (row) => `${row.grade || '11th'} (${row.section || 'Sci'})` },
              { 
                header: 'Status', 
                accessor: (row) => (
                  <div className="flex gap-2">
                    <label className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded cursor-pointer border border-emerald-200">
                      <input type="radio" name={`att-${row.id}`} defaultChecked /> Present
                    </label>
                    <label className="flex items-center gap-1 text-xs font-semibold text-red-700 bg-red-50 px-2 py-1 rounded cursor-pointer border border-red-200">
                      <input type="radio" name={`att-${row.id}`} /> Absent
                    </label>
                  </div>
                ) 
              }
            ]}
          />
        )}
      </div>
    </div>
  );
};
