import React, { useState } from 'react';
import { Table } from '../../components/shared/Table';
import { Button } from '../../components/shared/Button';
import { Modal } from '../../components/shared/Modal';
import { 
  BookOpen, Plus, Search, Filter, Award, 
  Check, Trash2, Edit3, Settings, ShieldCheck, 
  GraduationCap, Clock, Building2, CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';

export interface CourseItem {
  id: string;
  code: string;
  name: string;
  stream: string;
  grade: string;
  theoryMarks: number;
  practicalMarks: number;
  creditsWeekly: string;
  leadFaculty: string;
  status: 'ACTIVE' | 'ARCHIVED';
  description?: string;
}

export const AdminGrades: React.FC = () => {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [streamFilter, setStreamFilter] = useState<'ALL' | 'Science' | 'Commerce' | 'Humanities'>('ALL');
  
  // Modals
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseItem | null>(null);
  const [isGradingScaleOpen, setIsGradingScaleOpen] = useState(false);

  // New Course Form State
  const [newCourse, setNewCourse] = useState({
    code: '',
    name: '',
    stream: 'Science (PCM)',
    grade: '11th & 12th',
    theoryMarks: 80,
    practicalMarks: 20,
    creditsWeekly: '6 Periods / Week',
    leadFaculty: '',
    description: ''
  });

  // Filter logic
  const filteredCourses = courses.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.leadFaculty.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStream = streamFilter === 'ALL' || c.stream.includes(streamFilter);
    return matchesSearch && matchesStream;
  });

  // Handle Add Course
  const handleAddCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourse.name.trim() || !newCourse.code.trim()) {
      toast.error('Please enter course name and subject code');
      return;
    }

    const created: CourseItem = {
      id: `CRS0${courses.length + 1}`,
      code: newCourse.code.trim().toUpperCase(),
      name: newCourse.name.trim(),
      stream: newCourse.stream,
      grade: newCourse.grade,
      theoryMarks: Number(newCourse.theoryMarks) || 80,
      practicalMarks: Number(newCourse.practicalMarks) || 20,
      creditsWeekly: newCourse.creditsWeekly,
      leadFaculty: newCourse.leadFaculty.trim() || 'Senior Faculty',
      status: 'ACTIVE',
      description: newCourse.description.trim() || 'Senior Secondary curriculum aligned to CBSE guidelines.'
    };

    setCourses(prev => [created, ...prev]);
    toast.success(`Course "${created.name}" (${created.code}) created successfully!`);
    setIsAddCourseOpen(false);
    setNewCourse({
      code: '',
      name: '',
      stream: 'Science (PCM)',
      grade: '11th & 12th',
      theoryMarks: 80,
      practicalMarks: 20,
      creditsWeekly: '6 Periods / Week',
      leadFaculty: '',
      description: ''
    });
  };

  // Handle Update Course
  const handleUpdateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;

    setCourses(prev => prev.map(c => c.id === editingCourse.id ? editingCourse : c));
    toast.success(`Course "${editingCourse.name}" updated successfully!`);
    setEditingCourse(null);
  };

  // Delete Course
  const handleDeleteCourse = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete course "${name}"?`)) {
      setCourses(prev => prev.filter(c => c.id !== id));
      toast.success(`Course "${name}" removed from curriculum`);
      setEditingCourse(null);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-[#E8EDF2] flex flex-col min-h-[calc(100vh-120px)] shadow-xs">
      
      {/* Top Header & Action Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold font-poppins text-slate-800 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#1A4A7A]" />
            Grades & Courses Curriculum Management
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage senior secondary subjects, theory/practical marks distribution, and CBSE grading criteria.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search Subject or Code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] focus:border-transparent outline-none transition-all shadow-2xs"
            />
          </div>

          {/* Grading Scale Policy Button */}
          <button
            type="button"
            onClick={() => setIsGradingScaleOpen(true)}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-300"
          >
            <Award className="w-4 h-4 text-amber-500" />
            <span>Grading Scale Policy</span>
          </button>
          
          {/* Add Course Button */}
          <Button 
            variant="primary"
            onClick={() => setIsAddCourseOpen(true)}
            className="flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-[1.02] transition-transform"
          >
            <Plus className="w-4 h-4" /> Add Course
          </Button>
        </div>
      </div>

      {/* Stream Tabs Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 p-2 bg-slate-50 rounded-xl border border-slate-200">
        <div className="flex items-center gap-1 text-xs font-semibold">
          <span className="text-slate-400 text-[11px] px-2 font-bold uppercase">Filter Stream:</span>
          {(['ALL', 'Science', 'Commerce', 'Humanities'] as const).map(stream => (
            <button
              key={stream}
              type="button"
              onClick={() => setStreamFilter(stream)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                streamFilter === stream 
                  ? 'bg-[#1A4A7A] text-white font-bold shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {stream === 'ALL' ? 'All Subjects' : `${stream} Stream`}
            </button>
          ))}
        </div>

        <span className="text-xs font-mono text-slate-500 pr-2">
          {filteredCourses.length} Courses Offered
        </span>
      </div>

      {/* Main Table or Empty State */}
      <div className="flex-1 overflow-hidden">
        {courses.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-2xl text-center bg-slate-50/50">
            <div className="w-12 h-12 bg-blue-100 text-[#1A4A7A] rounded-2xl flex items-center justify-center mb-3">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No Courses or Subjects in Database</h3>
            <p className="text-xs text-slate-500 max-w-md mt-1 mb-4">
              There are currently no curriculum courses configured. Click '+ Add Course' to register subjects and theory/practical marks distribution.
            </p>
            <Button 
              variant="primary" 
              onClick={() => setIsAddCourseOpen(true)}
              className="flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add First Course
            </Button>
          </div>
        ) : (
          <Table<CourseItem>
            data={filteredCourses}
            keyExtractor={(row) => row.id}
          columns={[
            {
              header: 'Subject Code',
              accessor: (row) => (
                <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-blue-50 text-[#1A4A7A] border border-blue-200">
                  {row.code}
                </span>
              )
            },
            {
              header: 'Course Name',
              accessor: (row) => (
                <div>
                  <span className="font-bold text-slate-900 text-xs block">{row.name}</span>
                  <span className="text-[10px] text-slate-400 line-clamp-1 max-w-xs">{row.description}</span>
                </div>
              )
            },
            {
              header: 'Stream & Grade',
              accessor: (row) => (
                <div>
                  <span className="font-semibold text-slate-800 text-xs block">{row.stream}</span>
                  <span className="text-[10px] text-slate-400">{row.grade}</span>
                </div>
              )
            },
            {
              header: 'Evaluation Marks',
              accessor: (row) => (
                <div className="text-xs">
                  <span className="font-bold text-slate-800">Theory: {row.theoryMarks}</span>
                  <span className="text-slate-400"> | </span>
                  <span className="font-semibold text-emerald-700">Lab: {row.practicalMarks}</span>
                </div>
              )
            },
            {
              header: 'Faculty Incharge',
              accessor: (row) => (
                <span className="text-xs text-slate-700 font-medium">
                  {row.leadFaculty}
                </span>
              )
            },
            {
              header: 'Credits',
              accessor: (row) => (
                <span className="text-[11px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                  {row.creditsWeekly}
                </span>
              )
            },
            {
              header: 'Action',
              accessor: (row) => (
                <button
                  onClick={() => setEditingCourse({ ...row })}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-[#1A4A7A] text-[#1A4A7A] hover:text-white font-bold rounded-lg text-xs cursor-pointer transition-colors flex items-center gap-1 shadow-2xs"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </button>
              )
            }
          ]}
        />
        )}
      </div>

      {/* ================= ADD COURSE MODAL ================= */}
      {isAddCourseOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsAddCourseOpen(false)}
          title="Register New Senior Secondary Course"
        >
          <form onSubmit={handleAddCourseSubmit} className="space-y-4 text-xs font-sans">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Subject Code *</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. MATH-041 / CS-083"
                  value={newCourse.code}
                  onChange={(e) => setNewCourse(prev => ({ ...prev, code: e.target.value }))}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Target Stream *</label>
                <select
                  value={newCourse.stream}
                  onChange={(e) => setNewCourse(prev => ({ ...prev, stream: e.target.value }))}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none font-bold"
                >
                  <option value="Science (PCM)">Science (PCM - Engineering)</option>
                  <option value="Science (PCB)">Science (PCB - Medical)</option>
                  <option value="Commerce">Commerce Stream</option>
                  <option value="Humanities">Humanities / Arts</option>
                  <option value="All Streams (Mandatory)">All Streams (Mandatory Core)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Course / Subject Name *</label>
              <input 
                type="text"
                required
                placeholder="e.g. Applied Mathematics & Statistics"
                value={newCourse.name}
                onChange={(e) => setNewCourse(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Theory Max Marks *</label>
                <input 
                  type="number"
                  required
                  min="0"
                  max="100"
                  value={newCourse.theoryMarks}
                  onChange={(e) => setNewCourse(prev => ({ ...prev, theoryMarks: Number(e.target.value) }))}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Practical / Lab Marks *</label>
                <input 
                  type="number"
                  required
                  min="0"
                  max="100"
                  value={newCourse.practicalMarks}
                  onChange={(e) => setNewCourse(prev => ({ ...prev, practicalMarks: Number(e.target.value) }))}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Lead Faculty / Incharge</label>
                <input 
                  type="text"
                  placeholder="e.g. Senior Faculty / HOD"
                  value={newCourse.leadFaculty}
                  onChange={(e) => setNewCourse(prev => ({ ...prev, leadFaculty: e.target.value }))}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Weekly Period Load</label>
                <input 
                  type="text"
                  placeholder="e.g. 6 Periods / Week"
                  value={newCourse.creditsWeekly}
                  onChange={(e) => setNewCourse(prev => ({ ...prev, creditsWeekly: e.target.value }))}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Syllabus Overview & Description</label>
              <textarea 
                rows={2}
                placeholder="Curriculum overview and board objectives..."
                value={newCourse.description}
                onChange={(e) => setNewCourse(prev => ({ ...prev, description: e.target.value }))}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
              <Button variant="ghost" onClick={() => setIsAddCourseOpen(false)}>
                Cancel
              </Button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#1A4A7A] hover:bg-[#153860] text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4 text-emerald-400" />
                Add Course to Catalog
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ================= EDIT COURSE MODAL ================= */}
      {editingCourse && (
        <Modal
          isOpen={true}
          onClose={() => setEditingCourse(null)}
          title={`Edit Course: ${editingCourse.name} (${editingCourse.code})`}
        >
          <form onSubmit={handleUpdateCourse} className="space-y-4 text-xs font-sans">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Course Title</label>
              <input 
                type="text"
                required
                value={editingCourse.name}
                onChange={(e) => setEditingCourse({ ...editingCourse, name: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Theory Marks</label>
                <input 
                  type="number"
                  required
                  value={editingCourse.theoryMarks}
                  onChange={(e) => setEditingCourse({ ...editingCourse, theoryMarks: Number(e.target.value) })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Practical / Lab Marks</label>
                <input 
                  type="number"
                  required
                  value={editingCourse.practicalMarks}
                  onChange={(e) => setEditingCourse({ ...editingCourse, practicalMarks: Number(e.target.value) })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Lead Faculty</label>
                <input 
                  type="text"
                  required
                  value={editingCourse.leadFaculty}
                  onChange={(e) => setEditingCourse({ ...editingCourse, leadFaculty: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Status</label>
                <select
                  value={editingCourse.status}
                  onChange={(e) => setEditingCourse({ ...editingCourse, status: e.target.value as any })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none font-bold"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="ARCHIVED">ARCHIVED</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Syllabus Overview</label>
              <textarea 
                rows={2}
                value={editingCourse.description || ''}
                onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none text-xs"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => handleDeleteCourse(editingCourse.id, editingCourse.name)}
                className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" /> Remove Course
              </button>

              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => setEditingCourse(null)}>
                  Cancel
                </Button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1A4A7A] hover:bg-[#153860] text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 text-[#F5C518]" />
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        </Modal>
      )}

      {/* ================= GRADING SCALE POLICY MODAL ================= */}
      {isGradingScaleOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsGradingScaleOpen(false)}
          title="CBSE Senior Secondary 9-Point Grading Scale"
        >
          <div className="space-y-4 text-xs font-sans">
            <p className="text-slate-600">
              Official CBSE positional grading standards applied across Classes 11th and 12th annual scorecards:
            </p>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-[#1A4A7A] text-white uppercase text-[10px]">
                  <tr>
                    <th className="p-2.5">Grade</th>
                    <th className="p-2.5">Marks Percentage Band</th>
                    <th className="p-2.5">Grade Point</th>
                    <th className="p-2.5">Performance Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  <tr><td className="p-2 font-bold text-emerald-700">A1</td><td className="p-2 font-mono">91% - 100%</td><td className="p-2 font-bold font-mono">10.0</td><td>Outstanding / Top 1/8th</td></tr>
                  <tr><td className="p-2 font-bold text-emerald-700">A2</td><td className="p-2 font-mono">81% - 90%</td><td className="p-2 font-bold font-mono">9.0</td><td>Excellent Performance</td></tr>
                  <tr><td className="p-2 font-bold text-blue-700">B1</td><td className="p-2 font-mono">71% - 80%</td><td className="p-2 font-bold font-mono">8.0</td><td>Very Good</td></tr>
                  <tr><td className="p-2 font-bold text-blue-700">B2</td><td className="p-2 font-mono">61% - 70%</td><td className="p-2 font-bold font-mono">7.0</td><td>Good</td></tr>
                  <tr><td className="p-2 font-bold text-amber-700">C1</td><td className="p-2 font-mono">51% - 60%</td><td className="p-2 font-bold font-mono">6.0</td><td>Fair / Average</td></tr>
                  <tr><td className="p-2 font-bold text-amber-700">C2</td><td className="p-2 font-mono">41% - 50%</td><td className="p-2 font-bold font-mono">5.0</td><td>Satisfactory</td></tr>
                  <tr><td className="p-2 font-bold text-red-600">D</td><td className="p-2 font-mono">33% - 40%</td><td className="p-2 font-bold font-mono">4.0</td><td>Marginal Pass</td></tr>
                  <tr className="bg-red-50 text-red-900 font-bold"><td className="p-2">E</td><td className="p-2 font-mono">&lt; 33%</td><td className="p-2 font-mono">0.0</td><td>Essential Repeat / Compartment</td></tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-200">
              <Button variant="primary" onClick={() => setIsGradingScaleOpen(false)}>
                Close Policy
              </Button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};
