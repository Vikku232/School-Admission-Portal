import React, { useState, useEffect } from 'react';
import { api } from '../../api/axios';
import { isSupabaseConfigured } from '../../lib/supabase';
import { supabaseService } from '../../services/supabaseService';
import { Table } from '../../components/shared/Table';
import { Badge } from '../../components/shared/Badge';
import { Button } from '../../components/shared/Button';
import { Modal } from '../../components/shared/Modal';
import { 
  Search, UserPlus, Users, CheckCircle2, Clock, 
  Trash2, Edit3, Phone, Mail, Award, BookOpen, 
  ShieldCheck, AlertCircle, X, Check, Filter, UserX, Database
} from 'lucide-react';
import toast from 'react-hot-toast';

export interface TeacherRecord {
  id: string;
  name: string;
  subject: string;
  qualification: string;
  phone: string;
  email: string;
  status: 'ACTIVE' | 'PENDING' | 'ON_LEAVE' | string;
  experience?: string;
  classesAssigned?: string[];
}

export const AdminTeachers: React.FC = () => {
  const [teachers, setTeachers] = useState<TeacherRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'PENDING'>('ALL');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherRecord | null>(null);

  // New Teacher Form
  const [newTeacher, setNewTeacher] = useState({
    name: '',
    subject: 'Mathematics (Calculus & Vectors)',
    qualification: 'M.Sc, B.Ed',
    phone: '',
    email: '',
    experience: '3 Years',
    status: 'ACTIVE' as const
  });

  // Fetch teachers directly from live backend database or Supabase
  const loadTeachers = async () => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured()) {
        const data = await supabaseService.getTeachers();
        const normalized = data.map((t: any) => ({
          id: String(t.teacher_id || t.id),
          name: t.name || `${t.first_name || ''} ${t.last_name || ''}`.trim() || 'Faculty Member',
          subject: t.department || t.specialization || 'Senior Secondary Faculty',
          qualification: t.qualification || 'Post Graduate / B.Ed',
          phone: t.phone || '',
          email: t.email || '',
          status: t.status || 'ACTIVE',
          experience: '3+ Years'
        }));
        setTeachers(normalized);
        return;
      }

      const res = await api.get('/teachers');
      if (Array.isArray(res.data)) {
        const normalized = res.data.map((t: any, idx: number) => ({
          id: t.id || t.teacherCode || `TCH00${idx + 1}`,
          name: t.name || `${t.firstName || ''} ${t.lastName || ''}`.trim() || 'Faculty Member',
          subject: t.subject || 'Senior Secondary Faculty',
          qualification: t.qualification || 'Post Graduate / B.Ed',
          phone: t.phone || '',
          email: t.email || '',
          status: t.status || 'ACTIVE',
          experience: t.experience || '3+ Years'
        }));
        setTeachers(normalized);
      } else {
        setTeachers([]);
      }
    } catch (err) {
      setTeachers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTeachers();
  }, []);

  // Filter teachers
  const filteredTeachers = teachers.filter((t) => {
    const matchesSearch = 
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handle Add Teacher Submission to live database / Supabase
  const handleAddTeacherSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacher.name.trim() || !newTeacher.phone.trim() || !newTeacher.email.trim()) {
      toast.error('Please enter teacher name, phone, and email');
      return;
    }

    try {
      if (isSupabaseConfigured()) {
        const parts = newTeacher.name.trim().split(' ');
        const firstName = parts[0] || 'Faculty';
        const lastName = parts.slice(1).join(' ') || '';
        await supabaseService.addTeacher({
          first_name: firstName,
          last_name: lastName,
          department: newTeacher.subject,
          qualification: newTeacher.qualification,
          phone: newTeacher.phone.trim(),
          email: newTeacher.email.trim(),
          status: newTeacher.status
        });
        await loadTeachers();
        setIsAddModalOpen(false);
        setNewTeacher({
          name: '',
          subject: 'Mathematics (Calculus & Vectors)',
          qualification: 'M.Sc, B.Ed',
          phone: '',
          email: '',
          experience: '3 Years',
          status: 'ACTIVE'
        });
        toast.success(`Faculty member "${newTeacher.name}" saved to Supabase!`);
        return;
      }

      const res = await api.post('/teachers', {
        name: newTeacher.name.trim(),
        subject: newTeacher.subject,
        qualification: newTeacher.qualification,
        phone: newTeacher.phone.trim(),
        email: newTeacher.email.trim(),
        experience: newTeacher.experience,
        status: newTeacher.status
      });

      if (res.data) {
        setTeachers(prev => [res.data, ...prev]);
        toast.success(`Faculty member "${res.data.name}" added and saved in database!`);
      } else {
        await loadTeachers();
        toast.success('Faculty member added successfully!');
      }

      setIsAddModalOpen(false);
      setNewTeacher({
        name: '',
        subject: 'Mathematics (Calculus & Vectors)',
        qualification: 'M.Sc, B.Ed',
        phone: '',
        email: '',
        experience: '3 Years',
        status: 'ACTIVE'
      });
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to save teacher to database';
      toast.error(msg);
    }
  };

  // Handle Edit/Save Teacher in live database / Supabase
  const handleUpdateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeacher) return;

    try {
      if (isSupabaseConfigured()) {
        const parts = selectedTeacher.name.trim().split(' ');
        await supabaseService.updateTeacher(selectedTeacher.id, {
          first_name: parts[0] || '',
          last_name: parts.slice(1).join(' ') || '',
          department: selectedTeacher.subject,
          qualification: selectedTeacher.qualification,
          phone: selectedTeacher.phone,
          email: selectedTeacher.email,
          status: selectedTeacher.status as any
        });
        await loadTeachers();
        setSelectedTeacher(null);
        toast.success(`Faculty record for "${selectedTeacher.name}" updated in Supabase!`);
        return;
      }

      const res = await api.put(`/teachers/${selectedTeacher.id}`, selectedTeacher);
      if (res.data) {
        setTeachers(prev => prev.map(t => t.id === selectedTeacher.id ? res.data : t));
      } else {
        await loadTeachers();
      }
      toast.success(`Faculty record for "${selectedTeacher.name}" updated in database!`);
      setSelectedTeacher(null);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to update faculty record';
      toast.error(msg);
    }
  };

  // Handle Delete Teacher from live database / Supabase
  const handleDeleteTeacher = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to permanently delete "${name}" (${id}) from the database?`)) {
      try {
        if (isSupabaseConfigured()) {
          await supabaseService.deleteTeacher(id);
          setTeachers(prev => prev.filter(t => t.id !== id));
          toast.success(`Teacher "${name}" has been permanently deleted from Supabase`);
          setSelectedTeacher(null);
          return;
        }

        await api.delete(`/teachers/${id}`);
        setTeachers(prev => prev.filter(t => t.id !== id));
        toast.success(`Teacher "${name}" has been permanently deleted from database`);
        setSelectedTeacher(null);
      } catch (err: any) {
        const msg = err.response?.data?.message || err.message || 'Failed to delete teacher from database';
        toast.error(msg);
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-[#E8EDF2] flex flex-col min-h-[calc(100vh-120px)] shadow-xs">
      
      {/* Top Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold font-poppins text-slate-800 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#1A4A7A]" />
              Teacher & Faculty Management
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
            Manage senior secondary faculty profiles, assigned subjects, and employment status.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by Name, ID, or Subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] focus:border-transparent outline-none transition-all shadow-2xs"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                statusFilter === 'ALL' ? 'bg-white text-[#1A4A7A] shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({teachers.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('ACTIVE')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                statusFilter === 'ACTIVE' ? 'bg-white text-emerald-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Active ({teachers.filter(t => t.status === 'ACTIVE').length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('PENDING')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                statusFilter === 'PENDING' ? 'bg-white text-amber-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pending ({teachers.filter(t => t.status === 'PENDING').length})
            </button>
          </div>
          
          {/* Add Teacher Button */}
          <Button 
            variant="primary" 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-[1.02] transition-transform"
          >
            <UserPlus className="w-4 h-4" /> Add Teacher
          </Button>
        </div>
      </div>

      {/* Faculty Quick Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl">
          <span className="text-[10px] uppercase font-bold text-blue-700 block">Total Faculty</span>
          <span className="text-xl font-black text-blue-950 font-poppins">{teachers.length}</span>
        </div>
        <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl">
          <span className="text-[10px] uppercase font-bold text-emerald-700 block">Active Status</span>
          <span className="text-xl font-black text-emerald-950 font-poppins">
            {teachers.filter(t => t.status === 'ACTIVE').length}
          </span>
        </div>
        <div className="p-3.5 bg-purple-50/70 border border-purple-200 rounded-xl">
          <span className="text-[10px] uppercase font-bold text-purple-700 block">Senior Secondary</span>
          <span className="text-xl font-black text-purple-950 font-poppins">Classes 11 & 12</span>
        </div>
        <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl">
          <span className="text-[10px] uppercase font-bold text-amber-700 block">Pending Verification</span>
          <span className="text-xl font-black text-amber-950 font-poppins">
            {teachers.filter(t => t.status === 'PENDING').length}
          </span>
        </div>
      </div>

      {/* Data Table or Genuine Empty State */}
      <div className="flex-1 overflow-hidden">
        {teachers.length === 0 && !isLoading ? (
          <div className="h-64 flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-2xl text-center bg-slate-50/50">
            <div className="w-12 h-12 bg-blue-100 text-[#1A4A7A] rounded-2xl flex items-center justify-center mb-3">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No Faculty Members in Database</h3>
            <p className="text-xs text-slate-500 max-w-md mt-1 mb-4">
              There are currently no teachers saved in the database. When you add a new teacher, they will be safely stored in the MySQL database and will persist across reloads.
            </p>
            <Button 
              variant="primary" 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" /> Add First Teacher
            </Button>
          </div>
        ) : (
          <Table<TeacherRecord> 
            data={filteredTeachers}
            isLoading={isLoading}
            keyExtractor={(row) => row.id}
            columns={[
              { 
                header: 'Emp ID', 
                accessor: (row) => <span className="font-mono font-bold text-slate-700 text-xs">{row.id}</span> 
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
                      <span className="text-[10px] text-slate-400 font-mono">{row.email || 'No email provided'}</span>
                    </div>
                  </div>
                )
              },
              { 
                header: 'Primary Subject', 
                accessor: (row) => (
                  <span className="font-semibold text-slate-800 text-xs">{row.subject}</span>
                ) 
              },
              { 
                header: 'Qualification', 
                accessor: (row) => <span className="text-xs text-slate-600">{row.qualification}</span> 
              },
              { 
                header: 'Phone', 
                accessor: (row) => <span className="font-mono text-xs text-slate-600">{row.phone || 'N/A'}</span> 
              },
              { 
                header: 'Status', 
                accessor: (row) => (
                  <div className="flex flex-col gap-0.5 items-start">
                    <Badge status={row.status} />
                    {row.status === 'PENDING' && (
                      <span className="text-[9px] text-amber-600 font-semibold">Awaiting Verification</span>
                    )}
                  </div>
                ) 
              },
              { 
                header: 'Action', 
                accessor: (row) => (
                  <button 
                    onClick={() => setSelectedTeacher({ ...row })}
                    className="px-3 py-1.5 bg-blue-50 hover:bg-[#1A4A7A] text-[#1A4A7A] hover:text-white font-bold rounded-lg text-xs cursor-pointer transition-colors flex items-center gap-1 shadow-2xs"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Manage
                  </button>
                ) 
              }
            ]}
          />
        )}
      </div>

      {/* ================= ADD TEACHER MODAL ================= */}
      {isAddModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsAddModalOpen(false)}
          title="Register New Senior Faculty Member (Saved to Database)"
        >
          <form onSubmit={handleAddTeacherSubmit} className="space-y-4 text-xs font-sans">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Teacher Full Name *</label>
              <input 
                type="text"
                required
                placeholder="e.g. Dr. Ramesh Chander"
                value={newTeacher.name}
                onChange={(e) => setNewTeacher(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Primary Subject *</label>
                <select
                  value={newTeacher.subject}
                  onChange={(e) => setNewTeacher(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none"
                >
                  <option value="Mathematics (Calculus & Vectors)">Mathematics</option>
                  <option value="Physics & Electromagnetism">Physics</option>
                  <option value="Chemistry (Organic & Physical)">Chemistry</option>
                  <option value="Biology & Biotechnology">Biology</option>
                  <option value="Computer Science (Python & SQL)">Computer Science</option>
                  <option value="Accountancy & Financial Studies">Accountancy</option>
                  <option value="Business Studies & Management">Business Studies</option>
                  <option value="Economics (Macro & Indian Economy)">Economics</option>
                  <option value="English Core & Literature">English Core</option>
                  <option value="Physical Education">Physical Education</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Qualification *</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. M.Sc, Ph.D, B.Ed"
                  value={newTeacher.qualification}
                  onChange={(e) => setNewTeacher(prev => ({ ...prev, qualification: e.target.value }))}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Mobile Number *</label>
                <input 
                  type="text"
                  required
                  placeholder="+91 9811002233"
                  value={newTeacher.phone}
                  onChange={(e) => setNewTeacher(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Official Email Address *</label>
                <input 
                  type="email"
                  required
                  placeholder="teacher@school.com"
                  value={newTeacher.email}
                  onChange={(e) => setNewTeacher(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Experience</label>
                <input 
                  type="text"
                  placeholder="e.g. 7 Years"
                  value={newTeacher.experience}
                  onChange={(e) => setNewTeacher(prev => ({ ...prev, experience: e.target.value }))}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Initial Status</label>
                <select
                  value={newTeacher.status}
                  onChange={(e) => setNewTeacher(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none"
                >
                  <option value="ACTIVE">ACTIVE (Authorized)</option>
                  <option value="PENDING">PENDING (Onboarding)</option>
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
                Register Teacher in Database
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ================= MANAGE / EDIT TEACHER MODAL ================= */}
      {selectedTeacher && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedTeacher(null)}
          title={`Manage Faculty: ${selectedTeacher.name} (${selectedTeacher.id})`}
        >
          <form onSubmit={handleUpdateTeacher} className="space-y-4 text-xs font-sans">
            <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] text-blue-700 uppercase font-bold block">Employee Code</span>
                <span className="font-mono font-bold text-slate-900 text-sm">{selectedTeacher.id}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-blue-700 uppercase font-bold block">Assigned Wing</span>
                <span className="font-bold text-slate-900">Class 11 & 12 Senior Wing</span>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Teacher Full Name</label>
              <input 
                type="text"
                required
                value={selectedTeacher.name}
                onChange={(e) => setSelectedTeacher({ ...selectedTeacher, name: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Primary Subject</label>
                <input 
                  type="text"
                  required
                  value={selectedTeacher.subject}
                  onChange={(e) => setSelectedTeacher({ ...selectedTeacher, subject: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Qualification</label>
                <input 
                  type="text"
                  required
                  value={selectedTeacher.qualification}
                  onChange={(e) => setSelectedTeacher({ ...selectedTeacher, qualification: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Mobile Contact</label>
                <input 
                  type="text"
                  required
                  value={selectedTeacher.phone}
                  onChange={(e) => setSelectedTeacher({ ...selectedTeacher, phone: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Official Email Address</label>
                <input 
                  type="email"
                  required
                  value={selectedTeacher.email}
                  onChange={(e) => setSelectedTeacher({ ...selectedTeacher, email: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Teaching Experience</label>
                <input 
                  type="text"
                  value={selectedTeacher.experience || ''}
                  onChange={(e) => setSelectedTeacher({ ...selectedTeacher, experience: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Employment Status</label>
                <select
                  value={selectedTeacher.status}
                  onChange={(e) => setSelectedTeacher({ ...selectedTeacher, status: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none font-bold"
                >
                  <option value="ACTIVE">ACTIVE (On Duty)</option>
                  <option value="PENDING">PENDING (Verification)</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => handleDeleteTeacher(selectedTeacher.id, selectedTeacher.name)}
                className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete From Database
              </button>

              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => setSelectedTeacher(null)}>
                  Cancel
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
