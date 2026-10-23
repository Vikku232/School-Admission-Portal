import React, { useState, useEffect } from 'react';
import { api } from '../../api/axios';
import { Table } from '../../components/shared/Table';
import { Badge } from '../../components/shared/Badge';
import { Search, GraduationCap } from 'lucide-react';

export const TeacherStudents: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      try {
        const res = await api.get('/students');
        if (Array.isArray(res.data)) {
          setStudents(res.data);
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

  const filteredStudents = students.filter((s: any) => 
    (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.id || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-xl border border-[#E8EDF2] flex flex-col h-[calc(100vh-120px)] shadow-xs">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold font-poppins text-slate-800">My Students Directory</h2>
          <p className="text-xs text-slate-500 mt-0.5">Live list of enrolled students in your classes.</p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search student by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#1A4A7A]"
          />
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {students.length === 0 && !isLoading ? (
          <div className="h-64 flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-2xl text-center bg-slate-50/50">
            <GraduationCap className="w-10 h-10 mb-2 text-slate-400" />
            <h3 className="text-sm font-bold text-slate-800">No Students Registered Yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              Enrolled students will appear here as soon as the Admin enrolls them in the database.
            </p>
          </div>
        ) : (
          <Table<any> 
            data={filteredStudents}
            isLoading={isLoading}
            keyExtractor={(row) => row.id}
            columns={[
              { header: 'ID', accessor: (row) => row.id },
              { header: 'Name', accessor: (row) => <span className="font-semibold text-xs text-slate-800">{row.name}</span> },
              { header: 'Class / Grade', accessor: (row) => row.grade ? `Class ${row.grade}` : '11th' },
              { header: 'Section', accessor: (row) => row.section || 'General' },
              { header: 'Parent Phone', accessor: (row) => row.parentPhone || 'N/A' },
              { 
                header: 'Status', 
                accessor: (row) => <Badge status={row.status || 'ACTIVE'} /> 
              }
            ]}
          />
        )}
      </div>
    </div>
  );
};
