import React, { useState, useEffect } from 'react';
import { api } from '../../api/axios';
import { isSupabaseConfigured } from '../../lib/supabase';
import { supabaseService } from '../../services/supabaseService';
import { Table } from '../../components/shared/Table';
import { Badge } from '../../components/shared/Badge';
import { Button } from '../../components/shared/Button';
import { Modal } from '../../components/shared/Modal';
import { 
  Search, Download, Filter, UserPlus, Users, 
  GraduationCap, Phone, Mail, Award, CheckCircle2, 
  Trash2, Edit3, X, Check, FileSpreadsheet, AlertCircle, Database
} from 'lucide-react';
import toast from 'react-hot-toast';

export interface StudentRecord {
  id: string;
  name: string;
  grade: string;
  section: string;
  stream?: string;
  rollNo?: string;
  parentPhone: string;
  email?: string;
  status: 'ACTIVE' | 'INACTIVE' | string;
  bloodGroup?: string;
  attendance?: string;
  feesStatus?: 'PAID' | 'PENDING' | 'OVERDUE' | string;
}

export const AdminStudents: React.FC = () => {
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter criteria
  const [gradeFilter, setGradeFilter] = useState<'ALL' | '11th' | '12th'>('ALL');
  const [streamFilter, setStreamFilter] = useState<'ALL' | 'Science' | 'Commerce' | 'Arts'>('ALL');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null);

  // Add Student Form State
  const [newStudent, setNewStudent] = useState({
    name: '',
    grade: '11th',
    section: 'Sci-A (PCM)',
    stream: 'Science',
    rollNo: '',
    parentPhone: '',
    email: '',
    bloodGroup: 'B+',
    status: 'ACTIVE' as const,
    feesStatus: 'PAID' as const
  });

  // Fetch real students from live database or Supabase
  const loadStudents = async () => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured()) {
        const data = await supabaseService.getStudents();
        const normalized = data.map((s: any) => ({
          id: String(s.student_id || s.id),
          name: s.name || `${s.first_name || ''} ${s.last_name || ''}`.trim() || 'Student',
          grade: s.grade || '11th',
          section: s.section || 'A',
          stream: s.stream || 'Science',
          rollNo: s.roll_no || '',
          parentPhone: s.phone || '',
          email: s.email || '',
          status: s.status || 'ACTIVE',
          bloodGroup: s.blood_group || 'O+',
          attendance: `${s.attendance || 100}%`,
          feesStatus: s.fees_status || 'PAID'
        }));
        setStudents(normalized);
        return;
      }

      const res = await api.get('/students');
      if (Array.isArray(res.data)) {
        const normalized = res.data.map((s: any, idx: number) => ({
          id: s.id || s.studentCode || `STU110${idx + 1}`,
          name: s.name || `${s.firstName || ''} ${s.lastName || ''}`.trim() || 'Student',
          grade: s.grade || (s.id?.includes('12') ? '12th' : '11th'),
          section: s.section || 'Sci-A (PCM)',
          stream: s.stream || 'Science',
          rollNo: s.rollNo || `XI-0${idx + 1}`,
          parentPhone: s.parentPhone || s.phone || '',
          email: s.email || '',
          status: s.status || 'ACTIVE',
          bloodGroup: s.bloodGroup || 'O+',
          attendance: s.attendance || '95.0%',
          feesStatus: s.feesStatus || 'PAID'
        }));
        setStudents(normalized);
      } else {
        setStudents([]);
      }
    } catch (err) {
      setStudents([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesSearch = 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.rollNo && s.rollNo.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesGrade = gradeFilter === 'ALL' || s.grade === gradeFilter;
    const matchesStream = streamFilter === 'ALL' || s.stream === streamFilter;

    return matchesSearch && matchesGrade && matchesStream;
  });

  // Export to CSV Function
  const handleExportCsv = () => {
    if (filteredStudents.length === 0) {
      toast.error('No student records to export');
      return;
    }

    const headers = ['Student ID', 'Full Name', 'Grade', 'Section', 'Stream', 'Roll Number', 'Parent Phone', 'Email', 'Attendance', 'Fees Status', 'Status'];
    const rows = filteredStudents.map(s => [
      `"${s.id}"`,
      `"${s.name}"`,
      `"${s.grade}"`,
      `"${s.section}"`,
      `"${s.stream || ''}"`,
      `"${s.rollNo || ''}"`,
      `"${s.parentPhone}"`,
      `"${s.email || ''}"`,
      `"${s.attendance || '95%'}"`,
      `"${s.feesStatus || 'PAID'}"`,
      `"${s.status}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `senior_students_directory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Exported ${filteredStudents.length} student records to CSV!`);
  };

  // Add Student Handler with Live DB / Supabase Persistence
  const handleAddStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.name.trim() || !newStudent.parentPhone.trim()) {
      toast.error('Please enter Student Name and Parent Phone');
      return;
    }

    try {
      if (isSupabaseConfigured()) {
        const parts = newStudent.name.trim().split(' ');
        await supabaseService.addStudent({
          first_name: parts[0] || 'Student',
          last_name: parts.slice(1).join(' ') || '',
          grade: newStudent.grade,
          section: newStudent.section,
          stream: newStudent.stream,
          roll_no: newStudent.rollNo,
          phone: newStudent.parentPhone.trim(),
          email: newStudent.email.trim(),
          blood_group: newStudent.bloodGroup,
          status: newStudent.status as any,
          fees_status: newStudent.feesStatus as any
        });
        await loadStudents();
        setIsAddModalOpen(false);
        setNewStudent({
          name: '',
          grade: '11th',
          section: 'Sci-A (PCM)',
          stream: 'Science',
          rollNo: '',
          parentPhone: '',
          email: '',
          bloodGroup: 'B+',
          status: 'ACTIVE',
          feesStatus: 'PAID'
        });
        toast.success(`Student "${newStudent.name}" enrolled and saved in Supabase!`);
        return;
      }

      const res = await api.post('/students', {
        name: newStudent.name.trim(),
        grade: newStudent.grade,
        section: newStudent.section,
        stream: newStudent.stream,
        rollNo: newStudent.rollNo,
        parentPhone: newStudent.parentPhone.trim(),
        email: newStudent.email.trim(),
        bloodGroup: newStudent.bloodGroup,
        status: newStudent.status,
        feesStatus: newStudent.feesStatus
      });

      if (res.data) {
        setStudents(prev => [res.data, ...prev]);
        toast.success(`Student "${res.data.name}" enrolled and saved in database!`);
      } else {
        await loadStudents();
        toast.success('Student enrolled successfully!');
      }

      setIsAddModalOpen(false);
      setNewStudent({
        name: '',
        grade: '11th',
        section: 'Sci-A (PCM)',
        stream: 'Science',
        rollNo: '',
        parentPhone: '',
        email: '',
        bloodGroup: 'B+',
        status: 'ACTIVE',
        feesStatus: 'PAID'
      });
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to save student to database';
      toast.error(msg);
    }
  };

  // Update Student Handler with Live DB / Supabase Persistence
  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    try {
      if (isSupabaseConfigured()) {
        const parts = selectedStudent.name.trim().split(' ');
        await supabaseService.updateStudent(selectedStudent.id, {
          first_name: parts[0] || '',
          last_name: parts.slice(1).join(' ') || '',
          grade: selectedStudent.grade,
          section: selectedStudent.section,
          stream: selectedStudent.stream,
          roll_no: selectedStudent.rollNo,
          phone: selectedStudent.parentPhone,
          email: selectedStudent.email,
          status: selectedStudent.status as any,
          fees_status: selectedStudent.feesStatus as any
        });
        await loadStudents();
        setSelectedStudent(null);
        toast.success(`Student profile for "${selectedStudent.name}" updated in Supabase!`);
        return;
      }

      const res = await api.put(`/students/${selectedStudent.id}`, selectedStudent);
      if (res.data) {
        setStudents(prev => prev.map(s => s.id === selectedStudent.id ? res.data : s));
      } else {
        await loadStudents();
      }
      toast.success(`Student profile for "${selectedStudent.name}" updated in database!`);
      setSelectedStudent(null);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to update student profile';
      toast.error(msg);
    }
  };

  // Delete Student with Live DB / Supabase Persistence
  const handleDeleteStudent = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to permanently delete "${name}" (${id}) from the database?`)) {
      try {
        if (isSupabaseConfigured()) {
          await supabaseService.deleteStudent(id);
          setStudents(prev => prev.filter(s => s.id !== id));
          toast.success(`Student "${name}" permanently deleted from Supabase`);
          setSelectedStudent(null);
          return;
        }

        await api.delete(`/students/${id}`);
        setStudents(prev => prev.filter(s => s.id !== id));
        toast.success(`Student "${name}" permanently deleted from database`);
        setSelectedStudent(null);
      } catch (err: any) {
        const msg = err.response?.data?.message || err.message || 'Failed to delete student from database';
        toast.error(msg);
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-[#E8EDF2] flex flex-col min-h-[calc(100vh-120px)] shadow-xs">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold font-poppins text-slate-800 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[#1A4A7A]" />
              Student Directory (Senior Secondary)
            </h2>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${
              isSupabaseConfigured() 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300' 
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}>
              <Database className="w-3 h-3" />
              {isSupabaseConfigured() ? 'Supabase Cloud DB' : 'Local Database'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Directory of enrolled students across Classes 11th & 12th (Science, Commerce & Humanities).
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by ID, Name or Roll..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] focus:border-transparent outline-none transition-all"
            />
          </div>
          
          {/* Filters Button */}
          <button
            type="button"
            onClick={() => setIsFilterModalOpen(true)}
            className={`px-3.5 py-2 border rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              gradeFilter !== 'ALL' || streamFilter !== 'ALL'
                ? 'bg-blue-50 border-[#1A4A7A] text-[#1A4A7A]'
                : 'bg-white border-slate-300 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <Filter className="w-4 h-4 text-slate-500" />
            <span>Filters {gradeFilter !== 'ALL' || streamFilter !== 'ALL' ? '(Active)' : ''}</span>
          </button>
          
          {/* Export CSV Button */}
          <button
            type="button"
            onClick={handleExportCsv}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export CSV</span>
          </button>

          {/* Add Student Button */}
          <Button 
            variant="primary"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-[1.02] transition-transform"
          >
            <UserPlus className="w-4 h-4" /> Add Student
          </Button>
        </div>
      </div>

      {/* Active Filter Pills bar (if filters applied) */}
      {(gradeFilter !== 'ALL' || streamFilter !== 'ALL' || searchTerm) && (
        <div className="flex flex-wrap items-center gap-2 mb-4 p-2.5 bg-blue-50/60 rounded-xl border border-blue-200 text-xs">
          <span className="font-bold text-[#1A4A7A]">Active Filters:</span>
          {gradeFilter !== 'ALL' && (
            <span className="bg-white px-2 py-0.5 rounded-lg border border-blue-300 font-semibold text-slate-800 flex items-center gap-1">
              Grade: {gradeFilter}
              <X className="w-3 h-3 cursor-pointer text-slate-500 hover:text-red-600" onClick={() => setGradeFilter('ALL')} />
            </span>
          )}
          {streamFilter !== 'ALL' && (
            <span className="bg-white px-2 py-0.5 rounded-lg border border-blue-300 font-semibold text-slate-800 flex items-center gap-1">
              Stream: {streamFilter}
              <X className="w-3 h-3 cursor-pointer text-slate-500 hover:text-red-600" onClick={() => setStreamFilter('ALL')} />
            </span>
          )}
          {searchTerm && (
            <span className="bg-white px-2 py-0.5 rounded-lg border border-blue-300 font-semibold text-slate-800 flex items-center gap-1">
              Search: "{searchTerm}"
              <X className="w-3 h-3 cursor-pointer text-slate-500 hover:text-red-600" onClick={() => setSearchTerm('')} />
            </span>
          )}
          <button 
            onClick={() => { setGradeFilter('ALL'); setStreamFilter('ALL'); setSearchTerm(''); }}
            className="text-xs font-bold text-red-600 hover:underline ml-auto cursor-pointer"
          >
            Reset All
          </button>
        </div>
      )}

      {/* Data Table or Genuine Empty State */}
      <div className="flex-1 overflow-hidden">
        {students.length === 0 && !isLoading ? (
          <div className="h-64 flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-2xl text-center bg-slate-50/50">
            <div className="w-12 h-12 bg-blue-100 text-[#1A4A7A] rounded-2xl flex items-center justify-center mb-3">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No Students in Database</h3>
            <p className="text-xs text-slate-500 max-w-md mt-1 mb-4">
              There are currently no students registered in the database. When you enroll a student, their record will be safely stored in the MySQL database and will persist across reloads.
            </p>
            <Button 
              variant="primary" 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" /> Enroll First Student
            </Button>
          </div>
        ) : (
          <Table<StudentRecord> 
            data={filteredStudents}
            isLoading={isLoading}
            keyExtractor={(row) => row.id}
            columns={[
              { 
                header: 'Student ID', 
                accessor: (row) => <span className="font-mono font-bold text-slate-800 text-xs">{row.id}</span> 
              },
              { 
                header: 'Name', 
                accessor: (row) => (
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#1A4A7A] text-white flex items-center justify-center font-bold text-xs">
                      {row.name.charAt(0)}
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 text-xs block">{row.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">Roll: {row.rollNo || 'N/A'}</span>
                    </div>
                  </div>
                )
              },
              { 
                header: 'Grade/Class', 
                accessor: (row) => (
                  <span className="inline-block px-2 py-0.5 bg-blue-50 text-[#1A4A7A] font-bold text-xs rounded border border-blue-200">
                    Class {row.grade}
                  </span>
                ) 
              },
              { 
                header: 'Section & Stream', 
                accessor: (row) => (
                  <div>
                    <span className="font-semibold text-slate-800 text-xs block">{row.section}</span>
                    <span className="text-[10px] text-slate-400">{row.stream || 'Senior Stream'}</span>
                  </div>
                ) 
              },
              { 
                header: 'Parent Phone', 
                accessor: (row) => <span className="font-mono text-xs text-slate-600">{row.parentPhone || 'N/A'}</span> 
              },
              { 
                header: 'Status', 
                accessor: (row) => (
                  <div className="flex items-center gap-1.5">
                    <Badge status={row.status} />
                    {row.feesStatus === 'PAID' && (
                      <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded border border-emerald-200">
                        Fees Paid
                      </span>
                    )}
                  </div>
                ) 
              },
              { 
                header: 'Action', 
                accessor: (row) => (
                  <button 
                    onClick={() => setSelectedStudent({ ...row })}
                    className="px-3 py-1.5 bg-blue-50 hover:bg-[#1A4A7A] text-[#1A4A7A] hover:text-white font-bold rounded-lg text-xs cursor-pointer transition-colors shadow-2xs"
                  >
                    View Profile
                  </button>
                ) 
              }
            ]}
          />
        )}
      </div>

      {/* ================= FILTERS MODAL ================= */}
      {isFilterModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsFilterModalOpen(false)}
          title="Filter Student Directory"
        >
          <div className="space-y-4 text-xs font-sans">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Class / Grade Level</label>
              <div className="grid grid-cols-3 gap-2">
                {(['ALL', '11th', '12th'] as const).map(g => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGradeFilter(g)}
                    className={`p-2.5 rounded-xl border text-center font-bold cursor-pointer transition-all ${
                      gradeFilter === g 
                        ? 'bg-[#1A4A7A] text-white border-[#1A4A7A] shadow-xs' 
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {g === 'ALL' ? 'All Classes' : `Class ${g}`}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Academic Stream</label>
              <div className="grid grid-cols-2 gap-2">
                {(['ALL', 'Science', 'Commerce', 'Arts'] as const).map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStreamFilter(s)}
                    className={`p-2.5 rounded-xl border text-center font-bold cursor-pointer transition-all ${
                      streamFilter === s 
                        ? 'bg-[#1A4A7A] text-white border-[#1A4A7A] shadow-xs' 
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {s === 'ALL' ? 'All Streams' : `${s} Stream`}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => { setGradeFilter('ALL'); setStreamFilter('ALL'); setIsFilterModalOpen(false); }}
                className="text-xs font-bold text-red-600 hover:underline cursor-pointer"
              >
                Reset Filters
              </button>
              <Button variant="primary" onClick={() => setIsFilterModalOpen(false)}>
                Apply & View ({filteredStudents.length} Records)
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ================= ADD STUDENT MODAL ================= */}
      {isAddModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsAddModalOpen(false)}
          title="Enroll Senior Secondary Student (Saved to Database)"
        >
          <form onSubmit={handleAddStudentSubmit} className="space-y-4 text-xs font-sans">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Student Full Name *</label>
              <input 
                type="text"
                required
                placeholder="e.g. Siddharth Mathur"
                value={newStudent.name}
                onChange={(e) => setNewStudent(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Grade / Class *</label>
                <select
                  value={newStudent.grade}
                  onChange={(e) => setNewStudent(prev => ({ ...prev, grade: e.target.value }))}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none font-bold"
                >
                  <option value="11th">Class 11th</option>
                  <option value="12th">Class 12th</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Academic Stream *</label>
                <select
                  value={newStudent.stream}
                  onChange={(e) => setNewStudent(prev => ({ 
                    ...prev, 
                    stream: e.target.value,
                    section: e.target.value === 'Science' ? 'Sci-A (PCM)' : e.target.value === 'Commerce' ? 'Com-A' : 'Arts-A'
                  }))}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none"
                >
                  <option value="Science">Science (PCM/PCB)</option>
                  <option value="Commerce">Commerce</option>
                  <option value="Arts">Humanities / Arts</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Section</label>
                <input 
                  type="text"
                  placeholder="e.g. Sci-A (PCM)"
                  value={newStudent.section}
                  onChange={(e) => setNewStudent(prev => ({ ...prev, section: e.target.value }))}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Roll Number</label>
                <input 
                  type="text"
                  placeholder="e.g. XI-SCI-25"
                  value={newStudent.rollNo}
                  onChange={(e) => setNewStudent(prev => ({ ...prev, rollNo: e.target.value }))}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Parent Mobile Number *</label>
                <input 
                  type="text"
                  required
                  placeholder="+91 9812345678"
                  value={newStudent.parentPhone}
                  onChange={(e) => setNewStudent(prev => ({ ...prev, parentPhone: e.target.value }))}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Student / Parent Email</label>
                <input 
                  type="email"
                  placeholder="student@gmail.com"
                  value={newStudent.email}
                  onChange={(e) => setNewStudent(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Blood Group</label>
                <select
                  value={newStudent.bloodGroup}
                  onChange={(e) => setNewStudent(prev => ({ ...prev, bloodGroup: e.target.value }))}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none font-bold text-red-700"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Admission Status</label>
                <select
                  value={newStudent.status}
                  onChange={(e) => setNewStudent(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none font-bold"
                >
                  <option value="ACTIVE">ACTIVE (Enrolled)</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
              <Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#1A4A7A] hover:bg-[#153860] text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4 text-emerald-400" />
                Enroll Student in Database
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ================= VIEW PROFILE MODAL ================= */}
      {selectedStudent && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedStudent(null)}
          title={`Student Profile: ${selectedStudent.name} (${selectedStudent.id})`}
        >
          <form onSubmit={handleUpdateStudent} className="space-y-4 text-xs font-sans">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#1A4A7A] text-white flex items-center justify-center font-bold text-lg border-2 border-[#F5C518]">
                  {selectedStudent.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{selectedStudent.name}</h4>
                  <p className="text-[11px] text-slate-500 font-mono">
                    ID: {selectedStudent.id} • Roll: {selectedStudent.rollNo || 'N/A'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Attendance</span>
                <span className="font-extrabold text-emerald-700 text-sm">{selectedStudent.attendance || '96.2%'}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Full Name</label>
                <input 
                  type="text"
                  required
                  value={selectedStudent.name}
                  onChange={(e) => setSelectedStudent({ ...selectedStudent, name: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Class & Section</label>
                <input 
                  type="text"
                  required
                  value={selectedStudent.section}
                  onChange={(e) => setSelectedStudent({ ...selectedStudent, section: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Parent Phone</label>
                <input 
                  type="text"
                  required
                  value={selectedStudent.parentPhone}
                  onChange={(e) => setSelectedStudent({ ...selectedStudent, parentPhone: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Email Address</label>
                <input 
                  type="email"
                  value={selectedStudent.email || ''}
                  onChange={(e) => setSelectedStudent({ ...selectedStudent, email: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Enrollment Status</label>
                <select
                  value={selectedStudent.status}
                  onChange={(e) => setSelectedStudent({ ...selectedStudent, status: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none font-bold"
                >
                  <option value="ACTIVE">ACTIVE (Enrolled)</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Fee Clearance</label>
                <select
                  value={selectedStudent.feesStatus || 'PAID'}
                  onChange={(e) => setSelectedStudent({ ...selectedStudent, feesStatus: e.target.value as any })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none font-bold"
                >
                  <option value="PAID">PAID & CLEARED</option>
                  <option value="PENDING">PENDING</option>
                  <option value="OVERDUE">OVERDUE</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => handleDeleteStudent(selectedStudent.id, selectedStudent.name)}
                className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete From Database
              </button>

              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => setSelectedStudent(null)}>
                  Close
                </Button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1A4A7A] hover:bg-[#153860] text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 text-[#F5C518]" />
                  Save Changes to Database
                </button>
              </div>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
};
