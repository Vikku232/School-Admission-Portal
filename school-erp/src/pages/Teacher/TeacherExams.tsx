import React, { useState } from 'react';
import { Table } from '../../components/shared/Table';
import { Badge } from '../../components/shared/Badge';
import { Button } from '../../components/shared/Button';
import { Modal } from '../../components/shared/Modal';
import { FileUploadZone } from '../../components/shared/FileUploadZone';
import { UploadCloud, CheckCircle, ShieldCheck } from 'lucide-react';
import { EmailOtpModal } from '../../components/shared/EmailOtpModal';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

export const TeacherExams: React.FC = () => {
  const user = useAuthStore(state => state.user);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [selectedExamName, setSelectedExamName] = useState('CBSE Pre-Board Physics');

  const [mockExams, setMockExams] = useState<any[]>([]);

  const handlePromptOtp = (examName: string) => {
    setSelectedExamName(examName);
    setIsUploadModalOpen(false);
    setIsOtpOpen(true);
  };

  const handleFinalizeGrades = () => {
    setMockExams(prev => prev.map(ex => ex.name === selectedExamName ? { ...ex, status: 'GRADED' } : ex));
    toast.success(`Grades for "${selectedExamName}" finalized and published securely! Official notification dispatched.`);
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-[#E8EDF2] flex flex-col h-[calc(100vh-120px)] shadow-xs">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold font-poppins text-slate-800">Exam Grading & Marks Submission</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage and upload student grades for senior secondary examinations.</p>
        </div>
        <Button variant="primary" onClick={() => setIsUploadModalOpen(true)}>
          <UploadCloud className="w-4 h-4" /> Upload Grades
        </Button>
      </div>

      <div className="flex-1 overflow-hidden">
        {mockExams.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <ShieldCheck className="w-10 h-10 mb-2 stroke-1 text-slate-300" />
            <h4 className="text-sm font-bold text-slate-700">No Pending Exam Marksheets</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              All term assessments and pre-board examinations have either been graded or have not yet been scheduled. Click "Upload Grades" to submit new marksheets.
            </p>
          </div>
        ) : (
          <Table<any> 
            data={mockExams}
            keyExtractor={(row: any) => row.id}
            columns={[
              { header: 'Exam Name', accessor: (row: any) => <span className="font-semibold text-[#1A4A7A] text-xs">{row.name}</span> },
              { header: 'Class', accessor: (row: any) => row.class },
              { header: 'Date', accessor: (row: any) => row.date },
              { 
                header: 'Status', 
                accessor: (row: any) => (
                  <Badge status={
                    row.status === 'GRADED' ? 'ACTIVE' : 
                    row.status === 'PENDING' ? 'DUE' : 'PENDING'
                  } />
                ) 
              },
              { 
                header: 'Action', 
                accessor: (row: any) => (
                  <button 
                    onClick={() => handlePromptOtp(row.name)}
                    className={`text-xs font-semibold cursor-pointer ${row.status === 'GRADED' ? 'text-slate-400 cursor-not-allowed' : 'text-blue-600 hover:underline'}`}
                    disabled={row.status === 'GRADED'}
                  >
                    {row.status === 'GRADED' ? 'Marks Published' : 'Authorize & Enter Marks'}
                  </button>
                ) 
              }
            ]}
          />
        )}
      </div>

      <Modal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload & Finalize Exam Grades"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">Please upload the finalized CSV/Excel marksheet for Class 11/12 Senior Secondary assessments. Once confirmed, you will be prompted for faculty Email OTP verification to publish grades.</p>
          <FileUploadZone onFileSelect={() => {}} acceptedTypes=".csv,.xlsx" />
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="ghost" onClick={() => setIsUploadModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => handlePromptOtp('CBSE Senior Secondary Batch Scores')}>
              Proceed to Email OTP Verification
            </Button>
          </div>
        </div>
      </Modal>

      {/* Faculty OTP Verification Modal */}
      <EmailOtpModal
        isOpen={isOtpOpen}
        onClose={() => setIsOtpOpen(false)}
        email={user?.email || 'pgt.faculty@rips.edu.in'}
        actionTitle="Faculty Exam Grade Finalization"
        actionDescription={`To lock and officially publish grades for "${selectedExamName}" to the senior board portal, enter the 6-digit verification code sent to your faculty email.`}
        onVerified={handleFinalizeGrades}
      />
    </div>
  );
};
