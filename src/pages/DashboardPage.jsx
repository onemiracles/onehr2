import React from 'react';
import { useRole } from '../hooks/useRole';
import { SuperAdminDashboard, CompanyAdminDashboard, CompanyManagerDashboard, CompanyEmployeeDashboard } from '../components/RoleSpecificDashboards';
import EmployeeDashboard from './employee/EmployeeDashboard';
import ManagerDashboard from './manager/ManagerDashboard';
import CompanyDashboard from './hr/CompanyDashboard';

const DashboardPage = () => {
  const { role } = useRole();

  switch (role) {
    case 'SUPER_ADMIN':
      return <SuperAdminDashboard />;
    case 'COMPANY_ADMIN':
      return <CompanyDashboard />;
    case 'COMPANY_MANAGER':
      return <ManagerDashboard />;
    case 'COMPANY_EMPLOYEE':
      return <EmployeeDashboard />;
    default:
      return <div>Invalid role. Please contact support.</div>;
  }
};

export default DashboardPage;