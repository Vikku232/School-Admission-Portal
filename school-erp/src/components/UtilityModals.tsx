import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import { 
  X, 
  Bell, 
  GraduationCap, 
  Users, 
  ShieldCheck, 
  Briefcase, 
  CreditCard, 
  Search,
  FileText,
  Lock,
  CheckCircle2,
  Send,
  Download,
  Building2,
  Sparkles
} from 'lucide-react';
import { NOTICES, CAREER_POSTINGS, FEE_STRUCTURE } from '../data/schoolData';
import { UtilityItem } from '../types';
import { EmailOtpModal } from './shared/EmailOtpModal';
import { initiateRazorpayPayment } from '../lib/razorpay';
import { api } from '../api/axios';
import { supabaseService } from '../services/supabaseService';

interface UtilityModalsProps {
  activeUtility: UtilityItem['id'] | null;
  onClose: () => void;
  onOpenAdmissions: () => void;
}

export const UtilityModals: React.FC<UtilityModalsProps> = ({
  activeUtility,
  onClose,
  onOpenAdmissions
}) => {
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);
  const user = useAuthStore(state => state.user);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const isAdmin = isAuthenticated && user?.role === 'admin';

  // Local state for interactive utilities
  const [searchQuery, setSearchQuery] = useState('');
  const [alumniRegistered, setAlumniRegistered] = useState(false);
  const [feeStudentId, setFeeStudentId] = useState('');
  const [feePayerEmail, setFeePayerEmail] = useState('');
  const [feeReceiptNo, setFeeReceiptNo] = useState('');
  const [feePaid, setFeePaid] = useState(false);
  const [isFeeOtpOpen, setIsFeeOtpOpen] = useState(false);
  const [appliedJob, setAppliedJob] = useState<string | null>(null);


  // Admin Portal Login States
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminLoginError, setAdminLoginError] = useState('');
  const [adminIsLoading, setAdminIsLoading] = useState(false);

  if (!activeUtility) return null;

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminLoginError('');
    setAdminIsLoading(true);
    
    try {
      const response = await api.post('/auth/login', {
        email: adminEmail.trim(),
        password: adminPassword,
        role: 'admin' // Since it's admin portal
      });

      const data = response.data;
      
      // Save to Zustand & localStorage
      login({ email: data.email, name: data.name, role: 'admin' }, data.token);
      
      toast.success(`Welcome back, ${data.name}!`);
      
      // Close modal and redirect directly to dashboard
      onClose();
      navigate('/admin/dashboard');
    } catch (err: any) {
      setAdminLoginError(err.message || 'Failed to login');
    } finally {
      setAdminIsLoading(false);
    }
  };

  const renderContent = () => {
    switch (activeUtility) {
      /* 1. NOTICE & CIRCULAR */
      case 'notice':
        return (
          <div className="space-y-4 font-sans">
            <div className="flex items-center gap-2 mb-2">
              <Bell className="w-5 h-5 text-[#1E3A8A]" />
              <h3 className="text-xl font-bold font-poppins text-[#1E3A8A]">Official Notices & Circulars</h3>
            </div>
            <p className="text-xs text-slate-500">Latest school announcements, exam dates, and administrative circulars.</p>

            <div className="space-y-2 max-h-96 overflow-y-auto pt-2">
              {NOTICES.map((item) => (
                <div key={item.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#1E3A8A] flex items-center justify-center shrink-0 mt-0.5">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        {item.isImportant && (
                          <span className="bg-red-100 text-red-700 text-[10px] font-bold px-1.5 py-0.2 rounded font-poppins">
                            URGENT
                          </span>
                        )}
                        <span className="text-[11px] font-semibold text-slate-400">{item.date}</span>
                      </div>
                      <h4 className="font-poppins font-semibold text-slate-900 text-xs sm:text-sm mt-0.5">
                        {item.title}
                      </h4>
                    </div>
                  </div>

                  <button className="text-xs font-bold font-poppins text-[#1E3A8A] hover:bg-blue-100 p-2 rounded-lg transition-colors flex items-center gap-1 cursor-pointer shrink-0">
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">PDF</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      /* 2. ALUMNI */
      case 'alumni':
        return (
          <div className="space-y-4 font-sans">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-[#1E3A8A]" />
              <h3 className="text-xl font-bold font-poppins text-[#1E3A8A]">RIPS Alumni Association</h3>
            </div>
            <p className="text-xs text-slate-600">
              Welcome back, RIPSians! Join our global network of over 12,000 successful graduates in technology, medicine, defense, civil services, and arts.
            </p>

            {alumniRegistered ? (
              <div className="p-4 bg-emerald-50 text-emerald-900 rounded-xl text-center space-y-2 border border-emerald-200">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-poppins font-bold text-sm">Alumni Registration Received!</h4>
                <p className="text-xs">You are now connected to the RIPS Alumni Directory 2026.</p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setAlumniRegistered(true); }} className="space-y-3 pt-2 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                    <input required type="text" placeholder="e.g. Dr. Priya Verma" className="w-full p-2.5 rounded-lg border border-slate-300" />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Passing Batch Year</label>
                    <input required type="text" placeholder="e.g. Class of 2018" className="w-full p-2.5 rounded-lg border border-slate-300" />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Current Designation & Organization</label>
                  <input required type="text" placeholder="e.g. Software Engineer @ Google" className="w-full p-2.5 rounded-lg border border-slate-300" />
                </div>
                <button type="submit" className="w-full bg-[#1E3A8A] text-[#F5C518] font-poppins font-bold py-2.5 rounded-xl hover:bg-blue-900 cursor-pointer">
                  Register in Alumni Association
                </button>
              </form>
            )}
          </div>
        );

      /* 3. ALUMNI NETWORK */
      case 'alumni-network':
        return (
          <div className="space-y-4 font-sans">
            <div className="flex items-center gap-2">
              <Users className="w-6 h-6 text-[#1E3A8A]" />
              <h3 className="text-xl font-bold font-poppins text-[#1E3A8A]">Global Alumni Network</h3>
            </div>
            <p className="text-xs text-slate-600">Connect with RIPS mentorship chapters across India, USA, UK, Singapore, and UAE.</p>

            <div className="grid sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                <h4 className="font-poppins font-bold text-slate-900">Technology & AI Chapter</h4>
                <p className="text-slate-500 mt-0.5">340+ Members • Lead: Sameer Malhotra (2012 Batch)</p>
                <button className="mt-2 text-[11px] font-bold text-[#1E3A8A] underline cursor-pointer">Join Chapter Group</button>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                <h4 className="font-poppins font-bold text-slate-900">Healthcare & Medicine Chapter</h4>
                <p className="text-slate-500 mt-0.5">210+ Members • Lead: Dr. Neha Rao (2009 Batch)</p>
                <button className="mt-2 text-[11px] font-bold text-[#1E3A8A] underline cursor-pointer">Join Chapter Group</button>
              </div>
            </div>
          </div>
        );

      /* 4. ADMIN PORTAL */
      case 'admin-portal':
        return (
          <div className="space-y-4 font-sans">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-[#1E3A8A]" />
              <h3 className="text-xl font-bold font-poppins text-[#1E3A8A]">RIPS Admin & Staff Portal</h3>
            </div>
            <p className="text-xs text-slate-600">Authorized login for faculty, department heads, and administrative staff.</p>

            {isAdmin ? (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-center space-y-3">
                <CheckCircle2 className="w-8 h-8 text-[#1E3A8A] mx-auto" />
                <h4 className="font-poppins font-bold text-sm text-[#1E3A8A]">Welcome back, {user?.name}!</h4>
                <p className="text-xs text-slate-600">Session active. Click below to enter your dashboard.</p>
                <button 
                  onClick={() => {
                    onClose();
                    navigate('/admin/dashboard');
                  }} 
                  className="w-full bg-[#1E3A8A] text-white font-poppins font-bold py-2 rounded-xl hover:bg-blue-900 cursor-pointer text-xs"
                >
                  Go to Admin Dashboard
                </button>
              </div>
            ) : (
              <form onSubmit={handleAdminLogin} className="space-y-3 text-xs pt-2">
                {adminLoginError && (
                  <div className="p-2 bg-red-50 border border-red-200 text-red-600 rounded-lg text-center font-semibold">
                    {adminLoginError}
                  </div>
                )}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email / Staff ID</label>
                  <input 
                    required 
                    type="email" 
                    placeholder="admin@rips.edu" 
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300" 
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Password</label>
                  <input 
                    required 
                    type="password" 
                    placeholder="••••••••" 
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300" 
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={adminIsLoading}
                  className="w-full bg-[#1E3A8A] text-white font-poppins font-bold py-2.5 rounded-xl hover:bg-blue-900 cursor-pointer disabled:opacity-70 flex justify-center items-center gap-2"
                >
                  {adminIsLoading ? 'Authenticating...' : 'Secure Admin Login'}
                </button>

                <div className="pt-2 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-center justify-between">
                  <span>Demo: <strong>admin@school.com</strong> / <strong>12345678</strong></span>
                  <button
                    type="button"
                    onClick={() => {
                      setAdminEmail('admin@school.com');
                      setAdminPassword('12345678');
                    }}
                    className="font-bold text-[#1E3A8A] hover:underline cursor-pointer"
                  >
                    Auto-Fill
                  </button>
                </div>
              </form>
            )}
          </div>
        );

      /* 5. CAREER */
      case 'career':
        return (
          <div className="space-y-4 font-sans">
            <div className="flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-[#1E3A8A]" />
              <h3 className="text-xl font-bold font-poppins text-[#1E3A8A]">Career Opportunities at RIPS</h3>
            </div>
            <p className="text-xs text-slate-600">Join our dynamic team of educators and innovators. We offer competitive remuneration, research grants, and faculty housing.</p>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {CAREER_POSTINGS.map((post) => (
                <div key={post.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <h4 className="font-poppins font-bold text-slate-900 text-sm">{post.title}</h4>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded font-poppins">{post.type}</span>
                  </div>
                  <p className="text-slate-600"><strong>Wing:</strong> {post.department} | <strong>Experience:</strong> {post.experience}</p>
                  <p className="text-slate-600"><strong>Qualification:</strong> {post.qualification}</p>
                  
                  <div className="pt-2 flex items-center justify-between border-t border-slate-200/80">
                    <span className="text-[11px] text-slate-400">Apply by: {post.lastDate}</span>
                    <button
                      onClick={() => setAppliedJob(post.title)}
                      className="bg-[#1E3A8A] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg hover:bg-blue-900 cursor-pointer"
                    >
                      {appliedJob === post.title ? 'Applied ✓' : 'Apply Now'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      /* 6. PAY FEES */
      case 'pay-fees':
        return (
          <div className="space-y-4 font-sans">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-[#1E3A8A]" />
                <h3 className="text-xl font-bold font-poppins text-[#1E3A8A]">Online Fee Payment Portal</h3>
              </div>
              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                Powered by Razorpay
              </span>
            </div>
            <p className="text-xs text-slate-600">Secure 256-bit encrypted fee payment gateway for quarterly tuition, practical labs, and composite senior school fees.</p>

            {feePaid ? (
              <div className="p-5 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-2xl text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-poppins font-bold text-base text-emerald-800">Payment Successful & Receipt Generated!</h4>
                <div className="bg-white p-3.5 rounded-xl border border-emerald-200 text-left space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Student ID / Enrollment:</span>
                    <span className="font-mono font-bold text-slate-800">{feeStudentId || 'RIPS-2027'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Amount Paid:</span>
                    <span className="font-mono font-bold text-emerald-700 text-sm">₹22,000.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Payment Gateway:</span>
                    <span className="font-semibold text-blue-800">Razorpay (Verified)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Receipt Voucher #:</span>
                    <span className="font-mono font-bold text-slate-900">{feeReceiptNo || 'REC-2027-PAID'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Payer Email:</span>
                    <span className="text-slate-700 font-semibold text-blue-900">{feePayerEmail || 'parent@rips.edu.in'}</span>
                  </div>
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-950 text-[11px] mt-2 flex items-start gap-2">
                    <span className="text-base">📄</span>
                    <div>
                      <strong>Official PDF Dispatched!</strong> An official fee receipt in <strong>PDF format (.pdf)</strong> has been sent to <strong>{feePayerEmail || 'your email'}</strong> with an instant 1-click download attachment.
                    </div>
                  </div>
                </div>

                <div className="flex justify-center gap-3 pt-1">
                  <button 
                    onClick={() => {
                      window.open(`/receipt/${feeReceiptNo}`, '_blank');
                    }} 
                    className="px-4 py-2 bg-[#1E3A8A] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#152e6f] cursor-pointer flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" /> View / Download Receipt
                  </button>
                  <button 
                    onClick={() => {
                      setFeePaid(false);
                      setFeeStudentId('');
                    }} 
                    className="px-4 py-2 bg-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-300 cursor-pointer"
                  >
                    New Transaction
                  </button>
                </div>
              </div>
            ) : (
              <form 
                onSubmit={async (e) => { 
                  e.preventDefault(); 
                  try {
                    toast.loading('Launching Razorpay Secure Checkout...', { id: 'rzp-pay' });
                    const res = await initiateRazorpayPayment({
                      amount: 22000,
                      description: 'Class 11/12 Senior Secondary Quarterly Tuition Fee',
                      studentId: feeStudentId.trim() || 'RIPS-2027-PORTAL',
                      studentName: `Student (${feeStudentId || 'Senior'})`,
                      email: feePayerEmail.trim(),
                      phone: '+919876543210',
                      feeType: 'Tuition & Composite Fee (Quarterly)'
                    });

                    const recNo = `REC-2027-${Math.floor(10000 + Math.random() * 90000)}`;
                    setFeeReceiptNo(recNo);

                    // Record in Supabase
                    await supabaseService.recordPayment({
                      id: `PAY-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
                      receipt_no: recNo,
                      student_id: feeStudentId.trim() || 'RIPS-PORTAL',
                      student_name: `Student (${feeStudentId || 'Online'})`,
                      grade: 'Class 11 - Senior Secondary',
                      fee_type: 'Tuition & Composite Fee (Quarterly)',
                      amount: 22000,
                      payment_method: 'RAZORPAY_UPI',
                      reference_no: res.razorpay_payment_id,
                      razorpay_payment_id: res.razorpay_payment_id,
                      payer_email: feePayerEmail.trim(),
                      date: new Date().toISOString().slice(0, 10),
                      status: 'COMPLETED'
                    });

                    // Dispatch Official Receipt Email via Vercel Serverless (Port 587 is completely open on Vercel!)
                    try {
                      const emailPayload = {
                        email: feePayerEmail.trim(),
                        receiptNo: recNo,
                        studentId: feeStudentId.trim() || 'RIPS-2027-PORTAL',
                        studentName: `Student (${feeStudentId.trim() || 'Senior Secondary'})`,
                        amount: 22000,
                        feeType: 'Class 11/12 Senior Secondary Quarterly Tuition Fee',
                        referenceNo: res.razorpay_payment_id
                      };

                      const vResponse = await fetch('/api/send-receipt', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(emailPayload)
                      });
                      const vData = await vResponse.json();

                      // Also register in Render backend for DB & PDF voucher generation
                      api.post('/payments/razorpay/send-receipt-email', emailPayload).catch(() => {});

                      if (vData && vData.success) {
                        toast.success(`Official Receipt email dispatched to ${feePayerEmail.trim()}!`);
                      } else {
                        console.info('Vercel mailer dispatch note:', vData);
                        toast('Official PDF receipt generated! Click below to view/download.', { icon: '📄', duration: 4000 });
                      }
                    } catch (emailErr: any) {
                      console.warn('Receipt dispatch note:', emailErr);
                      toast('Official PDF receipt generated! Click below to view/download.', { icon: '📄', duration: 4000 });
                    }

                    setFeePaid(true);
                    toast.success('Payment authorized by Razorpay! Official receipt generated.', { id: 'rzp-pay' });
                  } catch (err: any) {
                    if (err.message === 'PAYMENT_CANCELLED') {
                      toast.error('Payment cancelled.', { id: 'rzp-pay' });
                    } else {
                      toast.error(err.message || 'Payment failed.', { id: 'rzp-pay' });
                    }
                  }
                }} 
                className="space-y-3 text-xs pt-2"
              >
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Student Enrollment Number / Admission ID *</label>
                  <input
                    required
                    type="text"
                    value={feeStudentId}
                    onChange={e => setFeeStudentId(e.target.value)}
                    placeholder="e.g. RIPS-2027-1104"
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Payer's Registered Email *</label>
                  <input
                    required
                    type="email"
                    value={feePayerEmail}
                    onChange={e => setFeePayerEmail(e.target.value)}
                    placeholder="parent@gmail.com"
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Select Quarter & Class</label>
                  <select className="w-full p-2.5 rounded-lg border border-slate-300 bg-white">
                    <option>Class 11 Science/Commerce - Quarter I (Apr - Jun 2027-28) • ₹22,000</option>
                    <option>Class 12 Science/Commerce - Quarter I (Apr - Jun 2027-28) • ₹22,000</option>
                  </select>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between text-blue-900">
                  <span className="font-semibold">Payable Amount:</span>
                  <span className="font-mono font-bold text-base text-[#1E3A8A]">₹22,000.00</span>
                </div>
                <button type="submit" className="w-full bg-[#F5C518] hover:bg-[#e5b60e] text-[#1E3A8A] font-poppins font-bold py-3.5 rounded-xl cursor-pointer shadow-md flex items-center justify-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> Pay with Razorpay (Test Mode)
                </button>
              </form>
            )}
          </div>
        );


      /* 7. SEARCH */
      case 'search':
        return (
          <div className="space-y-4 font-sans">
            <div className="flex items-center gap-2">
              <Search className="w-6 h-6 text-[#1E3A8A]" />
              <h3 className="text-xl font-bold font-poppins text-[#1E3A8A]">Global RIPS Search</h3>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search infrastructure, sports, admissions, syllabus, faculty..."
                className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#1E3A8A] text-xs sm:text-sm"
              />
            </div>

            <div className="pt-2 text-xs">
              <p className="font-semibold text-slate-400 uppercase tracking-wider mb-2 text-[10px] font-poppins">Popular Quick Queries</p>
              <div className="flex flex-wrap gap-2">
                {['Admission Form 2027-28', 'Bus Routes', 'CBSE Syllabus', 'Robotics Lab', 'Swimming Pool', 'Fee Structure'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-blue-100 hover:text-[#1E3A8A] transition-colors cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {searchQuery && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs mt-3">
                <p className="font-bold text-[#1E3A8A]">Search Results for "{searchQuery}":</p>
                <div className="space-y-1 text-slate-700">
                  <div className="p-2 bg-white rounded border border-slate-100 cursor-pointer hover:bg-blue-50" onClick={onOpenAdmissions}>
                    🎓 <strong>Admission Overview 2027–28</strong> - Open registrations and eligibility rules.
                  </div>
                  <div className="p-2 bg-white rounded border border-slate-100 cursor-pointer hover:bg-blue-50" onClick={onClose}>
                    🏫 <strong>Infrastructure</strong> - Science labs, smart classrooms & sports ground.
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        
        <div className="bg-[#1E3A8A] text-white p-4 px-6 flex items-center justify-between">
          <span className="font-poppins font-bold text-xs uppercase text-[#F5C518]">RIPS Utility Portal</span>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white text-[#1E3A8A] flex items-center justify-center hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        <div className="p-6">
          {renderContent()}
        </div>

      </div>

      {/* Online Fee Payment OTP Modal */}
      <EmailOtpModal
        isOpen={isFeeOtpOpen}
        onClose={() => setIsFeeOtpOpen(false)}
        email={feePayerEmail || 'parent@rips.edu.in'}
        actionTitle="Payment Gateway 2FA Authorization"
        actionDescription={`For payment authorization of ₹22,000 (Student ID: ${feeStudentId || 'RIPS-2027'}), enter the 6-digit OTP dispatched to ${feePayerEmail || 'your email'}.`}
        onVerified={() => {
          setFeePaid(true);
          toast.success('Payment verified & processed! Official receipt generated.');
        }}
      />
    </div>
  );
};
