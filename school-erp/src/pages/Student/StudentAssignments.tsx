import React, { useState } from 'react';
import { Badge } from '../../components/shared/Badge';
import { Button } from '../../components/shared/Button';
import { Modal } from '../../components/shared/Modal';
import { FileText, Clock, CheckCircle, Inbox } from 'lucide-react';
import toast from 'react-hot-toast';

export const StudentAssignments: React.FC = () => {
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [assignments, setAssignments] = useState<any[]>([]);

  const handleOpenSubmit = (asg: any) => {
    setSelectedAssignment(asg);
    setIsSubmitModalOpen(true);
  };

  const handleSubmit = () => {
    toast.success('Assignment submitted successfully!');
    setIsSubmitModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold font-poppins text-slate-800">Assignments & Homework</h2>
        <p className="text-xs text-slate-500 mt-0.5">View and submit coursework assigned by faculty.</p>
      </div>

      {assignments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 flex flex-col items-center justify-center text-center shadow-xs">
          <div className="w-12 h-12 bg-blue-50 text-[#1A4A7A] rounded-2xl flex items-center justify-center mb-3">
            <Inbox className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No Pending Assignments</h3>
          <p className="text-xs text-slate-400 max-w-sm mt-1">
            You are all caught up! New homework tasks and problem sets assigned by your subject teachers will be listed here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignments.map(asg => (
            <div key={asg.id} className="bg-white rounded-xl border border-[#E8EDF2] p-5 shadow-xs flex flex-col transition-all hover:shadow-md">
              <div className="flex justify-between items-start mb-4">
                <Badge status={asg.status} />
                {asg.status === 'SUBMITTED' && asg.score && (
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Score: {asg.score}</span>
                )}
              </div>
              
              <h3 className="font-bold text-base text-slate-800 mb-1">{asg.title}</h3>
              <p className="text-xs font-semibold text-[#1A4A7A] mb-4">{asg.subject} <span className="text-slate-400 font-normal">• {asg.teacher}</span></p>
              
              <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                  <Clock className="w-4 h-4" /> Due: {asg.dueDate}
                </div>
                
                {asg.status === 'PENDING' ? (
                  <Button variant="primary" className="!py-1.5 !px-3 !text-xs" onClick={() => handleOpenSubmit(asg)}>
                    Submit
                  </Button>
                ) : (
                  <div className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                    <CheckCircle className="w-4 h-4" /> Done
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Submit Assignment Modal */}
      {isSubmitModalOpen && selectedAssignment && (
        <Modal
          isOpen={true}
          onClose={() => setIsSubmitModalOpen(false)}
          title={`Submit: ${selectedAssignment.title}`}
        >
          <div className="space-y-4 text-xs">
            <p className="text-slate-600">Upload your completed assignment files (PDF or ZIP):</p>
            <input type="file" className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-[#1A4A7A] hover:file:bg-blue-100" />
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="ghost" onClick={() => setIsSubmitModalOpen(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleSubmit}>Submit Homework</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
