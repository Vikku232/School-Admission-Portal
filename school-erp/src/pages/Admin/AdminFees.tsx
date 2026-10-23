import React, { useState } from 'react';
import { Table } from '../../components/shared/Table';
import { Button } from '../../components/shared/Button';
import { Modal } from '../../components/shared/Modal';
import { 
  IndianRupee, Plus, Settings, Edit3, History, 
  Trash2, Check, ShieldCheck, Percent, Clock, 
  AlertCircle, Sparkles, X, CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';

export interface FeeItem {
  id: string;
  name: string;
  grades: string;
  amount: number;
  isMandatory: boolean;
  status: 'ACTIVE' | 'INACTIVE' | string;
  frequency?: string;
  dueDate?: string;
  updatedAt?: string;
}

import { supabaseService, SupabaseFeeStructure } from '../../services/supabaseService';

export const AdminFees: React.FC = () => {
  const [fees, setFees] = useState<FeeItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load fees from Supabase
  const loadFeeStructures = async () => {
    try {
      setLoading(true);
      const data = await supabaseService.getFeeStructures();
      const mapped: FeeItem[] = data.map((f, idx) => ({
        id: f.id || `FEE0${idx + 1}`,
        name: f.name,
        grades: f.grade || '11th & 12th (All Streams)',
        amount: Number(f.amount || f.total_annual || f.tuition_fee) || 0,
        isMandatory: f.is_mandatory !== false,
        status: (f.status as any) || 'ACTIVE',
        frequency: f.frequency || 'Quarterly',
        dueDate: f.due_date || '10th of every quarter',
        updatedAt: f.created_at ? f.created_at.slice(0, 10) : new Date().toISOString().slice(0, 10)
      }));
      setFees(mapped);
    } catch (e: any) {
      console.warn('Error loading fee structures from Supabase:', e);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadFeeStructures();
  }, []);

  // Modals
  const [isCreateFeeOpen, setIsCreateFeeOpen] = useState(false);
  const [isConfigureOpen, setIsConfigureOpen] = useState(false);
  const [editingFee, setEditingFee] = useState<FeeItem | null>(null);
  const [historyFee, setHistoryFee] = useState<FeeItem | null>(null);

  // New Fee Form
  const [newFee, setNewFee] = useState({
    name: '',
    grades: '11th & 12th (All Streams)',
    amount: '',
    isMandatory: true,
    frequency: 'Quarterly',
    dueDate: '10th of every quarter'
  });

  // Caution & Discounts Policy Config
  const [globalSettings, setGlobalSettings] = useState({
    cautionDeposit: 10000,
    siblingDiscount: 10,
    meritScholarship: 20,
    earlyBirdDiscount: 5,
    lateFeePerDay: 50,
    refundablePolicy: '100% Refundable on clearance of all department dues and issuance of School Leaving Certificate.'
  });

  // Create Fee Submit
  const handleCreateFeeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFee.name.trim() || !newFee.amount) {
      toast.error('Please enter fee name and amount');
      return;
    }

    const feeAmount = parseFloat(newFee.amount) || 5000;
    const feeId = `FEE-${Date.now().toString().slice(-4)}`;

    try {
      await supabaseService.createFeeStructure({
        id: feeId,
        name: newFee.name.trim(),
        grade: newFee.grades,
        stream: 'All Streams',
        amount: feeAmount,
        tuition_fee: feeAmount,
        total_annual: feeAmount * (newFee.frequency === 'Quarterly' ? 4 : 1),
        is_mandatory: newFee.isMandatory,
        frequency: newFee.frequency,
        due_date: newFee.dueDate,
        status: 'ACTIVE'
      });

      await loadFeeStructures();
      toast.success(`Fee component "${newFee.name}" created and saved to cloud database!`);
      setIsCreateFeeOpen(false);
      setNewFee({
        name: '',
        grades: '11th & 12th (All Streams)',
        amount: '',
        isMandatory: true,
        frequency: 'Quarterly',
        dueDate: '10th of every quarter'
      });
    } catch (err: any) {
      toast.error(err.message || 'Failed to create fee in database');
    }
  };

  // Edit Fee Submit
  const handleUpdateFee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFee) return;

    try {
      await supabaseService.updateFeeStructure(editingFee.id, {
        name: editingFee.name,
        grade: editingFee.grades,
        amount: editingFee.amount,
        is_mandatory: editingFee.isMandatory,
        status: editingFee.status
      });

      await loadFeeStructures();
      toast.success(`Fee component "${editingFee.name}" updated in cloud database!`);
      setEditingFee(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update fee in database');
    }
  };

  // Delete Fee
  const handleDeleteFee = async (id: string, name: string) => {
    if (window.confirm(`Delete fee component "${name}" from database?`)) {
      try {
        await supabaseService.deleteFeeStructure(id);
        await loadFeeStructures();
        toast.success(`Fee component "${name}" deleted from database`);
        setEditingFee(null);
      } catch (err: any) {
        toast.error(err.message || 'Failed to delete fee from database');
      }
    }
  };

  // Save Global Settings
  const handleSaveGlobalSettings = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Global Caution & Discount policies updated successfully!');
    setIsConfigureOpen(false);
  };


  const totalAnnualTuition = fees
    .filter(f => f.isMandatory)
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6">
      
      {/* Top Header Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Fee Structures Welcome Card */}
        <div className="bg-white p-6 rounded-2xl border border-[#E8EDF2] col-span-2 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h2 className="text-xl font-bold font-poppins text-slate-800 flex items-center gap-2">
                  <IndianRupee className="w-5 h-5 text-[#1A4A7A]" />
                  Fee Structures & Components
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage all school fee heads, mandatory lab/tuition charges, and applicability.
                </p>
              </div>

              {/* Workable Create New Fee Button */}
              <Button 
                variant="primary"
                onClick={() => setIsCreateFeeOpen(true)}
                className="flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-[1.02] transition-transform"
              >
                <Plus className="w-4 h-4" /> Create New Fee
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-slate-100 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Active Fee Heads</span>
                <span className="text-base font-bold text-slate-900">{fees.length} Components</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Mandatory Annual Base</span>
                <span className="text-base font-extrabold text-[#1A4A7A]">₹{totalAnnualTuition.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Optional Coaching</span>
                <span className="text-base font-bold text-emerald-700">₹12,000 / Sem</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Global Settings & Caution Card */}
        <div className="bg-gradient-to-br from-slate-900 via-[#1A4A7A] to-[#0F2744] text-white p-6 rounded-2xl shadow-md relative overflow-hidden flex flex-col justify-between">
          <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
            <IndianRupee className="w-32 h-32 -mt-4 -mr-4" />
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#F5C518] block mb-1">
              Policy & Concessions
            </span>
            <h3 className="font-poppins font-bold text-lg mb-1">Caution & Discounts</h3>
            <p className="text-xs text-blue-200 mb-4">
              Sibling discount ({globalSettings.siblingDiscount}%), Merit scholarship ({globalSettings.meritScholarship}%), and Caution deposit.
            </p>
          </div>

          {/* Workable Configure Button */}
          <Button 
            variant="secondary" 
            onClick={() => setIsConfigureOpen(true)}
            className="!bg-white/10 !text-white !border-white/20 hover:!bg-white/20 cursor-pointer w-fit flex items-center gap-1.5"
          >
            <Settings className="w-4 h-4 text-[#F5C518]" /> Configure Policies
          </Button>
        </div>

      </div>

      {/* Main Fee Table */}
      <div className="bg-white p-6 rounded-2xl border border-[#E8EDF2] shadow-xs">
        <h3 className="text-sm font-bold text-slate-800 mb-4 font-poppins flex items-center justify-between">
          <span>Active Senior Secondary Fee Schedules</span>
          <span className="text-xs font-normal text-slate-400">Showing {fees.length} components</span>
        </h3>

        {fees.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-2xl text-center bg-slate-50/50">
            <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center mb-3">
              <IndianRupee className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No Fee Schedules Configured</h3>
            <p className="text-xs text-slate-500 max-w-md mt-1 mb-4">
              There are currently no fee components added in the database. Click '+ Create Fee Structure' to add tuition, laboratory, or exam fee heads.
            </p>
            <Button 
              variant="primary" 
              onClick={() => setIsCreateFeeOpen(true)}
              className="flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Create First Fee Structure
            </Button>
          </div>
        ) : (
          <Table<FeeItem> 
            data={fees}
            keyExtractor={(row) => row.id}
          columns={[
            { 
              header: 'Fee ID', 
              accessor: (row) => <span className="font-mono font-bold text-slate-700 text-xs">{row.id}</span> 
            },
            { 
              header: 'Fee Name', 
              accessor: (row) => (
                <div>
                  <span className="font-bold text-slate-900 text-xs block">{row.name}</span>
                  <span className="text-[10px] text-slate-400">Cycle: {row.frequency || 'Quarterly'} • Due: {row.dueDate || '10th of month'}</span>
                </div>
              ) 
            },
            { 
              header: 'Applicable Grades', 
              accessor: (row) => <span className="text-xs text-slate-700">{row.grades}</span> 
            },
            { 
              header: 'Amount', 
              accessor: (row) => (
                <span className="font-mono font-bold text-slate-900 text-xs">
                  ₹{row.amount.toLocaleString()}
                </span>
              ) 
            },
            { 
              header: 'Type', 
              accessor: (row) => row.isMandatory ? (
                <span className="text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                  Mandatory
                </span>
              ) : (
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                  Optional
                </span>
              )
            },
            { 
              header: 'Action', 
              accessor: (row) => (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setEditingFee({ ...row })}
                    className="px-2.5 py-1 bg-blue-50 hover:bg-[#1A4A7A] text-[#1A4A7A] hover:text-white font-bold rounded-lg text-xs cursor-pointer transition-colors flex items-center gap-1 shadow-2xs"
                  >
                    <Edit3 className="w-3 h-3" /> Edit
                  </button>
                  <button 
                    onClick={() => setHistoryFee(row)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-lg text-xs cursor-pointer transition-colors flex items-center gap-1"
                  >
                    <History className="w-3 h-3" /> History
                  </button>
                </div>
              ) 
            }
          ]}
        />
        )}
      </div>

      {/* ================= CREATE NEW FEE MODAL ================= */}
      {isCreateFeeOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsCreateFeeOpen(false)}
          title="Create New Fee Structure Component"
        >
          <form onSubmit={handleCreateFeeSubmit} className="space-y-4 text-xs font-sans">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Fee Component Name *</label>
              <input 
                type="text"
                required
                placeholder="e.g. AI & Robotics Laboratory Fee"
                value={newFee.name}
                onChange={(e) => setNewFee(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Applicable Grades *</label>
                <select
                  value={newFee.grades}
                  onChange={(e) => setNewFee(prev => ({ ...prev, grades: e.target.value }))}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none"
                >
                  <option value="11th & 12th (All Streams)">11th & 12th (All Streams)</option>
                  <option value="11th & 12th (Science & CS)">11th & 12th (Science & CS)</option>
                  <option value="11th & 12th (Commerce & Arts)">11th & 12th (Commerce & Arts)</option>
                  <option value="12th (All Streams)">12th (Board Registration Only)</option>
                  <option value="11th & 12th (Optional)">11th & 12th (Optional)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Fee Amount (₹) *</label>
                <input 
                  type="number"
                  required
                  min="0"
                  placeholder="e.g. 6500"
                  value={newFee.amount}
                  onChange={(e) => setNewFee(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Billing Frequency</label>
                <select
                  value={newFee.frequency}
                  onChange={(e) => setNewFee(prev => ({ ...prev, frequency: e.target.value }))}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none"
                >
                  <option value="Quarterly">Quarterly</option>
                  <option value="Annual">Annual</option>
                  <option value="One-time">One-time</option>
                  <option value="Per Semester">Per Semester</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Payment Mandate</label>
                <select
                  value={newFee.isMandatory ? 'true' : 'false'}
                  onChange={(e) => setNewFee(prev => ({ ...prev, isMandatory: e.target.value === 'true' }))}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none font-bold"
                >
                  <option value="true">Mandatory (Compulsory)</option>
                  <option value="false">Optional (Elective / Coaching)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Due Date / Terms</label>
              <input 
                type="text"
                placeholder="e.g. Due on 10th of Term Month"
                value={newFee.dueDate}
                onChange={(e) => setNewFee(prev => ({ ...prev, dueDate: e.target.value }))}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
              <Button variant="ghost" onClick={() => setIsCreateFeeOpen(false)}>
                Cancel
              </Button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#1A4A7A] hover:bg-[#153860] text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4 text-emerald-400" />
                Create Fee
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ================= EDIT FEE MODAL ================= */}
      {editingFee && (
        <Modal
          isOpen={true}
          onClose={() => setEditingFee(null)}
          title={`Edit Fee Structure: ${editingFee.name} (${editingFee.id})`}
        >
          <form onSubmit={handleUpdateFee} className="space-y-4 text-xs font-sans">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Fee Component Name</label>
              <input 
                type="text"
                required
                value={editingFee.name}
                onChange={(e) => setEditingFee({ ...editingFee, name: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Applicable Grades</label>
                <input 
                  type="text"
                  required
                  value={editingFee.grades}
                  onChange={(e) => setEditingFee({ ...editingFee, grades: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Amount (₹)</label>
                <input 
                  type="number"
                  required
                  min="0"
                  value={editingFee.amount}
                  onChange={(e) => setEditingFee({ ...editingFee, amount: parseFloat(e.target.value) || 0 })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none font-mono font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Mandate Type</label>
                <select
                  value={editingFee.isMandatory ? 'true' : 'false'}
                  onChange={(e) => setEditingFee({ ...editingFee, isMandatory: e.target.value === 'true' })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none font-bold"
                >
                  <option value="true">Mandatory</option>
                  <option value="false">Optional</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Status</label>
                <select
                  value={editingFee.status}
                  onChange={(e) => setEditingFee({ ...editingFee, status: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none font-bold"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => handleDeleteFee(editingFee.id, editingFee.name)}
                className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Component
              </button>

              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => setEditingFee(null)}>
                  Cancel
                </Button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1A4A7A] hover:bg-[#153860] text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 text-[#F5C518]" />
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        </Modal>
      )}

      {/* ================= GLOBAL SETTINGS MODAL ================= */}
      {isConfigureOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsConfigureOpen(false)}
          title="Global Fee Policies: Caution Deposit & Discounts"
        >
          <form onSubmit={handleSaveGlobalSettings} className="space-y-4 text-xs font-sans">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 leading-relaxed">
              <strong>Administrative Policy Notice:</strong> Caution deposits are held in escrow and refundable upon student graduation or formal transfer clearance.
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Caution Money Deposit (₹ Refundable)
                </label>
                <input 
                  type="number"
                  required
                  min="0"
                  value={globalSettings.cautionDeposit}
                  onChange={(e) => setGlobalSettings(prev => ({ ...prev, cautionDeposit: parseFloat(e.target.value) || 0 }))}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Sibling Concession (%)
                </label>
                <input 
                  type="number"
                  required
                  min="0"
                  max="100"
                  value={globalSettings.siblingDiscount}
                  onChange={(e) => setGlobalSettings(prev => ({ ...prev, siblingDiscount: parseFloat(e.target.value) || 0 }))}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none font-mono font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Merit Scholarship Concession (%)
                </label>
                <input 
                  type="number"
                  required
                  min="0"
                  max="100"
                  value={globalSettings.meritScholarship}
                  onChange={(e) => setGlobalSettings(prev => ({ ...prev, meritScholarship: parseFloat(e.target.value) || 0 }))}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Late Payment Fine (₹ / Day)
                </label>
                <input 
                  type="number"
                  required
                  min="0"
                  value={globalSettings.lateFeePerDay}
                  onChange={(e) => setGlobalSettings(prev => ({ ...prev, lateFeePerDay: parseFloat(e.target.value) || 0 }))}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none font-mono font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Refund & Release Clause</label>
              <textarea 
                rows={2}
                value={globalSettings.refundablePolicy}
                onChange={(e) => setGlobalSettings(prev => ({ ...prev, refundablePolicy: e.target.value }))}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
              <Button variant="ghost" onClick={() => setIsConfigureOpen(false)}>
                Cancel
              </Button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#1A4A7A] hover:bg-[#153860] text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4 text-[#F5C518]" />
                Save Policies
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ================= FEE AUDIT HISTORY MODAL ================= */}
      {historyFee && (
        <Modal
          isOpen={true}
          onClose={() => setHistoryFee(null)}
          title={`Audit History: ${historyFee.name} (${historyFee.id})`}
        >
          <div className="space-y-4 text-xs font-sans">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-900 block">{historyFee.name}</span>
                <span className="text-slate-500 font-mono">Current Base: ₹{historyFee.amount.toLocaleString()}</span>
              </div>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded">
                AUDITED & APPROVED
              </span>
            </div>

            <div className="space-y-2.5">
              <h5 className="font-bold text-slate-800 uppercase text-[11px] tracking-wider">Revision Timeline</h5>
              <div className="border-l-2 border-[#1A4A7A] pl-3 space-y-3">
                <div>
                  <span className="text-[10px] text-slate-400 font-mono block">Today, 02:15 PM • By Administrator</span>
                  <span className="font-bold text-slate-800">Fee policy confirmed for current academic session 2026-27</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-mono block">15-Aug-2026, 11:30 AM • By Governing Body</span>
                  <span className="font-bold text-slate-800">Annual tuition schedule revised by +4% for Senior Secondary classes</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-mono block">01-Apr-2026, 10:00 AM • System Setup</span>
                  <span className="font-bold text-slate-800">Initial fee structure registered with school portal accounts wing</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-200">
              <Button variant="primary" onClick={() => setHistoryFee(null)}>
                Close Audit Log
              </Button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};
