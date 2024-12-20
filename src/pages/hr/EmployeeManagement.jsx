import React  from 'react';
import { useAuth } from '../../hooks/useAuth';
import { default as EmployeeManagementComponent } from '../../components/EmployeeManagement';
import { useRole } from '../../hooks/useRole';

const EmployeeManagement = () => {
  const { user } = useAuth();
  const { hasPermission } = useRole();

  if (!hasPermission('manage_hr')) {
    return <div>You do not have permission to access this page.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Employee Management</h2>
      </div>

      <EmployeeManagementComponent selectedTenant={user.tenantId} display='card' />
    </div>
  );
};

export default EmployeeManagement;