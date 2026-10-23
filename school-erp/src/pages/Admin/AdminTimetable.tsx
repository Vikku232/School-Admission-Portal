import React, { useState } from 'react';
import { Button } from '../../components/shared/Button';
import { Modal } from '../../components/shared/Modal';
import { 
  Calendar as CalendarIcon, Download, Plus, Clock, 
  Trash2, Edit3, Check, Printer, BookOpen, User, 
  Building2, Sparkles, Filter
} from 'lucide-react';
import toast from 'react-hot-toast';

interface TimetableSlot {
  id?: string;
  day: string;
  time: string;
  subject: string;
  teacher: string;
  room?: string;
  type: 'class' | 'sports' | 'break' | 'lab';
}

export const AdminTimetable: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<string>('11-Com');
  const [schedules, setSchedules] = useState<Record<string, TimetableSlot[]>>({});

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimetableSlot | null>(null);

  // Form State
  const [slotForm, setSlotForm] = useState<TimetableSlot>({
    day: 'Monday',
    time: '10:00 AM',
    subject: '',
    teacher: '',
    room: 'Room 201',
    type: 'class'
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeslots = ['10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM'];

  // Current class schedule list
  const currentSlots = schedules[selectedClass] || [];

  // Helper to find slot
  const getSlot = (day: string, time: string): TimetableSlot | null => {
    if (time === '01:00 PM') {
      return { day, time, subject: 'Senior Recess & Lunch Break', teacher: 'All Wings', room: 'Cafeteria', type: 'break' };
    }
    return currentSlots.find(s => s.day === day && s.time === time) || null;
  };

  // Click on empty cell
  const handleCellClick = (day: string, time: string) => {
    if (time === '01:00 PM') return;
    const existing = getSlot(day, time);
    if (existing && existing.type !== 'break') {
      setEditingSlot(existing);
    } else {
      setSlotForm({
        day,
        time,
        subject: '',
        teacher: '',
        room: selectedClass.includes('Com') ? 'Room 204' : selectedClass.includes('Arts') ? 'Room 206' : 'Room 201',
        type: 'class'
      });
      setIsAddModalOpen(true);
    }
  };

  // Add / Save Slot
  const handleSaveSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slotForm.subject.trim()) {
      toast.error('Please enter a subject name');
      return;
    }

    const newSlot: TimetableSlot = {
      ...slotForm,
      subject: slotForm.subject.trim(),
      teacher: slotForm.teacher.trim() || 'Assigned Faculty'
    };

    setSchedules(prev => {
      const classList = prev[selectedClass] ? [...prev[selectedClass]] : [];
      // Replace existing slot at same day & time if any
      const filtered = classList.filter(s => !(s.day === newSlot.day && s.time === newSlot.time));
      return {
        ...prev,
        [selectedClass]: [...filtered, newSlot]
      };
    });

    toast.success(`Slot for "${newSlot.subject}" saved on ${newSlot.day} at ${newSlot.time}!`);
    setIsAddModalOpen(false);
  };

  // Update existing slot
  const handleUpdateSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlot || !editingSlot.subject.trim()) return;

    setSchedules(prev => {
      const classList = prev[selectedClass] || [];
      const updated = classList.map(s => 
        (s.day === editingSlot.day && s.time === editingSlot.time) ? editingSlot : s
      );
      return {
        ...prev,
        [selectedClass]: updated
      };
    });

    toast.success(`Period for ${editingSlot.subject} updated!`);
    setEditingSlot(null);
  };

  // Remove Slot
  const handleDeleteSlot = () => {
    if (!editingSlot) return;
    setSchedules(prev => {
      const classList = prev[selectedClass] || [];
      return {
        ...prev,
        [selectedClass]: classList.filter(s => !(s.day === editingSlot.day && s.time === editingSlot.time))
      };
    });
    toast.success(`Period on ${editingSlot.day} at ${editingSlot.time} removed`);
    setEditingSlot(null);
  };

  // Export PDF Handler
  const handleExportPdf = () => {
    toast.success(`Preparing printable PDF for ${selectedClass}...`);
    setTimeout(() => {
      window.print();
    }, 400);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-[#E8EDF2] flex flex-col min-h-[calc(100vh-120px)] shadow-xs">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold font-poppins text-slate-800 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-[#1A4A7A]" />
            Senior Secondary Master Timetable
          </h2>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-xs text-slate-500">
              View, schedule and assign periods for Classes 11th & 12th (Science, Commerce & Humanities).
            </p>
            <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-300 rounded-md text-[10px] font-bold inline-flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-600" />
              School Timing: 10:00 AM – 04:00 PM
            </span>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Class Selector Dropdown */}
          <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl border border-slate-300">
            <span className="text-[11px] font-bold text-slate-500 pl-2">Class:</span>
            <select 
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                toast.success(`Switched view to ${e.target.selectedOptions[0].text}`);
              }}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-[#1A4A7A] focus:outline-none cursor-pointer"
            >
              <option value="11-Sci-PCM">Class 11 - Science (PCM)</option>
              <option value="11-Com">Class 11 - Commerce</option>
              <option value="11-Arts">Class 11 - Humanities</option>
              <option value="12-Sci-PCM">Class 12 - Science (PCM)</option>
              <option value="12-Com">Class 12 - Commerce</option>
            </select>
          </div>
          
          {/* Workable Export PDF Button */}
          <button
            type="button"
            onClick={handleExportPdf}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-300"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Export PDF</span>
          </button>
          
          {/* Workable Add Slot Button */}
          <Button 
            variant="primary"
            onClick={() => {
              setSlotForm({
                day: 'Monday',
                time: '10:00 AM',
                subject: '',
                teacher: '',
                room: selectedClass.includes('Com') ? 'Room 204' : 'Room 201',
                type: 'class'
              });
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-[1.02] transition-transform"
          >
            <Plus className="w-4 h-4" /> Add Slot
          </Button>
        </div>
      </div>

      {/* Helpful Instructions Banner */}
      <div className="mb-4 p-3 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center justify-between text-xs text-[#1A4A7A]">
        <span>
          💡 <strong>Interactive Scheduler:</strong> Click any cell in the grid below to assign a new period, or click on an existing class to edit subject or faculty.
        </span>
        <span className="font-bold uppercase tracking-wider text-[10px] bg-white px-2 py-0.5 rounded border border-blue-200">
          {currentSlots.length} Periods Scheduled
        </span>
      </div>

      {/* Timetable Grid */}
      <div className="overflow-x-auto border border-[#E8EDF2] rounded-xl shadow-2xs">
        <table className="w-full text-xs text-left">
          <thead className="bg-[#F5F8FC] border-b border-[#E8EDF2]">
            <tr>
              <th className="px-4 py-3.5 w-28 border-r border-[#E8EDF2] text-center text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <Clock className="w-4 h-4 mx-auto mb-1 text-slate-400" /> Time Slot
              </th>
              {days.map(day => (
                <th key={day} className="px-5 py-3.5 border-r border-[#E8EDF2] last:border-0 font-bold font-poppins text-slate-800 text-center">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8EDF2]">
            {timeslots.map((time) => (
              <tr key={time} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-3 py-4 border-r border-[#E8EDF2] bg-slate-50 text-center font-mono font-bold text-slate-700 whitespace-nowrap">
                  {time}
                </td>
                {days.map(day => {
                  const slot = getSlot(day, time);
                  return (
                    <td 
                      key={`${day}-${time}`} 
                      onClick={() => handleCellClick(day, time)}
                      className="border-r border-[#E8EDF2] last:border-0 p-2 relative group h-[88px] min-w-[170px] align-top"
                    >
                      {slot ? (
                        <div className={`h-full w-full rounded-xl p-2.5 border flex flex-col justify-between transition-all cursor-pointer shadow-2xs hover:scale-[1.02] ${
                          slot.type === 'break' ? 'bg-amber-50/90 border-amber-300 items-center justify-center text-center cursor-default' :
                          slot.type === 'lab' ? 'bg-purple-50 border-purple-200 hover:border-purple-400' :
                          slot.type === 'sports' ? 'bg-emerald-50 border-emerald-200 hover:border-emerald-400' :
                          'bg-blue-50/80 border-blue-200 hover:border-[#1A4A7A]'
                        }`}>
                          {slot.type === 'break' ? (
                            <div>
                              <span className="font-extrabold text-amber-800 uppercase tracking-widest text-[11px] block">Senior Recess</span>
                              <span className="text-[10px] text-amber-600 font-medium">Lunch & Refreshment</span>
                            </div>
                          ) : (
                            <>
                              <div>
                                <span className="font-bold text-[#1A4A7A] text-xs line-clamp-1 block">
                                  {slot.subject}
                                </span>
                                <span className="text-[11px] text-slate-600 font-medium flex items-center gap-1 mt-0.5">
                                  <User className="w-3 h-3 text-slate-400" />
                                  {slot.teacher}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-1 pt-1 border-t border-slate-200/60">
                                <span>{slot.room || 'Room 201'}</span>
                                <span className="uppercase text-[9px] font-bold px-1 rounded bg-white border border-slate-200 text-slate-600">
                                  {slot.type}
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      ) : (
                        <div className="w-full h-full rounded-xl border-2 border-dashed border-slate-200 group-hover:border-[#1A4A7A]/50 flex items-center justify-center cursor-pointer transition-colors bg-white/40 group-hover:bg-blue-50/40">
                          <span className="text-xs text-slate-400 group-hover:text-[#1A4A7A] font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                            <Plus className="w-3.5 h-3.5" /> Assign
                          </span>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= ADD SLOT MODAL ================= */}
      {isAddModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsAddModalOpen(false)}
          title={`Assign Period Slot: ${selectedClass}`}
        >
          <form onSubmit={handleSaveSlot} className="space-y-4 text-xs font-sans">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Day of Week *</label>
                <select
                  value={slotForm.day}
                  onChange={(e) => setSlotForm(prev => ({ ...prev, day: e.target.value }))}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none font-bold"
                >
                  {days.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Time Slot *</label>
                <select
                  value={slotForm.time}
                  onChange={(e) => setSlotForm(prev => ({ ...prev, time: e.target.value }))}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none font-mono font-bold"
                >
                  {timeslots.filter(t => t !== '01:00 PM').map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Subject Name *</label>
              <input 
                type="text"
                required
                placeholder="e.g. Financial Accountancy / Physics / CS"
                value={slotForm.subject}
                onChange={(e) => setSlotForm(prev => ({ ...prev, subject: e.target.value }))}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Assigned Faculty / Teacher</label>
                <input 
                  type="text"
                  placeholder="e.g. Assigned Faculty / Teacher"
                  value={slotForm.teacher}
                  onChange={(e) => setSlotForm(prev => ({ ...prev, teacher: e.target.value }))}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Room / Lab Location</label>
                <input 
                  type="text"
                  placeholder="e.g. Room 204 / Physics Lab"
                  value={slotForm.room}
                  onChange={(e) => setSlotForm(prev => ({ ...prev, room: e.target.value }))}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Period Category</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'class', label: 'Theory Class' },
                  { id: 'lab', label: 'Practical / Lab' },
                  { id: 'sports', label: 'Coaching / Mock' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSlotForm(prev => ({ ...prev, type: cat.id as any }))}
                    className={`p-2 rounded-xl border text-center font-bold cursor-pointer transition-all ${
                      slotForm.type === cat.id 
                        ? 'bg-[#1A4A7A] text-white border-[#1A4A7A]' 
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
              <Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#1A4A7A] hover:bg-[#153860] text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4 text-emerald-400" />
                Assign Period
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ================= EDIT / REMOVE SLOT MODAL ================= */}
      {editingSlot && (
        <Modal
          isOpen={true}
          onClose={() => setEditingSlot(null)}
          title={`Edit Period: ${editingSlot.day} at ${editingSlot.time}`}
        >
          <form onSubmit={handleUpdateSlot} className="space-y-4 text-xs font-sans">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Subject Name *</label>
              <input 
                type="text"
                required
                value={editingSlot.subject}
                onChange={(e) => setEditingSlot({ ...editingSlot, subject: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Faculty / Teacher</label>
                <input 
                  type="text"
                  required
                  value={editingSlot.teacher}
                  onChange={(e) => setEditingSlot({ ...editingSlot, teacher: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Room / Lab</label>
                <input 
                  type="text"
                  value={editingSlot.room || 'Room 201'}
                  onChange={(e) => setEditingSlot({ ...editingSlot, room: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1A4A7A] outline-none"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={handleDeleteSlot}
                className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" /> Remove Period
              </button>

              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => setEditingSlot(null)}>
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

    </div>
  );
};
