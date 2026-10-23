import React, { useState } from 'react';
import { api } from '../../api/axios';
import { Button } from '../../components/shared/Button';
import toast from 'react-hot-toast';
import { UserPlus, Shield, KeyRound } from 'lucide-react';
import { EmailOtpModal } from '../../components/shared/EmailOtpModal';
import { useAuthStore } from '../../store/authStore';

export const AdminUsers: React.FC = () => {
  const user = useAuthStore(state => state.user);
  const [activeTab, setActiveTab] = useState<'admin' | 'teacher'>('admin');
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpOpen, setIsOtpOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    teacherCode: '',
    role: 'ADMIN'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Open OTP modal for security verification before creating account
    setIsOtpOpen(true);
  };

  const executeCreateUser = async () => {
    setIsLoading(true);

    try {
      if (activeTab === 'admin') {
        await api.post('/admin/users/create-admin', {
          name: formData.name,
          email: formData.email,
          passwordHash: formData.password,
          phone: formData.phone,
          role: formData.role
        });
        toast.success(`Admin account (${formData.email}) created successfully!`);
      } else {
        await api.post('/admin/users/create-teacher', {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          passwordHash: formData.password,
          phone: formData.phone,
          teacherCode: formData.teacherCode
        });
        toast.success(`Senior Secondary Teacher account (${formData.email}) created successfully!`);
      }
      
      // Reset form
      setFormData({
        name: '', firstName: '', lastName: '', email: '', 
        password: '', phone: '', teacherCode: '', role: 'ADMIN'
      });
    } catch (err: any) {
      toast.error(err.response?.data || err.message || 'Error creating user');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold font-poppins text-slate-800">User Management</h1>
          <p className="text-slate-500">Create new Admins and Teachers</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex-1 py-4 font-semibold text-sm flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'admin' ? 'bg-slate-50 text-[#1A4A7A] border-b-2 border-[#1A4A7A]' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <Shield className="w-4 h-4" />
            Create Admin
          </button>
          <button
            onClick={() => setActiveTab('teacher')}
            className={`flex-1 py-4 font-semibold text-sm flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'teacher' ? 'bg-slate-50 text-[#1A4A7A] border-b-2 border-[#1A4A7A]' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            Create Teacher
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleFormSubmit} className="space-y-4 max-w-xl mx-auto">
            {activeTab === 'admin' ? (
              <>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
                  <input required name="name" value={formData.name} onChange={handleChange} type="text" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1A4A7A] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Role</label>
                  <select name="role" value={formData.role} onChange={handleChange as any} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1A4A7A] outline-none">
                    <option value="ADMIN">Admin</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                  </select>
                </div>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">First Name</label>
                  <input required name="firstName" value={formData.firstName} onChange={handleChange} type="text" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1A4A7A] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Last Name</label>
                  <input required name="lastName" value={formData.lastName} onChange={handleChange} type="text" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1A4A7A] outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Teacher Code</label>
                  <input required name="teacherCode" value={formData.teacherCode} onChange={handleChange} type="text" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1A4A7A] outline-none" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
              <input required name="email" value={formData.email} onChange={handleChange} type="email" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1A4A7A] outline-none" />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Phone Number</label>
              <input name="phone" value={formData.phone} onChange={handleChange} type="text" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1A4A7A] outline-none" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
              <input required name="password" value={formData.password} onChange={handleChange} type="password" placeholder="Temporary password" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#1A4A7A] outline-none" />
            </div>

            <div className="pt-4">
              <Button type="submit" variant="primary" fullWidth disabled={isLoading}>
                {isLoading ? 'Creating...' : `Authorize & Create ${activeTab === 'admin' ? 'Admin' : 'Teacher'}`}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Security OTP Modal */}
      <EmailOtpModal
        isOpen={isOtpOpen}
        onClose={() => setIsOtpOpen(false)}
        email={user?.email || 'principal.admin@rips.edu.in'}
        actionTitle={`Admin 2FA Authorization: Create ${activeTab === 'admin' ? 'Admin' : 'Senior Teacher'}`}
        actionDescription={`To prevent unauthorized privilege elevation and staff account provisioning for ${formData.email || 'the new account'}, enter the 6-digit OTP sent to your verified administrator email.`}
        onVerified={executeCreateUser}
      />
    </div>
  );
};
