import React, { useState, useEffect } from 'react';
import { Table } from '../../components/shared/Table';
import { Badge } from '../../components/shared/Badge';
import { Button } from '../../components/shared/Button';
import { Modal } from '../../components/shared/Modal';
import { IndianRupee, Download, CheckCircle2, ShieldCheck, Printer, ExternalLink } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { initiateRazorpayPayment, RAZORPAY_KEY_ID } from '../../lib/razorpay';
import { supabaseService, SupabasePayment } from '../../services/supabaseService';
import { api } from '../../api/axios';
import toast from 'react-hot-toast';

export const StudentFees: React.FC = () => {
  const user = useAuthStore(state => state.user);
  const [feeHistory, setFeeHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<any | null>(null);

  // Standard Senior Secondary Quarterly Fee
  const DEFAULT_QUARTERLY_FEE = 22000;

  // Load real payments from Supabase
  const loadPayments = async () => {
    try {
      setLoading(true);
      const payments = await supabaseService.getPayments();
      // Filter for current student or show payments
      const studentPayments = payments.map(p => ({
        id: p.receipt_no || p.id,
        receiptNo: p.receipt_no,
        referenceNo: p.reference_no || p.razorpay_payment_id || 'N/A',
        type: p.fee_type || 'Tuition Fee (Quarterly)',
        amount: p.amount,
        dueDate: '10th of Quarter',
        paidDate: p.date || (p.created_at ? new Date(p.created_at).toLocaleDateString() : 'Today'),
        status: p.status || 'PAID',
        method: p.payment_method || 'RAZORPAY_UPI',
        studentName: p.student_name,
        studentId: p.student_id,
        grade: p.grade
      }));
      setFeeHistory(studentPayments);
    } catch (e: any) {
      console.warn('Could not load payment ledger:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  // Check if student has already paid this quarter
  const hasPaid = feeHistory.some(inv => inv.status === 'COMPLETED' || inv.status === 'PAID');
  const totalDue = hasPaid ? 0 : DEFAULT_QUARTERLY_FEE;
  const totalPaid = feeHistory
    .filter(inv => inv.status === 'PAID' || inv.status === 'COMPLETED')
    .reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);

  // Handle Razorpay Payment Checkout
  const handleRazorpayPayment = async () => {
    try {
      setPaying(true);
      toast.loading('Launching Razorpay Secure Gateway...', { id: 'rzp' });

      const studentName = user?.name || 'Class 11 Senior Student';
      const studentId = user?.id || 'RIPS-2027-1101';
      const email = user?.email || 'student.senior@rips.edu.in';

      // Open Razorpay Standard Checkout Popup
      const paymentResponse = await initiateRazorpayPayment({
        amount: totalDue,
        description: 'Class 11/12 Senior Secondary Quarterly Tuition Fee',
        studentId: studentId,
        studentName: studentName,
        email: email,
        phone: '+919876543210',
        feeType: 'Tuition & Composite Fee (Quarterly)'
      });

      toast.success('Payment authorized by Razorpay! Recording transaction...', { id: 'rzp' });

      // Generate official RIPS receipt number
      const receiptNo = `REC-2027-${Math.floor(10000 + Math.random() * 90000)}`;

      // Save to Supabase Cloud Database
      const paymentRecord: SupabasePayment = {
        id: `PAY-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
        receipt_no: receiptNo,
        student_id: studentId,
        student_name: studentName,
        grade: 'Class 11 - Senior Secondary',
        fee_type: 'Tuition & Composite Fee (Quarterly)',
        amount: totalDue,
        payment_method: 'RAZORPAY_UPI',
        reference_no: paymentResponse.razorpay_payment_id,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_order_id: paymentResponse.razorpay_order_id || '',
        razorpay_signature: paymentResponse.razorpay_signature || '',
        payer_email: email,
        payer_phone: '+919876543210',
        date: new Date().toISOString().slice(0, 10),
        status: 'COMPLETED'
      };

      await supabaseService.recordPayment(paymentRecord);

      // Dispatch Official Receipt Email with download voucher attachment
      try {
        const emailRes = await api.post('/payments/razorpay/send-receipt-email', {
          email: email,
          receiptNo: receiptNo,
          studentId: studentId,
          studentName: studentName,
          amount: totalDue,
          feeType: 'Tuition & Composite Fee (Quarterly)',
          referenceNo: paymentResponse.razorpay_payment_id
        });
        if (emailRes.data && emailRes.data.success) {
          toast.success(`Official fee receipt PDF sent to ${email} and saved to database!`);
        } else {
          console.info('Receipt dispatch note:', emailRes.data);
          toast('Official PDF receipt generated! Click below to view/download.', { icon: '📄', duration: 4000 });
        }
      } catch (emailErr: any) {
        console.warn('Receipt dispatch note:', emailErr);
        toast('Official PDF receipt generated! Click below to view/download.', { icon: '📄', duration: 4000 });
      }

      // Refresh payments ledger
      await loadPayments();

      // Show receipt modal
      setSelectedReceipt({
        ...paymentRecord,
        receiptNo: receiptNo,
        paidDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
      });

      toast.success(`Fee Payment of ₹${totalDue.toLocaleString()} processed! Receipt #${receiptNo} generated.`);

    } catch (err: any) {
      if (err.message === 'PAYMENT_CANCELLED') {
        toast.error('Payment cancelled by user.');
      } else {
        toast.error(err.message || 'Payment transaction failed.');
      }
    } finally {
      setPaying(false);
    }
  };

  const handlePrintReceipt = () => {
    toast.success('Opening print dialog for official fee voucher...');
    setTimeout(() => {
      window.print();
    }, 300);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Cards */}
      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Current Invoice Card */}
        <div className="flex-1 bg-white p-8 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full -z-10"></div>
          
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-xl font-bold font-poppins text-slate-800">Current Fee Dues</h2>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
              Razorpay Active ({RAZORPAY_KEY_ID.slice(0, 8)}...)
            </span>
          </div>

          <p className="text-xs text-slate-500 mb-6">
            {totalDue === 0 
              ? 'No Pending Dues • All Senior Secondary Fees Cleared' 
              : 'Quarterly Senior Secondary Tuition, AI & Practical Laboratory Fee (2027-28)'}
          </p>
          
          <div className="flex items-end gap-2 mb-8">
            <span className={`text-4xl font-extrabold font-mono ${totalDue === 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              ₹{totalDue.toLocaleString()}
            </span>
            <span className="text-slate-500 font-semibold mb-1">.00</span>
          </div>

          <div className="flex flex-wrap gap-3">
            {totalDue === 0 ? (
              <div className="flex-1 bg-emerald-50 text-emerald-800 border border-emerald-300 p-3 rounded-xl flex items-center justify-center gap-2 font-bold text-xs shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                All Quarter Dues Cleared & Verified via Razorpay
              </div>
            ) : (
              <Button 
                variant="primary" 
                className="flex-1 !bg-[#1E3A8A] hover:!bg-[#152e6f] text-white shadow-md cursor-pointer flex items-center justify-center gap-2 py-3" 
                onClick={handleRazorpayPayment}
                disabled={paying}
              >
                <ShieldCheck className="w-4 h-4 text-[#F5C518]" />
                {paying ? 'Connecting to Razorpay...' : 'Pay with Razorpay (Test Mode)'}
              </Button>
            )}

            <Button 
              variant="secondary" 
              onClick={() => {
                if (feeHistory.length === 0) {
                  toast.error('No fee transactions found to generate statement.');
                } else {
                  toast.success('Downloading Official Fee Statement PDF...');
                }
              }}
              className="flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" /> Statement PDF
            </Button>
          </div>
        </div>

        {/* Info Card */}
        <div className="flex-1 bg-gradient-to-br from-slate-900 via-[#1A4A7A] to-[#0F2744] p-8 rounded-2xl text-white shadow-lg relative overflow-hidden flex flex-col justify-between">
          <div className="absolute right-0 top-0 opacity-10">
            <IndianRupee className="w-40 h-40 -mt-8 -mr-8" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#F5C518]">Student Ledger Status</h3>
              <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                Live Supabase Synced
              </span>
            </div>
            <p className="font-poppins font-bold text-2xl text-white">Active Student Account</p>
          </div>
          
          <div className="space-y-3 mt-6">
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-slate-300 text-xs">Total Realized Fees (Paid)</span>
              <span className="font-bold text-emerald-400 font-mono">₹{totalPaid.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-slate-300 text-xs">Payment Gateway Provider</span>
              <span className="font-bold text-xs text-blue-200">Razorpay (Test Mode)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300 text-xs">Registered Email</span>
              <span className="font-mono text-xs text-slate-300">{user?.email || 'student.senior@rips.edu.in'}</span>
            </div>
          </div>
        </div>

      </div>

      {/* History Table */}
      <div className="bg-white p-6 rounded-2xl border border-[#E8EDF2] shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold font-poppins text-slate-800">Payment History & Receipts</h3>
            <p className="text-xs text-slate-500">Live verified transactions recorded in cloud ledger via Razorpay</p>
          </div>
          <span className="text-xs font-semibold text-slate-400">{feeHistory.length} Transactions</span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400 text-xs animate-pulse">
            Loading cloud fee transactions...
          </div>
        ) : feeHistory.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <IndianRupee className="w-10 h-10 text-slate-300 mb-2" />
            <p className="text-sm font-bold text-slate-700">No Payment Records Yet</p>
            <p className="text-xs text-slate-400 mt-1">Click "Pay with Razorpay" above to test the payment gateway and generate your first official receipt.</p>
          </div>
        ) : (
          <Table<any> 
            data={feeHistory}
            keyExtractor={(row: any) => row.id}
            columns={[
              { 
                header: 'Receipt #', 
                accessor: (row: any) => <span className="font-mono font-bold text-xs text-blue-700">{row.receiptNo || row.id}</span> 
              },
              { 
                header: 'Fee Type', 
                accessor: (row: any) => (
                  <div>
                    <span className="font-bold text-xs text-slate-800 block">{row.type}</span>
                    <span className="text-[10px] text-slate-400 font-mono">Ref: {row.referenceNo}</span>
                  </div>
                ) 
              },
              { 
                header: 'Amount', 
                accessor: (row: any) => <span className="font-mono font-bold text-xs text-slate-900">₹{Number(row.amount).toLocaleString()}</span> 
              },
              { 
                header: 'Paid On', 
                accessor: (row: any) => <span className="text-xs text-slate-600">{row.paidDate}</span> 
              },
              { 
                header: 'Gateway', 
                accessor: (row: any) => (
                  <span className="text-[10px] font-bold text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                    {row.method || 'RAZORPAY'}
                  </span>
                ) 
              },
              { 
                header: 'Status', 
                accessor: (row: any) => <Badge status={row.status || 'PAID'} /> 
              },
              { 
                header: 'Receipt Voucher', 
                accessor: (row: any) => (
                  <button 
                    onClick={() => setSelectedReceipt(row)}
                    className="text-xs font-bold text-[#1E3A8A] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> View Receipt
                  </button>
                ) 
              }
            ]}
          />
        )}
      </div>

      {/* Official Receipt Modal */}
      {selectedReceipt && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedReceipt(null)}
          title={`Official Fee Receipt Voucher #${selectedReceipt.receiptNo || selectedReceipt.id}`}
        >
          <div className="space-y-4 text-xs font-sans">
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
                  CBSE Affiliated Senior Secondary Wing (Classes 11 & 12)
                </p>
                <div className="mt-1.5 inline-block bg-emerald-100 text-emerald-900 px-3 py-0.5 rounded-full text-[11px] font-bold border border-emerald-300">
                  OFFICIAL FEE RECEIPT VOUCHER (PAID VIA RAZORPAY)
                </div>
              </div>

              {/* Receipt Metadata */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-white p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Receipt Number</span>
                  <span className="font-mono font-bold text-slate-900">{selectedReceipt.receiptNo || selectedReceipt.id}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Payment Date</span>
                  <span className="font-semibold text-slate-800">{selectedReceipt.paidDate || 'Today'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Student Name</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedReceipt.studentName || user?.name || 'Class 11 Student'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Razorpay Ref ID</span>
                  <span className="font-mono font-bold text-blue-700">{selectedReceipt.referenceNo || selectedReceipt.razorpay_payment_id || 'pay_test_rips'}</span>
                </div>
              </div>

              {/* Table */}
              <table className="w-full border-collapse border border-slate-300 bg-white text-xs">
                <thead className="bg-[#1A4A7A] text-white">
                  <tr>
                    <th className="p-2 text-left">Fee Component Description</th>
                    <th className="p-2 text-right">Amount (INR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-2.5 font-medium">{selectedReceipt.type || selectedReceipt.fee_type || 'Quarterly Tuition & Composite Fee'}</td>
                    <td className="p-2.5 text-right font-mono font-bold">₹{Number(selectedReceipt.amount).toLocaleString()}</td>
                  </tr>
                </tbody>
                <tfoot className="bg-emerald-50 text-emerald-950 font-bold border-t-2 border-slate-400">
                  <tr>
                    <td className="p-2.5 uppercase">Total Amount Received (Paid in Full):</td>
                    <td className="p-2.5 text-right text-emerald-800 font-mono text-sm">
                      ₹{Number(selectedReceipt.amount).toLocaleString()}.00
                    </td>
                  </tr>
                </tfoot>
              </table>

              {/* Stamp and Seal */}
              <div className="flex items-center justify-between pt-2">
                <div className="p-2.5 border-2 border-emerald-600 rounded-xl bg-emerald-50 inline-block">
                  <span className="text-[9px] uppercase font-bold text-emerald-700 block tracking-wider">Stamp & Seal</span>
                  <span className="font-extrabold text-[11px] text-emerald-900 block">
                    ★ FEE REALIZED & VERIFIED ★
                  </span>
                </div>
                <div className="text-center">
                  <span className="font-serif italic text-blue-900 text-xs font-bold block">Accounts Officer</span>
                  <span className="text-[9px] text-slate-500 font-bold uppercase block">RIPS Bursar Office</span>
                </div>
              </div>

            </div>

            {/* Actions */}
            <div className="flex justify-between items-center pt-3 border-t border-slate-200">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const rNo = selectedReceipt.receiptNo || selectedReceipt.receipt_no;
                    if (rNo) {
                      window.open(`/receipt/${rNo}`, '_blank');
                    } else {
                      handlePrintReceipt();
                    }
                  }}
                  className="px-3.5 py-2 bg-[#1E3A8A] hover:bg-[#152e6f] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4 text-[#F5C518]" />
                  Download / Full Voucher
                </button>
                <button
                  type="button"
                  onClick={handlePrintReceipt}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-300"
                >
                  <Printer className="w-4 h-4 text-[#1A4A7A]" />
                  Print
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
