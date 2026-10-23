import React, { useState } from 'react';
import { Table } from '../../components/shared/Table';
import { Badge } from '../../components/shared/Badge';
import { Button } from '../../components/shared/Button';
import { Modal } from '../../components/shared/Modal';
import { EmailOtpModal } from '../../components/shared/EmailOtpModal';
import { useAuthStore } from '../../store/authStore';
import { Calendar as CalendarIcon, CheckCircle2, XCircle, ShieldCheck, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

export const StudentAttendance: React.FC = () => {
  const user = useAuthStore(state => state.user);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isOtpOpen, setIsOtpOpen] = useState(false);

  const [leaveForm, setLeaveForm] = useState({
    startDate: '',
    endDate: '',
    reason: 'Medical / Health Checkup',
    parentEmail: 'parent.guardian@rips.edu.in'
  });

  const [mockAttendance, setMockAttendance] = useState<any[]>([]);

  const handleStartLeaveOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveForm.startDate || !leaveForm.endDate) {
      toast.error('Please enter start and end dates');
      return;
    }
    setIsLeaveModalOpen(false);
    setIsOtpOpen(true);
  };

  const handleLeaveVerified = () => {
    toast.success(`Leave request verified by Parent Email OTP & submitted for Class Teacher approval!`);
  };

  return (
    <div className="space-y-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold font-poppins text-slate-800">Attendance Overview</h2>
          <p className="text-xs text-slate-500 mt-0.5">Track your daily Senior Secondary attendance records & CBSE 75% compliance • School Hours: 10:00 AM – 04:00 PM</p>
        </div>
        <Button variant="primary" onClick={() => setIsLeaveModalOpen(true)}>
          <ShieldCheck className="w-4 h-4" /> Apply for Leave (OTP Verified)
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-[#E8EDF2] flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full border-4 border-emerald-500 flex items-center justify-center mb-2">
            <span className="text-xl font-bold text-emerald-700">100%</span>
          </div>
          <p className="font-semibold text-xs text-slate-600">Overall Attendance</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[#E8EDF2] flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-800">0</h3>
            <p className="text-xs font-semibold text-slate-500">Days Present</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[#E8EDF2] flex items-center gap-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-800">0</h3>
            <p className="text-xs font-semibold text-slate-500">Days Absent</p>
          </div>
        </div>
      </div>

      {/* Attendance History */}
      <div className="bg-white p-6 rounded-xl border border-[#E8EDF2]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold font-poppins text-slate-800">Daily Attendance Logs</h3>
          <Button variant="secondary" className="text-xs">
            <CalendarIcon className="w-4 h-4" /> Filter Month
          </Button>
        </div>
        {mockAttendance.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <p className="text-xs font-semibold text-slate-600">No attendance logs recorded for this session yet.</p>
            <p className="text-[10px] text-slate-400 mt-1">Daily classroom clock-in records will appear here.</p>
          </div>
        ) : (
          <Table<any> 
            data={mockAttendance}
            keyExtractor={(row: any) => row.date}
            columns={[
              { header: 'Date', accessor: (row: any) => <span className="font-semibold text-slate-700">{row.date}</span> },
              { header: 'In Time', accessor: (row: any) => row.inTime },
              { header: 'Out Time', accessor: (row: any) => row.outTime },
              { 
                header: 'Status', 
                accessor: (row: any) => <Badge status={row.status} /> 
              }
            ]}
          />
        )}
      </div>

      {/* Leave Application Modal */}
      <Modal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        title="Apply for Leave (CBSE Senior Wing)"
      >
        <form onSubmit={handleStartLeaveOtp} className="space-y-4">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
            <strong>Mandatory Parent Authorization:</strong> Per CBSE senior secondary regulations, all student leave applications require authorization via a one-time password (OTP) sent to the parent/guardian's registered email address.
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">From Date</label>
              <input 
                type="date" 
                required
                value={leaveForm.startDate}
                onChange={e => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1A4A7A] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">To Date</label>
              <input 
                type="date" 
                required
                value={leaveForm.endDate}
                onChange={e => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1A4A7A] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Reason for Leave</label>
            <input 
              type="text" 
              required
              value={leaveForm.reason}
              onChange={e => setLeaveForm({ ...leaveForm, reason: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1A4A7A] outline-none"
              placeholder="e.g. Competitive exam preparation / Medical sickness"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Parent's Registered Email</label>
            <input 
              type="email" 
              required
              value={leaveForm.parentEmail}
              onChange={e => setLeaveForm({ ...leaveForm, parentEmail: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1A4A7A] outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="ghost" onClick={() => setIsLeaveModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">
              Send Parent OTP Verification
            </Button>
          </div>
        </form>
      </Modal>

      {/* Parent Email OTP Modal */}
      <EmailOtpModal
        isOpen={isOtpOpen}
        onClose={() => setIsOtpOpen(false)}
        email={leaveForm.parentEmail}
        actionTitle="Parent Authorization: Leave Application"
        actionDescription={`A 6-digit verification code has been dispatched to ${leaveForm.parentEmail} to verify parental consent for leave from ${leaveForm.startDate || 'start'} to ${leaveForm.endDate || 'end'}.`}
        onVerified={handleLeaveVerified}
      />
    </div>
  );
};
