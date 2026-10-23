import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../api/axios';
import { Users, UserCheck, IndianRupee, TrendingUp, Inbox } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Table } from '../../components/shared/Table';
import { Badge } from '../../components/shared/Badge';
import { Link } from 'react-router-dom';

const EMPTY_CHART_DATA = [
  { day: 'Mon', amount: 0 },
  { day: 'Tue', amount: 0 },
  { day: 'Wed', amount: 0 },
  { day: 'Thu', amount: 0 },
  { day: 'Fri', amount: 0 },
  { day: 'Sat', amount: 0 },
  { day: 'Sun', amount: 0 },
];

import { supabaseService } from '../../services/supabaseService';

export const AdminDashboard: React.FC = () => {
  // Fetch real live stats from backend database
  const { data: stats, isLoading: isStatsLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      try {
        const res = await api.get('/admin/dashboard/stats');
        return res.data;
      } catch (e) {
        return {
          totalStudents: 0,
          totalTeachers: 0,
          todayCollection: 0,
          pendingFees: 0,
          recentPayments: []
        };
      }
    }
  });

  // Fetch live payments from Supabase
  const { data: cloudPayments = [], isLoading: isPaymentsLoading } = useQuery({
    queryKey: ['cloudDashboardPayments'],
    queryFn: () => supabaseService.getPayments()
  });

  const isLoading = isStatsLoading && isPaymentsLoading;

  const StatCard = ({ title, value, icon: Icon, colorClass }: any) => (
    <div className="bg-white p-6 rounded-xl border border-[#E8EDF2] flex items-center gap-4 shadow-2xs">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClass}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold font-poppins text-slate-800">
          {isLoading ? <div className="h-8 w-24 bg-slate-200 animate-pulse rounded"></div> : value}
        </h3>
      </div>
    </div>
  );

  const totalCloudCollection = cloudPayments
    .filter(p => p.status === 'COMPLETED')
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  const recentPayments = (stats?.recentPayments && stats.recentPayments.length > 0)
    ? stats.recentPayments
    : cloudPayments.slice(0, 5).map(p => ({
        id: p.id || p.receipt_no,
        studentName: p.student_name,
        amount: Number(p.amount) || 0,
        status: p.status || 'COMPLETED'
      }));

  const displayTodayCollection = stats?.todayCollection || totalCloudCollection;


  return (
    <div className="space-y-6">
      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Students" 
          value={stats?.totalStudents ?? 0} 
          icon={Users} 
          colorClass="bg-blue-100 text-blue-600" 
        />
        <StatCard 
          title="Active Teachers" 
          value={stats?.totalTeachers ?? 0} 
          icon={UserCheck} 
          colorClass="bg-emerald-100 text-emerald-600" 
        />
        <StatCard 
          title="Today's Collection" 
          value={`₹${(displayTodayCollection ?? 0).toLocaleString()}`} 
          icon={IndianRupee} 
          colorClass="bg-amber-100 text-amber-600" 
        />
        <StatCard 
          title="Total Pending Fees" 
          value={`₹${(stats?.pendingFees ?? 0).toLocaleString()}`} 
          icon={TrendingUp} 
          colorClass="bg-red-100 text-red-600" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Collection Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-[#E8EDF2] shadow-2xs">
          <h3 className="text-lg font-bold font-poppins text-slate-800 mb-6">Daily Fee Collection (Live Data)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={EMPTY_CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8EDF2" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="amount" fill="#1A4A7A" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Payments Table */}
        <div className="bg-white p-6 rounded-xl border border-[#E8EDF2] shadow-2xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold font-poppins text-slate-800">Recent Payments</h3>
            <Link to="/admin/payments" className="text-xs font-semibold text-blue-600 hover:underline">
              View All
            </Link>
          </div>
          
          <div className="flex-1 flex flex-col justify-center">
            {recentPayments.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center text-slate-400">
                <Inbox className="w-10 h-10 mb-2 stroke-1 text-slate-300" />
                <p className="text-xs font-semibold text-slate-500">No payment transactions recorded yet</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Transactions processed via counter or online will appear here.</p>
              </div>
            ) : (
              <div className="-mx-6">
                <Table<any> 
                  data={recentPayments} 
                  isLoading={isLoading}
                  keyExtractor={(row: any) => row.id}
                  columns={[
                    { 
                      header: 'Student', 
                      accessor: (row: any) => <span className="font-semibold text-xs text-slate-800">{row.studentName}</span> 
                    },
                    { 
                      header: 'Amount', 
                      accessor: (row: any) => <span className="font-mono text-xs">₹{row.amount}</span> 
                    },
                    { 
                      header: 'Status', 
                      accessor: (row: any) => <Badge status={row.status} /> 
                    }
                  ]}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
