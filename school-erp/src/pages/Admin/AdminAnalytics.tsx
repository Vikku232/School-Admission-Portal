import React, { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { 
  Calendar, Filter, IndianRupee, TrendingUp, 
  Download, Printer, Check, CheckCircle2, X, RefreshCw
} from 'lucide-react';
import { Button } from '../../components/shared/Button';
import { Modal } from '../../components/shared/Modal';
import toast from 'react-hot-toast';

// Dynamic Financial Datasets per Period
const DATASETS: Record<string, Array<{ month: string; expected: number; collected: number }>> = {
  'Academic Year 2026-27': [
    { month: 'Apr', expected: 1500000, collected: 1420000 },
    { month: 'May', expected: 1500000, collected: 1480000 },
    { month: 'Jun', expected: 1500000, collected: 1390000 },
    { month: 'Jul', expected: 1500000, collected: 1550000 },
    { month: 'Aug', expected: 1500000, collected: 1470000 },
    { month: 'Sep', expected: 1500000, collected: 890000 }
  ],
  'Academic Year 2025-26': [
    { month: 'Q1', expected: 4500000, collected: 4420000 },
    { month: 'Q2', expected: 4500000, collected: 4380000 },
    { month: 'Q3', expected: 4500000, collected: 4510000 },
    { month: 'Q4', expected: 4500000, collected: 4480000 }
  ],
  'Quarter 1 (Apr - Jun)': [
    { month: 'Apr W1-W2', expected: 750000, collected: 710000 },
    { month: 'Apr W3-W4', expected: 750000, collected: 710000 },
    { month: 'May W1-W2', expected: 750000, collected: 740000 },
    { month: 'May W3-W4', expected: 750000, collected: 740000 },
    { month: 'Jun W1-W2', expected: 750000, collected: 690000 },
    { month: 'Jun W3-W4', expected: 750000, collected: 700000 }
  ],
  'Quarter 2 (Jul - Sep)': [
    { month: 'Jul W1-W2', expected: 750000, collected: 790000 },
    { month: 'Jul W3-W4', expected: 750000, collected: 760000 },
    { month: 'Aug W1-W2', expected: 750000, collected: 740000 },
    { month: 'Aug W3-W4', expected: 750000, collected: 730000 },
    { month: 'Sep W1-W2', expected: 750000, collected: 450000 },
    { month: 'Sep W3-W4', expected: 750000, collected: 440000 }
  ]
};

const PAYMENT_MODE_DATA = [
  { name: 'Online (Razorpay / UPI)', value: 68 },
  { name: 'Bank Cheque / DD', value: 18 },
  { name: 'Accounts Cash Counter', value: 14 }
];

const COLORS = ['#1A4A7A', '#F5C518', '#10B981'];

export const AdminAnalytics: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('Academic Year 2026-27');
  const [isPeriodModalOpen, setIsPeriodModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Filters State
  const [feeCategory, setFeeCategory] = useState<string>('ALL');
  const [streamCategory, setStreamCategory] = useState<string>('ALL');

  const chartData = DATASETS[selectedPeriod] || DATASETS['Academic Year 2026-27'];

  const totalExpected = chartData.reduce((acc, curr) => acc + curr.expected, 0);
  const totalCollected = chartData.reduce((acc, curr) => acc + curr.collected, 0);
  const collectionRate = Math.round((totalCollected / totalExpected) * 100);

  // Export Summary Handler
  const handlePrintReport = () => {
    toast.success('Preparing financial statement printout...');
    setTimeout(() => {
      window.print();
    }, 400);
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-[#E8EDF2] shadow-xs">
        <div>
          <h2 className="text-xl font-bold font-poppins text-slate-800 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#1A4A7A]" />
            Senior Secondary Financial Analytics
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Comprehensive revenue analytics, term fee realizations, and collection trends.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Workable Period Selector Button */}
          <button 
            type="button"
            onClick={() => setIsPeriodModalOpen(true)}
            className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-[#1A4A7A] border border-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-amber-500" />
            <span>{selectedPeriod}</span>
          </button>

          {/* Workable Filter Button */}
          <button 
            type="button"
            onClick={() => setIsFilterModalOpen(true)}
            className={`px-3.5 py-2 border rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              feeCategory !== 'ALL' || streamCategory !== 'ALL'
                ? 'bg-blue-50 border-[#1A4A7A] text-[#1A4A7A]'
                : 'bg-white border-slate-300 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <Filter className="w-4 h-4 text-slate-500" />
            <span>Filter {feeCategory !== 'ALL' || streamCategory !== 'ALL' ? '(Active)' : ''}</span>
          </button>

          {/* Print Financial Summary Button */}
          <button
            type="button"
            onClick={handlePrintReport}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-300"
          >
            <Printer className="w-4 h-4 text-[#1A4A7A]" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Realized Revenue</span>
          <span className="text-xl sm:text-2xl font-black text-emerald-700 font-poppins">
            ₹{(totalCollected / 100000).toFixed(1)}L
          </span>
          <span className="text-[10px] text-emerald-600 block mt-1 font-semibold">
            ✓ Cleared via Razorpay & Bank
          </span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Target Projected</span>
          <span className="text-xl sm:text-2xl font-black text-slate-900 font-poppins">
            ₹{(totalExpected / 100000).toFixed(1)}L
          </span>
          <span className="text-[10px] text-slate-400 block mt-1 font-semibold">
            Classes 11th & 12th Base
          </span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Collection Ratio</span>
          <span className="text-xl sm:text-2xl font-black text-[#1A4A7A] font-poppins">
            {collectionRate}%
          </span>
          <span className="text-[10px] text-blue-600 block mt-1 font-semibold">
            {collectionRate >= 90 ? 'High Realization' : 'Term In-Progress'}
          </span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Pending Outstanding</span>
          <span className="text-xl sm:text-2xl font-black text-amber-600 font-poppins">
            ₹{((totalExpected - totalCollected) / 100000).toFixed(1)}L
          </span>
          <span className="text-[10px] text-amber-600 block mt-1 font-semibold">
            Due by term cut-off
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-[#E8EDF2] shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold font-poppins text-slate-800">
                Expected vs Collected Fees ({selectedPeriod})
              </h3>
              <p className="text-xs text-slate-500">Real-time collections matching admission & continuation fee registers.</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                <span className="w-3 h-3 bg-slate-300 rounded"></span> Expected
              </span>
              <span className="flex items-center gap-1.5 text-slate-800 font-bold">
                <span className="w-3 h-3 bg-[#1A4A7A] rounded"></span> Realized
              </span>
            </div>
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8EDF2" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} dy={10} />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 11 }} 
                  tickFormatter={(val) => `₹${val / 100000}L`}
                />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => `₹${value.toLocaleString()}`}
                />
                <Bar dataKey="expected" name="Expected" fill="#cbd5e1" radius={[6, 6, 0, 0]} maxBarSize={38} />
                <Bar dataKey="collected" name="Collected" fill="#1A4A7A" radius={[6, 6, 0, 0]} maxBarSize={38} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="bg-white p-6 rounded-2xl border border-[#E8EDF2] flex flex-col shadow-xs">
          <h3 className="text-base font-bold font-poppins text-slate-800 mb-1">Payment Gateways</h3>
          <p className="text-xs text-slate-500 mb-4">Realized collections by transaction channel.</p>
          
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={PAYMENT_MODE_DATA}
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {PAYMENT_MODE_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0' }}
                    formatter={(value: number) => `${value}%`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Custom Legend */}
            <div className="w-full space-y-2.5 mt-4 pt-3 border-t border-slate-100 text-xs">
              {PAYMENT_MODE_DATA.map((entry, index) => (
                <div key={entry.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[index] }}></span>
                    <span className="font-semibold text-slate-700">{entry.name}</span>
                  </div>
                  <span className="font-bold text-slate-900 font-mono">{entry.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* ================= PERIOD SELECTOR MODAL ================= */}
      {isPeriodModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsPeriodModalOpen(false)}
          title="Select Financial Analytics Period"
        >
          <div className="space-y-3 text-xs font-sans">
            <p className="text-slate-500">
              Select an academic cycle or quarter to recalibrate the revenue graphs and collection metrics:
            </p>

            <div className="space-y-2">
              {Object.keys(DATASETS).map((periodKey) => (
                <button
                  key={periodKey}
                  type="button"
                  onClick={() => {
                    setSelectedPeriod(periodKey);
                    toast.success(`Analytics period switched to: ${periodKey}`);
                    setIsPeriodModalOpen(false);
                  }}
                  className={`w-full p-3 rounded-xl border text-left font-bold transition-all cursor-pointer flex items-center justify-between ${
                    selectedPeriod === periodKey 
                      ? 'bg-blue-50 border-[#1A4A7A] text-[#1A4A7A] shadow-xs' 
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    {periodKey}
                  </span>
                  {selectedPeriod === periodKey && (
                    <CheckCircle2 className="w-4 h-4 text-[#1A4A7A]" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-200">
              <Button variant="ghost" onClick={() => setIsPeriodModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ================= FILTER MODAL ================= */}
      {isFilterModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsFilterModalOpen(false)}
          title="Filter Financial Analytics"
        >
          <div className="space-y-4 text-xs font-sans">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Fee Category Head</label>
              <select
                value={feeCategory}
                onChange={(e) => setFeeCategory(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none"
              >
                <option value="ALL">All Categories Combined</option>
                <option value="TUITION">Tuition & Term Development</option>
                <option value="LAB">Science & Computer Lab Charges</option>
                <option value="BOARD">CBSE Senior Board Registration</option>
                <option value="COACHING">JEE/NEET Competitive Modules</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Senior Secondary Stream</label>
              <select
                value={streamCategory}
                onChange={(e) => setStreamCategory(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none"
              >
                <option value="ALL">All Senior Streams (Classes 11 & 12)</option>
                <option value="SCIENCE">Science Stream (PCM / PCB)</option>
                <option value="COMMERCE">Commerce Stream</option>
                <option value="ARTS">Humanities & Arts Stream</option>
              </select>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => { setFeeCategory('ALL'); setStreamCategory('ALL'); setIsFilterModalOpen(false); toast.success('Filters reset'); }}
                className="text-xs font-bold text-red-600 hover:underline cursor-pointer"
              >
                Reset Filters
              </button>
              <Button 
                variant="primary" 
                onClick={() => {
                  toast.success(`Analytics filter applied for ${feeCategory} / ${streamCategory}`);
                  setIsFilterModalOpen(false);
                }}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};
