import React, { useState } from 'react';
import { Table } from '../../components/shared/Table';
import { Badge } from '../../components/shared/Badge';
import { Button } from '../../components/shared/Button';
import { Modal } from '../../components/shared/Modal';
import { 
  IndianRupee, Search, Download, Plus, Filter, 
  CreditCard, CheckCircle2, Clock, Printer, FileText, 
  Receipt, Building2, User, Check, X
} from 'lucide-react';
import toast from 'react-hot-toast';

export interface PaymentTransaction {
  id: string;
  referenceNo: string;
  studentId: string;
  studentName: string;
  grade: string;
  feeType: string;
  amount: number;
  paymentMethod: 'RAZORPAY_UPI' | 'RAZORPAY_CARD' | 'BANK_TRANSFER' | 'CASH_COUNTER' | 'CHEQUE';
  date: string;
  status: 'COMPLETED' | 'PENDING' | 'REFUNDED';
  receiptNo: string;
  invoicePdf?: string;
  pdfUrl?: string;
}

import { supabaseService, SupabasePayment } from '../../services/supabaseService';

export const AdminPayments: React.FC = () => {
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'COMPLETED' | 'PENDING'>('ALL');
  const [methodFilter, setMethodFilter] = useState<string>('ALL');

  // Load from Supabase
  const loadPaymentsFromCloud = async () => {
    try {
      setLoading(true);
      const data = await supabaseService.getPayments();
      const mapped: PaymentTransaction[] = data.map((p, idx) => ({
        id: p.id || `TXN${idx + 1}`,
        referenceNo: p.reference_no || p.razorpay_payment_id || `REF-${p.receipt_no}`,
        studentId: p.student_id || 'STU-SENIOR',
        studentName: p.student_name,
        grade: p.grade || 'Class 11 - Science',
        feeType: p.fee_type || 'Tuition Fee (Quarterly)',
        amount: Number(p.amount) || 0,
        paymentMethod: (p.payment_method as any) || 'RAZORPAY_UPI',
        date: p.date ? new Date(p.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Today',
        status: (p.status as any) || 'COMPLETED',
        receiptNo: p.receipt_no,
        invoicePdf: p.invoice_pdf,
        pdfUrl: p.pdf_url
      }));
      setPayments(mapped);
    } catch (err: any) {
      console.warn('Failed to load payments from Supabase:', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadPaymentsFromCloud();
  }, []);

  // Modals
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentTransaction | null>(null);

  // Record Offline Payment State
  const [offlineForm, setOfflineForm] = useState({
    studentName: '',
    grade: 'Class 11 - Science',
    feeType: 'Tuition Fee (Quarterly)',
    amount: '',
    paymentMethod: 'CASH_COUNTER' as const,
    referenceNo: '',
    remarks: 'Received at Senior Wing accounts desk'
  });

  // Filter logic
  const filteredPayments = payments.filter((p) => {
    const matchesSearch = 
      p.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.referenceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.receiptNo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    const matchesMethod = methodFilter === 'ALL' || p.paymentMethod === methodFilter;

    return matchesSearch && matchesStatus && matchesMethod;
  });

  // Export CSV
  const handleExportCsv = () => {
    const headers = ['Receipt No', 'Reference ID', 'Student ID', 'Student Name', 'Grade & Stream', 'Fee Component', 'Amount (INR)', 'Payment Method', 'Timestamp', 'Status'];
    const rows = filteredPayments.map(p => [
      `"${p.receiptNo}"`,
      `"${p.referenceNo}"`,
      `"${p.studentId}"`,
      `"${p.studentName}"`,
      `"${p.grade}"`,
      `"${p.feeType}"`,
      `"${p.amount}"`,
      `"${p.paymentMethod}"`,
      `"${p.date}"`,
      `"${p.status}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `school_payments_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Exported ${filteredPayments.length} payment records to CSV!`);
  };

  // Record Offline Payment Submit
  const handleRecordOfflineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(offlineForm.amount) || 0;
    if (amountVal <= 0) {
      toast.error('Please enter a valid payment amount');
      return;
    }

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const receiptNo = `REC-2027-${Math.floor(10000 + Math.random() * 90000)}`;
    const studentId = offlineForm.studentName.includes('(') ? offlineForm.studentName.split('(')[1].replace(')', '') : 'STU-COUNTER';
    const studentName = offlineForm.studentName.split('(')[0].trim();
    const referenceNo = offlineForm.referenceNo.trim() || `COUNTER-${randomNum}`;

    try {
      await supabaseService.recordPayment({
        id: `PAY-${Date.now()}-${randomNum}`,
        receipt_no: receiptNo,
        student_id: studentId,
        student_name: studentName,
        grade: offlineForm.grade,
        fee_type: offlineForm.feeType,
        amount: amountVal,
        payment_method: offlineForm.paymentMethod,
        reference_no: referenceNo,
        date: new Date().toISOString().slice(0, 10),
        status: 'COMPLETED'
      });

      await loadPaymentsFromCloud();
      toast.success(`Payment of ₹${amountVal.toLocaleString()} recorded in cloud database! Receipt #${receiptNo}`);
      setIsRecordModalOpen(false);
      setOfflineForm({
        studentName: '',
        grade: 'Class 11 - Science',
        feeType: 'Tuition Fee (Quarterly)',
        amount: '',
        paymentMethod: 'CASH_COUNTER' as const,
        referenceNo: '',
        remarks: 'Received at Senior Wing accounts desk'
      });
    } catch (err: any) {
      toast.error(err.message || 'Failed to record payment in database');
    }
  };

  // Printable Receipt Trigger
  const handlePrintReceipt = () => {
    toast.success('Generating official printable receipt voucher...');
    setTimeout(() => {
      window.print();
    }, 400);
  };

  const totalCollectedAmount = payments
    .filter(p => p.status === 'COMPLETED')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const razorpayOnlineCollected = payments
    .filter(p => p.status === 'COMPLETED' && (p.paymentMethod.includes('RAZORPAY') || p.paymentMethod.includes('UPI') || p.paymentMethod.includes('CARD')))
    .reduce((acc, curr) => acc + curr.amount, 0);


  return (
    <div className="bg-white p-6 rounded-2xl border border-[#E8EDF2] flex flex-col min-h-[calc(100vh-120px)] shadow-xs font-sans">
      
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold font-poppins text-slate-800 flex items-center gap-2">
            <IndianRupee className="w-5 h-5 text-[#1A4A7A]" />
            Fee Payments & Collections Ledger
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time transaction reconciliation across Razorpay online gateway, bank transfers, and cash counter.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by Student, Ref or Receipt..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] focus:border-transparent outline-none transition-all shadow-2xs"
            />
          </div>

          {/* Export CSV Button */}
          <button
            type="button"
            onClick={handleExportCsv}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-300"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Export CSV</span>
          </button>
          
          {/* Record Payment Button */}
          <Button 
            variant="primary"
            onClick={() => setIsRecordModalOpen(true)}
            className="flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-[1.02] transition-transform"
          >
            <Plus className="w-4 h-4" /> Record Offline Payment
          </Button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl">
          <span className="text-[10px] uppercase font-bold text-blue-700 block">Total Realized</span>
          <span className="text-xl font-black text-blue-950 font-poppins">
            ₹{totalCollectedAmount.toLocaleString()}
          </span>
        </div>
        <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl">
          <span className="text-[10px] uppercase font-bold text-emerald-700 block">Completed Transactions</span>
          <span className="text-xl font-black text-emerald-950 font-poppins">
            {payments.filter(p => p.status === 'COMPLETED').length} Transactions
          </span>
        </div>
        <div className="p-3.5 bg-purple-50/70 border border-purple-200 rounded-xl">
          <span className="text-[10px] uppercase font-bold text-purple-700 block">Online Gateway (Razorpay)</span>
          <span className="text-xl font-black text-purple-950 font-poppins">
            ₹{razorpayOnlineCollected.toLocaleString()}
          </span>
          <span className="text-[10px] text-purple-600 block mt-0.5">
            {payments.filter(p => p.paymentMethod.includes('RAZORPAY')).length} Verified Payments
          </span>
        </div>
        <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl">
          <span className="text-[10px] uppercase font-bold text-amber-700 block">Awaiting Bank Clearance</span>
          <span className="text-xl font-black text-amber-950 font-poppins">
            {payments.filter(p => p.status === 'PENDING').length} Cheques
          </span>
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 p-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold">
        <div className="flex items-center gap-1">
          <span className="text-slate-400 text-[11px] px-2 font-bold uppercase">Status:</span>
          {(['ALL', 'COMPLETED', 'PENDING'] as const).map(s => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                statusFilter === s 
                  ? 'bg-[#1A4A7A] text-white font-bold shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {s === 'ALL' ? 'All Transactions' : s}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-[11px] font-bold uppercase">Channel:</span>
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Channels</option>
            <option value="RAZORPAY_UPI">Razorpay UPI</option>
            <option value="RAZORPAY_CARD">Cards / NetBanking</option>
            <option value="CASH_COUNTER">Counter Cash</option>
            <option value="CHEQUE">Bank Cheque / DD</option>
            <option value="BANK_TRANSFER">NEFT / RTGS</option>
          </select>
        </div>
      </div>

      {/* Main Table or Empty State */}
      <div className="flex-1 overflow-hidden">
        {payments.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-2xl text-center bg-slate-50/50">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center mb-3">
              <Receipt className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No Payment Transactions in Database</h3>
            <p className="text-xs text-slate-500 max-w-md mt-1 mb-4">
              There are currently no fee payments recorded. Transactions collected at the accounts desk or online will appear here.
            </p>
            <Button 
              variant="primary" 
              onClick={() => setIsRecordModalOpen(true)}
              className="flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Record First Receipt
            </Button>
          </div>
        ) : (
          <Table<PaymentTransaction>
            data={filteredPayments}
            keyExtractor={(row) => row.id}
          columns={[
            {
              header: 'Receipt & Date',
              accessor: (row) => (
                <div>
                  <span className="font-mono font-bold text-xs text-[#1A4A7A] block">{row.receiptNo}</span>
                  <span className="text-[10px] text-slate-400">{row.date}</span>
                </div>
              )
            },
            {
              header: 'Student Info',
              accessor: (row) => (
                <div>
                  <span className="font-bold text-slate-900 text-xs block">{row.studentName}</span>
                  <span className="text-[10px] text-slate-500 font-mono">ID: {row.studentId} • {row.grade}</span>
                </div>
              )
            },
            {
              header: 'Fee Head',
              accessor: (row) => (
                <div>
                  <span className="font-semibold text-slate-800 text-xs block">{row.feeType}</span>
                  <span className="text-[10px] text-slate-400 font-mono">Ref: {row.referenceNo}</span>
                </div>
              )
            },
            {
              header: 'Amount Paid',
              accessor: (row) => (
                <span className="font-mono font-bold text-slate-900 text-sm">
                  ₹{row.amount.toLocaleString()}
                </span>
              )
            },
            {
              header: 'Payment Channel',
              accessor: (row) => {
                const isOnline = row.paymentMethod.includes('RAZORPAY');
                return (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                    isOnline ? 'bg-purple-50 text-purple-800 border border-purple-200' :
                    row.paymentMethod === 'CASH_COUNTER' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                    'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}>
                    <CreditCard className="w-3 h-3" />
                    {row.paymentMethod.replace('_', ' ')}
                  </span>
                );
              }
            },
            {
              header: 'Status',
              accessor: (row) => (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                  row.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {row.status === 'COMPLETED' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                  {row.status}
                </span>
              )
            },
            {
              header: 'Action',
              accessor: (row) => (
                <button
                  onClick={() => setSelectedReceipt(row)}
                  className="px-2.5 py-1.5 bg-blue-50 hover:bg-[#1A4A7A] text-[#1A4A7A] hover:text-white font-bold rounded-lg text-xs cursor-pointer transition-colors flex items-center gap-1 shadow-2xs"
                >
                  <Receipt className="w-3.5 h-3.5" /> View Receipt
                </button>
              )
            }
          ]}
        />
        )}
      </div>

      {/* ================= RECORD OFFLINE PAYMENT MODAL ================= */}
      {isRecordModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsRecordModalOpen(false)}
          title="Record Counter / Offline Student Payment"
        >
          <form onSubmit={handleRecordOfflineSubmit} className="space-y-4 text-xs font-sans">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Student Name & Roll/ID *</label>
              <input 
                type="text"
                required
                placeholder="e.g. Student Name (ID / Roll No)"
                value={offlineForm.studentName}
                onChange={(e) => setOfflineForm(prev => ({ ...prev, studentName: e.target.value }))}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Fee Head Component *</label>
                <select
                  value={offlineForm.feeType}
                  onChange={(e) => setOfflineForm(prev => ({ ...prev, feeType: e.target.value }))}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none"
                >
                  <option value="Tuition Fee (Quarter 2)">Tuition Fee (Quarter 2)</option>
                  <option value="Science Practical & CS Lab Fee">Science Practical & CS Lab Fee</option>
                  <option value="CBSE Board Exam Registration">CBSE Board Exam Registration</option>
                  <option value="Competitive Coaching Module">Competitive Coaching Module</option>
                  <option value="Annual Caution Money Deposit">Caution Money Deposit</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Amount Paid (₹) *</label>
                <input 
                  type="number"
                  required
                  min="1"
                  value={offlineForm.amount}
                  onChange={(e) => setOfflineForm(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none font-mono font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Payment Method *</label>
                <select
                  value={offlineForm.paymentMethod}
                  onChange={(e) => setOfflineForm(prev => ({ ...prev, paymentMethod: e.target.value as any }))}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none font-bold"
                >
                  <option value="CASH_COUNTER">Cash at Counter</option>
                  <option value="CHEQUE">Bank Cheque / DD</option>
                  <option value="BANK_TRANSFER">Bank NEFT / IMPS</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Cheque / Slip Ref No</label>
                <input 
                  type="text"
                  placeholder="e.g. CHQ-481902 / NEFT-Ref"
                  value={offlineForm.referenceNo}
                  onChange={(e) => setOfflineForm(prev => ({ ...prev, referenceNo: e.target.value }))}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Accounts Remarks</label>
              <textarea 
                rows={2}
                value={offlineForm.remarks}
                onChange={(e) => setOfflineForm(prev => ({ ...prev, remarks: e.target.value }))}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
              <Button variant="ghost" onClick={() => setIsRecordModalOpen(false)}>
                Cancel
              </Button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#1A4A7A] hover:bg-[#153860] text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4 text-emerald-400" />
                Record & Issue Receipt
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ================= VIEW RECEIPT VOUCHER MODAL ================= */}
      {selectedReceipt && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedReceipt(null)}
          title={`Official Fee Receipt: ${selectedReceipt.receiptNo}`}
        >
          <div className="space-y-5 text-xs font-sans">
            {/* Printable Receipt Paper */}
            <div className="p-6 bg-slate-50 border-2 border-slate-300 rounded-2xl space-y-4">
              
              {/* Receipt Header */}
              <div className="text-center border-b-2 border-slate-800 pb-3">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-full bg-[#1A4A7A] text-white flex items-center justify-center font-bold text-xs border border-[#F5C518]">
                    RIPS
                  </div>
                  <h3 className="text-base font-bold uppercase tracking-wider text-[#1A4A7A]">
                    Royal International Public School
                  </h3>
                </div>
                <p className="text-[10px] text-slate-500 font-mono">
                  Bursar & Accounts Division • CBSE Senior Secondary Wing
                </p>
                <div className="mt-1.5 inline-block bg-emerald-100 text-emerald-900 px-3 py-0.5 rounded-full text-[11px] font-bold border border-emerald-300">
                  OFFICIAL FEE RECEIPT VOUCHER
                </div>
              </div>

              {/* Receipt Meta */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-white p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Receipt Number</span>
                  <span className="font-mono font-bold text-slate-900">{selectedReceipt.receiptNo}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Payment Date</span>
                  <span className="font-semibold text-slate-800">{selectedReceipt.date}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Student Name</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedReceipt.studentName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Admission / Roll ID</span>
                  <span className="font-mono font-bold text-slate-800">{selectedReceipt.studentId}</span>
                </div>
              </div>

              {/* Amount Breakdown Table */}
              <table className="w-full border-collapse border border-slate-300 bg-white text-xs">
                <thead className="bg-[#1A4A7A] text-white">
                  <tr>
                    <th className="p-2 text-left">Fee Head Description</th>
                    <th className="p-2 text-right">Amount (INR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-2.5 font-medium">{selectedReceipt.feeType}</td>
                    <td className="p-2.5 text-right font-mono font-bold">₹{selectedReceipt.amount.toLocaleString()}</td>
                  </tr>
                </tbody>
                <tfoot className="bg-emerald-50 text-emerald-950 font-bold border-t-2 border-slate-400">
                  <tr>
                    <td className="p-2.5 uppercase">Total Amount Received (Paid in Full):</td>
                    <td className="p-2.5 text-right text-emerald-800 font-mono text-sm">
                      ₹{selectedReceipt.amount.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>

              {/* Footer Stamp */}
              <div className="flex items-center justify-between pt-2">
                <div className="p-2.5 border-2 border-emerald-600 rounded-xl bg-emerald-50 inline-block">
                  <span className="text-[9px] uppercase font-bold text-emerald-700 block tracking-wider">Stamp & Seal</span>
                  <span className="font-extrabold text-[11px] text-emerald-900 block">
                    ★ FEE REALIZED & VERIFIED ★
                  </span>
                </div>
                <div className="text-center">
                  <span className="font-serif italic text-blue-900 text-xs font-bold block">S. Mukherjee</span>
                  <span className="text-[9px] text-slate-500 font-bold uppercase block">Chief Accounts Officer</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-3 border-t border-slate-200">
              <div className="flex gap-2">
                <a
                  href={`/api/payments/razorpay/receipt/${selectedReceipt.receiptNo}/download-pdf`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4 text-white" />
                  Download Saved PDF
                </a>
                <button
                  type="button"
                  onClick={handlePrintReceipt}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-300"
                >
                  <Printer className="w-4 h-4 text-[#1A4A7A]" />
                  Print Receipt
                </button>
              </div>

              <Button variant="primary" onClick={() => setSelectedReceipt(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};
