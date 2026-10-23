import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { LandingPage } from './pages/Public/LandingPage';
import { Login } from './pages/Auth/Login';
import { AdminLogin } from './pages/Auth/AdminLogin';
import { DashboardLayout } from './layouts/DashboardLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

import { ReceiptViewPage } from './pages/Public/ReceiptViewPage';

// Admin Pages
import { AdminDashboard } from './pages/Admin/AdminDashboard';
import { AdminAdmissions } from './pages/Admin/AdminAdmissions';
import { AdminStudents } from './pages/Admin/AdminStudents';
import { AdminTeachers } from './pages/Admin/AdminTeachers';
import { AdminGrades } from './pages/Admin/AdminGrades';
import { AdminFees } from './pages/Admin/AdminFees';
import { AdminPayments } from './pages/Admin/AdminPayments';
import { AdminTimetable } from './pages/Admin/AdminTimetable';
import { AdminAnalytics } from './pages/Admin/AdminAnalytics';
import { AdminUsers } from './pages/Admin/AdminUsers';

// Teacher Pages
import { TeacherDashboard } from './pages/Teacher/TeacherDashboard';
import { TeacherStudents } from './pages/Teacher/TeacherStudents';
import { TeacherExams } from './pages/Teacher/TeacherExams';
import { TeacherAssignments } from './pages/Teacher/TeacherAssignments';
import { TeacherAttendance } from './pages/Teacher/TeacherAttendance';

// Student Pages
import { StudentDashboard } from './pages/Student/StudentDashboard';
import { StudentFees } from './pages/Student/StudentFees';
import { StudentExams } from './pages/Student/StudentExams';
import { StudentAssignments } from './pages/Student/StudentAssignments';
import { StudentAttendance } from './pages/Student/StudentAttendance';

// Initialize React Query Client
const queryClient = new QueryClient();

// Placeholder Dashboard Page (for Student routes still pending)
const PlaceholderDashboard = ({ title }: { title: string }) => (
  <div className="bg-white p-8 rounded-xl shadow-xs border border-slate-200">
    <h2 className="text-2xl font-bold font-poppins text-slate-800 mb-4">{title} Dashboard</h2>
    <p className="text-slate-600">This is a placeholder for the {title.toLowerCase()} panel. Feature modules will be rendered here.</p>
  </div>
);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {/* Global Toast Notifications */}
        <Toaster position="bottom-right" toastOptions={{ duration: 4000 }} />
        
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/receipt/:receiptNo" element={<ReceiptViewPage />} />

          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<DashboardLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="admissions" element={<AdminAdmissions />} />
              <Route path="students" element={<AdminStudents />} />
              <Route path="teachers" element={<AdminTeachers />} />
              <Route path="grades" element={<AdminGrades />} />
              <Route path="timetable" element={<AdminTimetable />} />
              <Route path="fees" element={<AdminFees />} />
              <Route path="payments" element={<AdminPayments />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="" element={<Navigate to="dashboard" replace />} />
            </Route>
          </Route>

          {/* Protected Teacher Routes */}
          <Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
            <Route path="/teacher" element={<DashboardLayout />}>
              <Route path="dashboard" element={<TeacherDashboard />} />
              <Route path="students" element={<TeacherStudents />} />
              <Route path="exams" element={<TeacherExams />} />
              <Route path="assignments" element={<TeacherAssignments />} />
              <Route path="attendance" element={<TeacherAttendance />} />
              <Route path="" element={<Navigate to="dashboard" replace />} />
            </Route>
          </Route>

          {/* Protected Student Routes */}
          <Route element={<ProtectedRoute allowedRoles={['student']} />}>
            <Route path="/student" element={<DashboardLayout />}>
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="fees" element={<StudentFees />} />
              <Route path="exams" element={<StudentExams />} />
              <Route path="assignments" element={<StudentAssignments />} />
              <Route path="attendance" element={<StudentAttendance />} />
              <Route path="" element={<Navigate to="dashboard" replace />} />
            </Route>
          </Route>
          
          {/* Fallback Catch-all Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
