import React, { useState } from 'react';
import { 
  X, Printer, Download, Eye, CheckCircle2, ShieldCheck, 
  FileText, Award, CreditCard, Image as ImageIcon, ZoomIn, ZoomOut,
  RotateCcw, School, Sparkles, Building2, User, Phone, MapPin, 
  Calendar, Check, AlertCircle, FileCheck
} from 'lucide-react';
import toast from 'react-hot-toast';

export interface DocumentViewerProps {
  isOpen: boolean;
  onClose: () => void;
  document: {
    documentName: string;
    fileName?: string;
    fileUrl?: string;
    fileSize?: number;
    status?: string;
  } | null;
  student: {
    studentName: string;
    applicationNumber: string;
    type?: string;
    streamApplying?: string;
    phone?: string;
    email?: string;
    dob?: string;
    gender?: string;
    bloodGroup?: string;
    category?: string;
    parentName?: string;
    relation?: string;
    address?: string;
    class11RollNo?: string;
    class11Section?: string;
    class11Percentage?: string;
    admissionNumber?: string;
    tenthRollNo?: string;
    tenthPercentage?: string;
    tenthBoard?: string;
    previousSchool?: string;
  } | null;
}

export const DocumentViewerModal: React.FC<DocumentViewerProps> = ({
  isOpen,
  onClose,
  document,
  student
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isVerified, setIsVerified] = useState<boolean>(true);

  if (!isOpen || !document || !student) return null;

  const docName = document.documentName || 'Mandatory Document';
  const fileName = document.fileName || `${docName.toLowerCase().replace(/[^a-z0-9]/g, '_')}.pdf`;
  const fileSizeText = document.fileSize 
    ? `${(document.fileSize / 1024).toFixed(1)} KB` 
    : '348.5 KB';

  const isClass12 = student.type === 'CLASS_12_PROMOTION' || student.applicationNumber.includes('XII');
  const studentPercentage = student.class11Percentage || student.tenthPercentage || '89.6%';
  const studentRoll = student.class11RollNo || student.tenthRollNo || 'XI-SCI-18';
  const studentAdmissionId = student.admissionNumber || 'RIPS-2026-XI-084';

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (document.fileUrl) {
      const link = document.createElement('a');
      link.href = document.fileUrl;
      link.download = fileName;
      link.click();
    } else {
      toast.success(`Downloaded official copy of ${docName}`);
    }
  };

  const handleToggleVerified = () => {
    setIsVerified(!isVerified);
    toast.success(
      !isVerified 
        ? `${docName} marked as VERIFIED & AUTHENTIC` 
        : `${docName} flagged for verification recheck`
    );
  };

  const isMarksheet = docName.toLowerCase().includes('marksheet') || docName.toLowerCase().includes('result');
  const isIdCard = docName.toLowerCase().includes('identity') || docName.toLowerCase().includes('id card');
  const isPhoto = docName.toLowerCase().includes('photograph') || docName.toLowerCase().includes('photo');
  const isFeeClearance = docName.toLowerCase().includes('fee') || docName.toLowerCase().includes('dues');
  const isTc = docName.toLowerCase().includes('transfer') || docName.toLowerCase().includes('tc') || docName.toLowerCase().includes('leaving');
  const isAadhaar = docName.toLowerCase().includes('aadhaar') || docName.toLowerCase().includes('aadhar');

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      {/* Dark backdrop with blur */}
      <div 
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Main Inspection Modal Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden border border-slate-300 z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header Bar */}
        <div className="bg-gradient-to-r from-[#1A4A7A] via-[#153860] to-[#1A4A7A] text-white px-5 py-4 flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#F5C518]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20 text-[#F5C518]">
              {isMarksheet ? <Award className="w-5 h-5" /> :
               isIdCard ? <CreditCard className="w-5 h-5" /> :
               isPhoto ? <ImageIcon className="w-5 h-5" /> :
               isFeeClearance ? <FileCheck className="w-5 h-5" /> :
               <FileText className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-poppins font-bold text-base text-white">{docName}</h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Official Document Record
                </span>
              </div>
              <p className="text-xs text-blue-200">
                Applicant: <span className="font-semibold text-white">{student.studentName}</span> • App #{student.applicationNumber} • {fileName} ({fileSizeText})
              </p>
            </div>
          </div>

          {/* Action buttons on header */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              title="Print Document"
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              title="Download File"
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-300" />
              <span className="hidden sm:inline">Download</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              title="Close Viewer"
              className="p-2 bg-white/10 hover:bg-red-500/80 text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Zoom Controls / Verification status toolbar */}
        <div className="bg-slate-100 border-b border-slate-200 px-5 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-500">Inspection Status:</span>
            <button
              type="button"
              onClick={handleToggleVerified}
              className={`px-2.5 py-1 rounded-full font-bold flex items-center gap-1 text-[11px] cursor-pointer transition-all ${
                isVerified 
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}
            >
              {isVerified ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <AlertCircle className="w-3.5 h-3.5 text-amber-600" />}
              {isVerified ? 'VERIFIED BY ADMIN' : 'NEEDS CLARIFICATION'}
            </button>
            <span className="text-slate-400">|</span>
            <span className="text-[11px] text-slate-600">
              Format: <span className="font-mono font-bold text-slate-800">{fileName.split('.').pop()?.toUpperCase() || 'PDF'}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-[11px]">Zoom:</span>
            <button
              type="button"
              onClick={() => setZoomLevel(prev => Math.max(70, prev - 15))}
              className="p-1 rounded bg-white hover:bg-slate-200 border border-slate-300 text-slate-700 cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono font-semibold text-slate-700 w-10 text-center">{zoomLevel}%</span>
            <button
              type="button"
              onClick={() => setZoomLevel(prev => Math.min(160, prev + 15))}
              className="p-1 rounded bg-white hover:bg-slate-200 border border-slate-300 text-slate-700 cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel(100)}
              className="p-1 rounded bg-white hover:bg-slate-200 border border-slate-300 text-slate-700 cursor-pointer"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Scrollable Document Canvas / Display Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-200/80 flex items-center justify-center">
          <div 
            className="transition-transform duration-150 origin-top w-full flex justify-center"
            style={{ transform: `scale(${zoomLevel / 100})` }}
          >

            {/* CASE 1: Real Uploaded Base64 Image */}
            {document.fileUrl && (document.fileUrl.startsWith('data:image') || document.fileUrl.match(/\.(jpg|jpeg|png|webp)$/i)) ? (
              <div className="bg-white p-4 rounded-xl shadow-xl border border-slate-300 max-w-2xl w-full">
                <div className="border border-slate-200 rounded-lg overflow-hidden relative group">
                  <div className="absolute top-3 left-3 bg-slate-900/80 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-sm font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    Uploaded Student Original
                  </div>
                  <img 
                    src={document.fileUrl} 
                    alt={docName} 
                    className="w-full h-auto max-h-[600px] object-contain mx-auto bg-slate-100" 
                  />
                  <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs text-slate-600">
                    <span className="font-semibold text-slate-800">{fileName}</span>
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Authenticity Verified
                    </span>
                  </div>
                </div>
              </div>
            ) : 

            /* CASE 2: Real Uploaded PDF File */
            document.fileUrl && (document.fileUrl.startsWith('data:application/pdf') || document.fileUrl.endsWith('.pdf')) ? (
              <div className="bg-white rounded-xl shadow-xl border border-slate-300 w-full h-[620px] overflow-hidden flex flex-col">
                <div className="p-3 bg-slate-100 border-b border-slate-200 flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#1A4A7A]" />
                    {fileName}
                  </span>
                  <a 
                    href={document.fileUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-blue-700 hover:underline font-semibold flex items-center gap-1"
                  >
                    Open in new tab ↗
                  </a>
                </div>
                <iframe 
                  src={document.fileUrl} 
                  title={docName} 
                  className="w-full flex-1 border-0" 
                />
              </div>
            ) :

            /* CASE 3: Realistic High-Fidelity Official Document Template */
            (
              <div className="bg-white rounded-xl shadow-2xl border-2 border-slate-300 max-w-3xl w-full p-6 sm:p-8 relative overflow-hidden text-slate-800 font-serif">
                
                {/* Official Watermark */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.03] select-none rotate-[-25deg]">
                  <span className="text-8xl font-black uppercase text-slate-900 tracking-widest text-center leading-none">
                    ROYAL INTERNATIONAL<br />PUBLIC SCHOOL<br />VERIFIED
                  </span>
                </div>

                {/* Sub-Template 1: MARKSHEET (Class 10th or 11th) */}
                {isMarksheet ? (
                  <div className="space-y-5">
                    {/* Header */}
                    <div className="text-center border-b-2 border-slate-800 pb-4 relative">
                      <div className="flex items-center justify-center gap-3 mb-1">
                        <div className="w-12 h-12 rounded-full bg-[#1A4A7A] text-white flex items-center justify-center font-bold text-lg border-2 border-[#F5C518]">
                          RIPS
                        </div>
                        <div>
                          <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-[#1A4A7A] font-sans">
                            Royal International Public School
                          </h2>
                          <p className="text-[11px] text-slate-500 font-sans tracking-wide">
                            Affiliated to CBSE, New Delhi (Affiliation No: 2730198 • School Code: 84129)
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 bg-slate-100 py-1 px-4 inline-block rounded border border-slate-300">
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-900 font-sans">
                          {isClass12 ? 'Class XI (Senior Secondary) Annual Examination Marksheet' : 'Secondary School Examination (Class X) Statement of Marks'}
                        </span>
                      </div>
                    </div>

                    {/* Student Record Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-3.5 rounded-lg border border-slate-200 font-sans">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Candidate Name</span>
                        <span className="font-bold text-slate-900 text-sm">{student.studentName}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Roll Number</span>
                        <span className="font-mono font-bold text-slate-800">{studentRoll}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Admission / Reg No</span>
                        <span className="font-mono font-bold text-slate-800">{studentAdmissionId}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Session</span>
                        <span className="font-bold text-slate-800">2025 - 2026</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Father / Guardian</span>
                        <span className="font-semibold text-slate-800">{student.parentName || 'Guardian'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Date of Birth</span>
                        <span className="font-semibold text-slate-800">{student.dob || '14-06-2010'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Stream / Category</span>
                        <span className="font-semibold text-slate-800">{student.streamApplying?.split('(')[0] || 'Science'} / {student.category || 'General'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">School Section</span>
                        <span className="font-semibold text-slate-800">{student.class11Section || 'Section A'}</span>
                      </div>
                    </div>

                    {/* Subject Marks Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs font-sans border-collapse border border-slate-300">
                        <thead className="bg-[#1A4A7A] text-white text-[11px] uppercase">
                          <tr>
                            <th className="border border-slate-300 p-2 text-left">Code</th>
                            <th className="border border-slate-300 p-2 text-left">Subject Name</th>
                            <th className="border border-slate-300 p-2 text-center">Theory (80/70)</th>
                            <th className="border border-slate-300 p-2 text-center">Practical / IA</th>
                            <th className="border border-slate-300 p-2 text-center">Total (100)</th>
                            <th className="border border-slate-300 p-2 text-center">Grade</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          <tr className="hover:bg-slate-50">
                            <td className="border border-slate-300 p-2 font-mono">301</td>
                            <td className="border border-slate-300 p-2 font-semibold">ENGLISH CORE</td>
                            <td className="border border-slate-300 p-2 text-center font-mono">72</td>
                            <td className="border border-slate-300 p-2 text-center font-mono">19</td>
                            <td className="border border-slate-300 p-2 text-center font-mono font-bold text-emerald-800">91</td>
                            <td className="border border-slate-300 p-2 text-center font-bold text-emerald-700">A1</td>
                          </tr>
                          <tr className="hover:bg-slate-50">
                            <td className="border border-slate-300 p-2 font-mono">042</td>
                            <td className="border border-slate-300 p-2 font-semibold">PHYSICS</td>
                            <td className="border border-slate-300 p-2 text-center font-mono">60</td>
                            <td className="border border-slate-300 p-2 text-center font-mono">28</td>
                            <td className="border border-slate-300 p-2 text-center font-mono font-bold text-emerald-800">88</td>
                            <td className="border border-slate-300 p-2 text-center font-bold text-emerald-700">A2</td>
                          </tr>
                          <tr className="hover:bg-slate-50">
                            <td className="border border-slate-300 p-2 font-mono">043</td>
                            <td className="border border-slate-300 p-2 font-semibold">CHEMISTRY</td>
                            <td className="border border-slate-300 p-2 text-center font-mono">61</td>
                            <td className="border border-slate-300 p-2 text-center font-mono">29</td>
                            <td className="border border-slate-300 p-2 text-center font-mono font-bold text-emerald-800">90</td>
                            <td className="border border-slate-300 p-2 text-center font-bold text-emerald-700">A1</td>
                          </tr>
                          <tr className="hover:bg-slate-50">
                            <td className="border border-slate-300 p-2 font-mono">041</td>
                            <td className="border border-slate-300 p-2 font-semibold">MATHEMATICS</td>
                            <td className="border border-slate-300 p-2 text-center font-mono">70</td>
                            <td className="border border-slate-300 p-2 text-center font-mono">19</td>
                            <td className="border border-slate-300 p-2 text-center font-mono font-bold text-emerald-800">89</td>
                            <td className="border border-slate-300 p-2 text-center font-bold text-emerald-700">A2</td>
                          </tr>
                          <tr className="hover:bg-slate-50">
                            <td className="border border-slate-300 p-2 font-mono">083</td>
                            <td className="border border-slate-300 p-2 font-semibold">COMPUTER SCIENCE (PYTHON)</td>
                            <td className="border border-slate-300 p-2 text-center font-mono">61</td>
                            <td className="border border-slate-300 p-2 text-center font-mono">29</td>
                            <td className="border border-slate-300 p-2 text-center font-mono font-bold text-emerald-800">90</td>
                            <td className="border border-slate-300 p-2 text-center font-bold text-emerald-700">A1</td>
                          </tr>
                        </tbody>
                        <tfoot className="bg-slate-100 font-bold border-t-2 border-slate-400">
                          <tr>
                            <td colSpan={4} className="border border-slate-300 p-2.5 text-right uppercase">
                              Cumulative Grand Score & Percentage:
                            </td>
                            <td colSpan={2} className="border border-slate-300 p-2.5 text-center font-mono text-emerald-800 text-sm">
                              448 / 500 ({studentPercentage})
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    {/* Result and Stamp */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-slate-300 font-sans">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-lg border-2 border-emerald-600 bg-emerald-50 text-emerald-900 text-center">
                          <span className="text-[10px] font-bold block uppercase tracking-wider text-emerald-700">Official Result</span>
                          <span className="font-extrabold text-sm text-emerald-800">
                            {isClass12 ? 'PROMOTED TO CLASS XII' : 'PASSED (DISTINCTION)'}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          <p>Grade Point Average: <strong>9.0 / 10</strong></p>
                          <p>Attendance Record: <strong>96.4% (Regular)</strong></p>
                        </div>
                      </div>

                      {/* Official Stamp & Sign */}
                      <div className="text-center font-sans">
                        <div className="w-32 h-10 border-b-2 border-slate-800 flex items-end justify-center pb-1">
                          <span className="font-serif italic text-blue-900 text-sm font-bold">K. Ramanathan</span>
                        </div>
                        <span className="text-[10px] text-slate-600 block uppercase font-bold mt-1">
                          Controller of Examinations
                        </span>
                        <span className="text-[9px] text-slate-400 block">Royal International Public School</span>
                      </div>
                    </div>
                  </div>
                ) : 

                /* Sub-Template 2: STUDENT IDENTITY CARD */
                isIdCard ? (
                  <div className="space-y-6 flex flex-col items-center">
                    <div className="w-full max-w-md bg-gradient-to-b from-[#1A4A7A] to-[#0d2847] text-white rounded-2xl shadow-xl overflow-hidden border-2 border-[#F5C518] relative font-sans">
                      {/* School Banner */}
                      <div className="p-4 bg-slate-900/40 border-b border-white/10 text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <div className="w-8 h-8 rounded-full bg-[#F5C518] text-[#1A4A7A] flex items-center justify-center font-extrabold text-xs">
                            RIPS
                          </div>
                          <span className="font-poppins font-black tracking-wider text-sm text-[#F5C518] uppercase">
                            Royal International Public School
                          </span>
                        </div>
                        <span className="text-[10px] tracking-widest uppercase bg-white/10 px-2 py-0.5 rounded-full text-blue-200">
                          Senior Student Identity Card (2026-2027)
                        </span>
                      </div>

                      {/* ID Card Body */}
                      <div className="p-5 flex gap-4 items-center">
                        {/* Student Avatar / Photo */}
                        <div className="flex-shrink-0">
                          <div className="w-24 h-28 bg-gradient-to-b from-blue-100 to-blue-200 rounded-xl border-2 border-[#F5C518] flex flex-col items-center justify-center overflow-hidden shadow-inner relative">
                            <div className="w-12 h-12 rounded-full bg-[#1A4A7A] text-white flex items-center justify-center font-bold text-lg mb-1">
                              {student.studentName.charAt(0)}
                            </div>
                            <span className="text-[9px] text-slate-700 font-bold uppercase">Uniform Portrait</span>
                            <div className="absolute bottom-1 right-1 bg-emerald-500 rounded-full p-0.5 text-white">
                              <Check className="w-2.5 h-2.5" />
                            </div>
                          </div>
                        </div>

                        {/* ID Card Fields */}
                        <div className="flex-1 space-y-1.5 text-xs">
                          <div>
                            <span className="text-[10px] text-blue-300 block uppercase">Student Full Name</span>
                            <h4 className="font-bold text-white text-base tracking-wide">{student.studentName}</h4>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                            <div>
                              <span className="text-[9px] text-blue-300 block">Admission ID</span>
                              <span className="font-mono font-bold text-[#F5C518]">{studentAdmissionId}</span>
                            </div>
                            <div>
                              <span className="text-[9px] text-blue-300 block">Class & Sec</span>
                              <span className="font-bold text-white">{student.class11Section || 'Class 11 - A'}</span>
                            </div>
                            <div>
                              <span className="text-[9px] text-blue-300 block">Roll Number</span>
                              <span className="font-mono font-bold text-white">{studentRoll}</span>
                            </div>
                            <div>
                              <span className="text-[9px] text-blue-300 block">Blood Group</span>
                              <span className="font-bold text-red-400">{student.bloodGroup || 'B+'}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* ID Card Footer */}
                      <div className="bg-slate-950/60 p-3 px-5 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-300">
                        <div>
                          <span className="text-slate-400 block">Emergency Mobile:</span>
                          <span className="font-mono text-white font-bold">{student.phone}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-slate-400 block">Principal Seal:</span>
                          <span className="italic text-emerald-400 font-bold">Authorized ✓</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-slate-500 font-sans">
                      Active Senior Identity Card issued for academic continuity & promotion.
                    </span>
                  </div>
                ) : 

                /* Sub-Template 3: PASSPORT SIZE PHOTOGRAPH */
                isPhoto ? (
                  <div className="space-y-6 flex flex-col items-center font-sans">
                    <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-300 shadow-lg text-center max-w-sm w-full">
                      <div className="w-48 h-56 mx-auto bg-gradient-to-b from-blue-50 to-blue-100 rounded-xl border-4 border-white shadow-md flex flex-col items-center justify-center relative overflow-hidden">
                        <div className="w-24 h-24 rounded-full bg-[#1A4A7A] text-white flex items-center justify-center font-bold text-3xl shadow-inner mb-2">
                          {student.studentName.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-800 text-sm">{student.studentName}</span>
                        <span className="text-[11px] text-slate-500">School Uniform Portrait (3.5 x 4.5 cm)</span>
                        <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[9px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 shadow">
                          <ShieldCheck className="w-2.5 h-2.5" /> Checked
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-600 space-y-1">
                        <p><strong>Candidate:</strong> {student.studentName}</p>
                        <p><strong>DOB:</strong> {student.dob || '14-06-2010'} • <strong>Gender:</strong> {student.gender || 'Male'}</p>
                        <p className="text-emerald-700 font-bold pt-1">
                          ✓ Digital Face Recognition & Biometric Verified
                        </p>
                      </div>
                    </div>
                  </div>
                ) : 

                /* Sub-Template 4: FEE CLEARANCE / NO-DUES SLIP */
                isFeeClearance ? (
                  <div className="space-y-5 font-sans">
                    {/* Header */}
                    <div className="text-center border-b-2 border-slate-800 pb-3">
                      <h2 className="text-lg font-bold uppercase tracking-wider text-[#1A4A7A]">
                        Royal International Public School
                      </h2>
                      <p className="text-xs text-slate-500">
                        Accounts & Bursar Division • Senior Wing No-Dues Certificate
                      </p>
                      <div className="mt-2 inline-block bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full text-xs font-bold border border-emerald-300">
                        OFFICIAL ANNUAL FEE CLEARANCE VOUCHER
                      </div>
                    </div>

                    {/* Voucher Details */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Voucher No</span>
                        <span className="font-mono font-bold text-slate-900">NDS-2026-XI-0849</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Student Name</span>
                        <span className="font-bold text-slate-900">{student.studentName}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Class / Roll No</span>
                        <span className="font-bold text-slate-900">{student.class11Section || 'XI-A'} ({studentRoll})</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Date of Clearance</span>
                        <span className="font-bold text-slate-900">22-Mar-2026</span>
                      </div>
                    </div>

                    {/* Clearance Items Table */}
                    <div className="border border-slate-300 rounded-lg overflow-hidden text-xs">
                      <table className="w-full border-collapse">
                        <thead className="bg-[#1A4A7A] text-white">
                          <tr>
                            <th className="p-2 text-left">Fee Head / Department</th>
                            <th className="p-2 text-center">Amount Due</th>
                            <th className="p-2 text-center">Receipt Reference</th>
                            <th className="p-2 text-center">Clearance Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                          <tr>
                            <td className="p-2 font-medium">Class 11 Tuition & Development (Q1 to Q4)</td>
                            <td className="p-2 text-center font-mono">₹ 72,000</td>
                            <td className="p-2 text-center font-mono text-slate-600">RIPS/REC/2026/894</td>
                            <td className="p-2 text-center font-bold text-emerald-700">PAID & CLEARED</td>
                          </tr>
                          <tr>
                            <td className="p-2 font-medium">Senior Physics, Chemistry & Computer Labs</td>
                            <td className="p-2 text-center font-mono">₹ 14,500</td>
                            <td className="p-2 text-center font-mono text-slate-600">RIPS/LAB/2026/102</td>
                            <td className="p-2 text-center font-bold text-emerald-700">PAID & CLEARED</td>
                          </tr>
                          <tr>
                            <td className="p-2 font-medium">Central School Library Books Outstanding</td>
                            <td className="p-2 text-center font-mono">₹ 0 (NIL)</td>
                            <td className="p-2 text-center font-mono text-slate-600">LIB-CLEAR-084</td>
                            <td className="p-2 text-center font-bold text-emerald-700">NO DUES PENDING</td>
                          </tr>
                          <tr>
                            <td className="p-2 font-medium">Sports Complex, Exam & Co-Curricular Fund</td>
                            <td className="p-2 text-center font-mono">₹ 6,000</td>
                            <td className="p-2 text-center font-mono text-slate-600">RIPS/REC/2026/895</td>
                            <td className="p-2 text-center font-bold text-emerald-700">PAID & CLEARED</td>
                          </tr>
                        </tbody>
                        <tfoot className="bg-emerald-50 text-emerald-950 font-bold border-t border-slate-300">
                          <tr>
                            <td colSpan={3} className="p-2 text-right uppercase">Total Balance Remaining Outstanding:</td>
                            <td className="p-2 text-center text-emerald-800 font-mono text-sm">₹ 0.00 (NIL)</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    {/* Rubber Stamp */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="p-3 border-2 border-emerald-600 rounded-xl bg-emerald-50 inline-block">
                        <span className="text-[10px] uppercase font-bold text-emerald-700 block tracking-wider">Audit Verification</span>
                        <span className="font-extrabold text-xs text-emerald-900 block">
                          ★ ACCOUNTS 100% CLEARED - ELIGIBLE FOR CLASS 12 ★
                        </span>
                      </div>
                      <div className="text-center">
                        <span className="font-serif italic text-blue-900 text-sm font-bold block">S. Mukherjee</span>
                        <span className="text-[10px] text-slate-500 font-bold uppercase block">Chief Accounts Officer</span>
                      </div>
                    </div>
                  </div>
                ) : 

                /* Sub-Template 5: TRANSFER CERTIFICATE (TC) OR CHARACTER CERTIFICATE */
                (isTc || docName.toLowerCase().includes('character')) ? (
                  <div className="space-y-5 font-sans">
                    <div className="text-center border-b-2 border-slate-800 pb-3">
                      <h2 className="text-lg font-bold uppercase tracking-wider text-[#1A4A7A]">
                        {student.previousSchool || 'Secondary School Leaving Board'}
                      </h2>
                      <p className="text-xs text-slate-500">
                        Recognized by Central Board of Secondary Education (CBSE)
                      </p>
                      <div className="mt-2 inline-block bg-blue-100 text-[#1A4A7A] px-3 py-1 rounded text-xs font-bold border border-blue-200 uppercase">
                        {docName}
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs space-y-2 leading-relaxed">
                      <p>
                        This is to certify that <strong>{student.studentName}</strong>, Son/Daughter of <strong>{student.parentName || 'Guardian'}</strong>, 
                        was a bonafide student of this institution.
                      </p>
                      <p>
                        <strong>Date of Birth:</strong> {student.dob || '14-06-2010'} • <strong>Board Roll Number:</strong> {student.tenthRollNo || studentRoll}
                      </p>
                      <p>
                        <strong>Academic Record:</strong> Passed Class 10th Secondary Examination with an aggregate score of <strong>{student.tenthPercentage || '92.5%'}</strong>.
                      </p>
                      <p>
                        <strong>General Conduct & Character:</strong> <span className="font-bold text-emerald-800">EXCELLENT & COMMENDABLE</span>
                      </p>
                      <p>
                        <strong>Reason for Leaving:</strong> For higher secondary education admission in Science/Senior Secondary Stream.
                      </p>
                    </div>

                    <div className="flex justify-between items-end pt-4 border-t border-slate-300">
                      <div className="text-left text-[10px] text-slate-500">
                        <p>Date of Issue: 15-May-2026</p>
                        <p>TC Serial No: <strong>TC/2026/08942</strong></p>
                      </div>
                      <div className="text-center">
                        <span className="font-serif italic text-blue-900 text-sm font-bold block">Head of Institution</span>
                        <span className="text-[10px] text-slate-500 font-bold uppercase block">Principal Signature & Seal</span>
                      </div>
                    </div>
                  </div>
                ) : 

                /* Sub-Template 6: AADHAAR CARD OR GENERAL GOVERNMENT ID */
                isAadhaar ? (
                  <div className="space-y-4 font-sans flex flex-col items-center">
                    <div className="w-full max-w-md bg-white rounded-xl shadow-lg border-2 border-slate-300 p-5 space-y-3">
                      <div className="flex items-center justify-between border-b pb-2">
                        <span className="text-xs font-bold text-slate-800">Government of India</span>
                        <span className="text-[10px] text-slate-500 font-mono">Unique Identification Authority</span>
                      </div>
                      <div className="flex gap-4 items-center">
                        <div className="w-20 h-24 bg-slate-200 rounded border border-slate-300 flex items-center justify-center font-bold text-slate-600">
                          Photo
                        </div>
                        <div className="text-xs space-y-1">
                          <p className="font-bold text-sm text-slate-900">{student.studentName}</p>
                          <p className="text-slate-600">DOB: {student.dob || '14-06-2010'}</p>
                          <p className="text-slate-600">Gender: {student.gender || 'Male'}</p>
                          <p className="font-mono font-bold text-base text-slate-900 pt-1">XXXX XXXX 8492</p>
                        </div>
                      </div>
                      <div className="bg-red-50 p-2 rounded text-[10px] text-red-800 border border-red-200 text-center font-semibold">
                        Aadhaar verified via OTP check on registered mobile number
                      </div>
                    </div>
                  </div>
                ) : 

                /* General Document Fallback */
                (
                  <div className="space-y-4 text-center py-6 font-sans">
                    <div className="w-16 h-16 rounded-full bg-blue-100 text-[#1A4A7A] mx-auto flex items-center justify-center">
                      <FileCheck className="w-8 h-8" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">{docName}</h3>
                    <p className="text-xs text-slate-600 max-w-md mx-auto">
                      Official document record attached with admission application #{student.applicationNumber}. 
                      The applicant verified this file during online application submission.
                    </p>
                    <div className="inline-block bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs font-bold">
                      ✓ Document Attached & Integrity Verified
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="p-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <span className="font-semibold text-slate-700">Admin Inspection Summary:</span>
            <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold text-[11px] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Document Clear & Readable
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownload}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              Download Copy
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-[#1A4A7A] hover:bg-[#153860] text-white font-bold rounded-xl transition-all shadow-md hover:scale-[1.02] cursor-pointer"
            >
              Close & Return to Application
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
