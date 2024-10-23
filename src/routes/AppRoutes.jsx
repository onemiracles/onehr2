import React from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useRole } from '../hooks/useRole';

// Layouts
import MainLayout from '../layouts/MainLayout';

// Public pages
import Login from '../pages/Login';
import Unauthorized from '../pages/Unauthorized';

// Common pages
import DashboardPage from '../pages/DashboardPage';
import Profile from '../pages/Profile';

// Admin pages
import TenantManagement from '../pages/admin/TenantManagement';
import FeatureManagement from '../pages/admin/FeatureManagement';

// HR pages
import EmployeeManagement from '../pages/hr/EmployeeManagement';
import DepartmentManagement from '../pages/hr/DepartmentManagement';
import PayrollManagement from '../pages/hr/PayrollManagement';
import PayrollProcess from '../pages/hr/PayrollProcess';
import RecruitmentManagement from '../pages/hr/RecruitmentManagement';
import LeaveRequests from '../pages/hr/LeaveRequests';
import PerformanceReviews from '../pages/hr/PerformanceReviews';
import EmployeeOnboarding from '../pages/hr/EmployeeOnboarding';

// Manager pages
import AttendanceTracker from '../pages/manager/AttendanceTracker';
import PerformanceReview from '../pages/manager/PerformanceReview';
import PositionManagement from '../pages/manager/PositionManagement';
import MeetingSchedule from '../pages/manager/MeetingSchedule';
import TaskManagement from '../pages/manager/TaskManagement';

// Employee pages
import RequestTimeOff from '../pages/employee/RequestTimeOff';
import ViewPayslips from '../pages/employee/ViewPayslips';
import Tasks from '../pages/employee/Tasks';
import Performance from '../pages/employee/Performance'
import ViewAchievements from '../pages/employee/ViewAchievements.jsx';
import RequestFeedback from '../pages/employee/RequestFeedback.jsx';

const PrivateRoute = ({ children, requiredPermission }) => {
  const { user, loading } = useAuth();
  const { hasPermission } = useRole();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Protected routes */}
      <Route path="/" element={
        <PrivateRoute>
          <MainLayout />
        </PrivateRoute>
      }>
        {/* Common routes */}
        <Route index element={<DashboardPage />} />
        <Route path="profile" element={<Profile />} />

        {/* Admin routes */}
        <Route path="admin" element={<PrivateRoute requiredPermission="manage_companies"><Navigate to="tenants" replace /></PrivateRoute>} />
        <Route path="admin/tenants" element={<PrivateRoute requiredPermission="manage_companies"><TenantManagement /></PrivateRoute>} />
        <Route path="admin/features" element={<PrivateRoute requiredPermission="manage_companies"><FeatureManagement /></PrivateRoute>} />

        {/* HR routes */}
        <Route path="hr" element={<PrivateRoute requiredPermission="manage_hr"><Navigate to="employees" replace /></PrivateRoute>} />
        <Route path="hr/employees" element={<PrivateRoute requiredPermission="manage_hr"><EmployeeManagement /></PrivateRoute>} />
        <Route path="hr/departments" element={<PrivateRoute requiredPermission="manage_hr"><DepartmentManagement /></PrivateRoute>} />
        <Route path="hr/payroll" element={<PrivateRoute requiredPermission="manage_hr"><PayrollManagement /></PrivateRoute>} />
        <Route path="hr/recruitment" element={<PrivateRoute requiredPermission="manage_hr"><RecruitmentManagement /></PrivateRoute>} />
        <Route path="hr/payroll-process" element={<PrivateRoute requiredPermission="manage_hr"><PayrollProcess /></PrivateRoute>} />
        <Route path="hr/leave-requests" element={<PrivateRoute requiredPermission="manage_hr"><LeaveRequests /></PrivateRoute>} />
        <Route path="hr/performance-reviews" element={<PrivateRoute requiredPermission="manage_hr"><PerformanceReviews /></PrivateRoute>} />
        <Route path="hr/employee-onboarding" element={<PrivateRoute requiredPermission="manage_hr"><EmployeeOnboarding /></PrivateRoute>} />

        {/* Manager routes */}
        <Route path="manager" element={<PrivateRoute requiredPermission="manage_team"><Navigate to="attendance" replace /></PrivateRoute>} />
        <Route path="manager/attendance" element={<PrivateRoute requiredPermission="manage_team"><AttendanceTracker /></PrivateRoute>} />
        <Route path="manager/performance" element={<PrivateRoute requiredPermission="manage_team"><PerformanceReview /></PrivateRoute>} />
        <Route path="manager/position" element={<PrivateRoute requiredPermission="manage_team"><PositionManagement /></PrivateRoute>} />
        <Route path="manager/meeting" element={<PrivateRoute requiredPermission="manage_team"><MeetingSchedule /></PrivateRoute>} />
        <Route path="manager/tasks" element={<PrivateRoute requiredPermission="manage_team"><TaskManagement /></PrivateRoute>} />

        {/* Employee routes */}
        <Route path="employee" element={<PrivateRoute requiredPermission="manage_work"><Navigate to="tasks" replace /></PrivateRoute>} />
        <Route path="employee/request-time-off" element={<PrivateRoute requiredPermission="manage_work"><RequestTimeOff /></PrivateRoute>} />
        <Route path="employee/view-payslips" element={<PrivateRoute requiredPermission="manage_work"><ViewPayslips /></PrivateRoute>} />
        <Route path="employee/tasks" element={<PrivateRoute requiredPermission="manage_work"><Tasks /></PrivateRoute>} />
        <Route path="employee/performance" element={<PrivateRoute requiredPermission="manage_work"><Performance /></PrivateRoute>} />
        <Route path="employee/achievements" element={<PrivateRoute requiredPermission="manage_work"><ViewAchievements /></PrivateRoute>} />
        <Route path="employee/request-feedback" element={<PrivateRoute requiredPermission="manage_work"><RequestFeedback /></PrivateRoute>} />
        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;