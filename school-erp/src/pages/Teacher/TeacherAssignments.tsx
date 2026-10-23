import React, { useState } from 'react';
import { Table } from '../../components/shared/Table';
import { Badge } from '../../components/shared/Badge';
import { Button } from '../../components/shared/Button';
import { Modal } from '../../components/shared/Modal';
import { Plus, Inbox } from 'lucide-react';
import toast from 'react-hot-toast';

export const TeacherAssignments: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'past'>('active');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    class: '12-Sci',
    deadline: '',
    description: ''
  });

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssignment.title || !newAssignment.deadline) {
      toast.error('Please enter assignment title and deadline');
      return;
    }

    const created = {
      id: `ASG-${Date.now().toString().slice(-4)}`,
      title: newAssignment.title,
      class: newAssignment.class,
      deadline: newAssignment.deadline,
      submissions: '0/0',
      status: 'ACTIVE'
    };

    setAssignments(prev => [created, ...prev]);
    setIsCreateModalOpen(false);
    setNewAssignment({ title: '', class: '12-Sci', deadline: '', description: '' });
    toast.success('Assignment created and published to students successfully!');
  };

  const displayedAssignments = assignments.filter(a => activeTab === 'active' ? a.status === 'ACTIVE' : a.status === 'GRADED');

  return (
    <div className="bg-white p-6 rounded-xl border border-[#E8EDF2] flex flex-col h-[calc(100vh-120px)] shadow-xs">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold font-poppins text-slate-800">Assignments & Homework</h2>
          <p className="text-xs text-slate-500 mt-0.5">Track, publish and grade student assignments.</p>
        </div>
        <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4" /> Create Assignment
        </Button>
      </div>

      <div className="flex border-b border-slate-200 mb-6">
        <button 
          className={`pb-3 px-4 font-semibold text-xs cursor-pointer ${activeTab === 'active' ? 'border-b-2 border-[#1A4A7A] text-[#1A4A7A] font-bold' : 'text-slate-500'}`}
          onClick={() => setActiveTab('active')}
        >
          Active Assignments ({assignments.filter(a => a.status === 'ACTIVE').length})
        </button>
        <button 
          className={`pb-3 px-4 font-semibold text-xs cursor-pointer ${activeTab === 'past' ? 'border-b-2 border-[#1A4A7A] text-[#1A4A7A] font-bold' : 'text-slate-500'}`}
          onClick={() => setActiveTab('past')}
        >
          Past / Graded ({assignments.filter(a => a.status === 'GRADED').length})
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        {displayedAssignments.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <Inbox className="w-10 h-10 mb-2 stroke-1 text-slate-300" />
            <h4 className="text-sm font-bold text-slate-700">No Assignments Found</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              {activeTab === 'active' 
                ? 'No active homework or problem sets published. Click "+ Create Assignment" to assign coursework to students.' 
                : 'No completed or archived assignments in this tab.'}
            </p>
          </div>
        ) : (
          <Table<any> 
            data={displayedAssignments}
            keyExtractor={(row) => row.id}
            columns={[
              { header: 'Title', accessor: (row) => <span className="font-semibold text-[#1A4A7A] text-xs">{row.title}</span> },
              { header: 'Class', accessor: (row) => row.class },
              { header: 'Deadline', accessor: (row) => row.deadline },
              { header: 'Submissions', accessor: (row) => <span className="font-bold text-xs">{row.submissions}</span> },
              { 
                header: 'Status', 
                accessor: (row) => <Badge status={row.status} /> 
              },
              { 
                header: 'Action', 
                accessor: (row) => (
                  <button 
                    onClick={() => toast.success(`Viewing submissions for ${row.title}`)}
                    className="text-blue-600 hover:underline font-semibold text-xs cursor-pointer"
                  >
                    Review
                  </button> 
                )
              }
            ]}
          />
        )}
      </div>

      {/* Create Assignment Modal */}
      {isCreateModalOpen && (
        <Modal 
          isOpen={true} 
          onClose={() => setIsCreateModalOpen(false)}
          title="Create New Assignment"
        >
          <form onSubmit={handleCreateAssignment} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Assignment Title *</label>
              <input 
                type="text" 
                required
                placeholder="e.g. Chapter 4 Chemistry Problem Set"
                value={newAssignment.title}
                onChange={e => setNewAssignment({ ...newAssignment, title: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#1A4A7A] focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Target Class *</label>
                <select 
                  value={newAssignment.class}
                  onChange={e => setNewAssignment({ ...newAssignment, class: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#1A4A7A] focus:outline-hidden"
                >
                  <option value="11-Sci">Class 11 - Science (PCM/PCB)</option>
                  <option value="11-Com">Class 11 - Commerce</option>
                  <option value="11-Arts">Class 11 - Humanities / Arts</option>
                  <option value="12-Sci">Class 12 - Science (PCM/PCB)</option>
                  <option value="12-Com">Class 12 - Commerce</option>
                  <option value="12-Arts">Class 12 - Humanities / Arts</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Submission Deadline *</label>
                <input 
                  type="date" 
                  required
                  value={newAssignment.deadline}
                  onChange={e => setNewAssignment({ ...newAssignment, deadline: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#1A4A7A] focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Instructions / Description</label>
              <textarea 
                rows={3}
                placeholder="Provide guidelines, chapters to read, and submission format..."
                value={newAssignment.description}
                onChange={e => setNewAssignment({ ...newAssignment, description: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#1A4A7A] focus:outline-hidden"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <Button variant="ghost" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
              <Button variant="primary" type="submit">Publish Assignment</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
