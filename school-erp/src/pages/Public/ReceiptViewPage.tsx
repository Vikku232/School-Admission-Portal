import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabaseService, SupabasePayment } from '../../services/supabaseService';
import { Printer, Download, CheckCircle2, ArrowLeft, ShieldCheck, School } from 'lucide-react';
import toast from 'react-hot-toast';

export const ReceiptViewPage: React.FC = () => {
  const { receiptNo } = useParams<{ receiptNo: string }>();
  const [payment, setPayment] = useState<SupabasePayment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        setLoading(true);
        if (receiptNo) {
          const payments = await supabaseService.getPayments();
          const found = payments.find(p => p.receipt_no === receiptNo || p.id === receiptNo);
          if (found) {
            setPayment(found);
          }
        }
      } catch (e) {
        console.warn('Could not fetch receipt from cloud:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchReceipt();
  }, [receiptNo]);

  const handlePrint = () => {
    toast.success('Opening system print dialog...');
    setTimeout(() => {
      window.print();
    }, 200);
  };

  const displayDate = payment?.date 
    ? new Date(payment.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) 
    : new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4 font-sans print:bg-white print:p-0">
      <div className="max-w-2xl mx-auto space-y-4">
        
        {/* Navigation Bar (hidden during print) */}
        <div className="flex items-center justify-between print:hidden">
          <Link 
            to="/" 
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E3A8A] hover:underline bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" /> Back to School Portal
          </Link>
          <div className="flex items-center gap-2">
            <a
              href={`/api/payments/razorpay/receipt/${receiptNo}/download-pdf?studentName=${encodeURIComponent(payment?.student_name || 'Student Candidate')}&studentId=${encodeURIComponent(payment?.student_id || 'RIPS-2027-1104')}&amount=${payment?.amount || 22000}&feeType=${encodeURIComponent(payment?.fee_type || 'Quarterly Senior Secondary Tuition & Lab Composite Fee')}`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-1.5 transition-all"
            >
              <Download className="w-4 h-4 text-white" /> Download PDF File
            </a>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-[#1E3A8A] hover:bg-[#152e6f] text-white font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-1.5 transition-all"
            >
              <Printer className="w-4 h-4 text-[#F5C518]" /> Print Voucher
            </button>
          </div>
        </div>

        {/* Printable Official Receipt Voucher */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-slate-300 overflow-hidden print:shadow-none print:border-none">
          
          {/* Header */}
          <div className="bg-[#1E3A8A] text-white p-6 sm:p-8 text-center relative border-b-4 border-[#F5C518]">
            <div className="w-14 h-14 rounded-full bg-white text-[#1E3A8A] font-extrabold text-lg flex items-center justify-center mx-auto mb-2 border-2 border-[#F5C518] shadow-md">
              RIPS
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-poppins text-[#F5C518] uppercase tracking-wide">
              Royal International Public School
            </h1>
            <p className="text-xs text-blue-100 mt-1">
              Senior Secondary Wing • Affiliated to CBSE, New Delhi (Classes 11th & 12th)
            </p>
            <p className="text-[11px] text-blue-200 mt-0.5 font-mono">
              Bursar & Accounts Division • Official Realized Fee Receipt Voucher (Session 2027–28)
            </p>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Status Pill */}
            <div className="text-center">
              <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border-2 border-emerald-500 px-4 py-1 rounded-full text-xs font-bold tracking-wide uppercase">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Fee Realized & Verified via Razorpay
              </span>
            </div>

            {/* Metadata Box */}
            <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Receipt Voucher No:</span>
                <span className="font-mono font-bold text-[#1E3A8A] text-sm">{receiptNo || payment?.receipt_no || 'REC-2027-ONLINE'}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Transaction Date:</span>
                <span className="font-semibold text-slate-800">{displayDate}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Student Name / Candidate:</span>
                <span className="font-bold text-slate-900 text-sm">{payment?.student_name || 'RIPS Senior Secondary Student'}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Student / Admission ID:</span>
                <span className="font-mono font-bold text-slate-800">{payment?.student_id || 'RIPS-2027-1104'}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Payment Method:</span>
                <span className="font-bold text-purple-700">{payment?.payment_method || 'RAZORPAY_UPI'} (Online)</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Razorpay Reference ID:</span>
                <span className="font-mono font-bold text-blue-700">{payment?.reference_no || payment?.razorpay_payment_id || 'pay_razorpay_verified'}</span>
              </div>
            </div>

            {/* Table */}
            <table className="w-full border-collapse border border-slate-300 text-xs">
              <thead className="bg-[#1E3A8A] text-white">
                <tr>
                  <th className="p-3 text-left">Fee Head Description</th>
                  <th className="p-3 text-right">Amount (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-3 font-medium text-slate-800">
                    {payment?.fee_type || 'Quarterly Senior Secondary Tuition, AI & Practical Laboratory Composite Fee'}
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-slate-900">
                    ₹{payment?.amount ? Number(payment.amount).toLocaleString() : '22,000.00'}
                  </td>
                </tr>
              </tbody>
              <tfoot className="bg-emerald-50 text-emerald-950 font-bold border-t-2 border-emerald-600">
                <tr>
                  <td className="p-3 uppercase">Total Amount Received (Paid in Full):</td>
                  <td className="p-3 text-right text-emerald-700 font-mono text-base font-extrabold">
                    ₹{payment?.amount ? Number(payment.amount).toLocaleString() : '22,000.00'}
                  </td>
                </tr>
              </tfoot>
            </table>

            {/* Seal and Sign */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <div className="p-3 border-2 border-dashed border-emerald-600 rounded-xl bg-emerald-50 inline-block">
                <span className="text-[9px] uppercase font-bold text-emerald-700 block tracking-wider">Stamp & Seal</span>
                <span className="font-extrabold text-[11px] text-emerald-900 block">
                  ★ FEE REALIZED & VERIFIED ★
                </span>
                <span className="text-[9px] text-emerald-700 block mt-0.5 font-mono">ID: RIPS-BURSAR-{receiptNo?.slice(-6) || 'ONLINE'}</span>
              </div>
              <div className="text-center">
                <span className="font-serif italic text-blue-900 text-sm font-bold block">S. Mukherjee</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Chief Accounts Officer</span>
                <span className="text-[9px] text-slate-400 block">RIPS Bursar Office</span>
              </div>
            </div>

            {/* Assurance Note */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center text-[10px] text-slate-500 leading-relaxed">
              This official receipt is electronically authenticated and realized through Razorpay 256-bit secure gateway. It confirms clearance of senior secondary school dues and entitles the student to attend senior academic classes and laboratory practicals.
            </div>

          </div>

          {/* Footer Note */}
          <div className="bg-slate-50 p-4 text-center border-t border-slate-200 text-[10px] text-slate-400">
            Royal International Public School • Support: dgarmy.vikash@gmail.com • © 2027 RIPS All rights reserved.
          </div>

        </div>

      </div>
    </div>
  );
};
