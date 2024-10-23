import React, { createContext, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRole } from '../hooks/useRole';

export const RoleContext = createContext();

// Define permissions for each role
const rolePermissions = {
  SUPER_ADMIN: ['manage_companies', 'manage_admins', 'view_global_reports'],
  COMPANY_ADMIN: ['manage_hr', 'manage_employees', 'manage_payroll', 'manage_attendance', 'manage_recruitment'],
  COMPANY_MANAGER: ['view_department_employees', 'manage_team', 'approve_leaves', 'manage_timesheets', 'conduct_reviews'],
  COMPANY_EMPLOYEE: ['manage_work', 'view_profile', 'submit_timesheet', 'request_leave', 'view_payslips']
};

export const RoleProvider = ({ children }) => {
  const { user } = useAuth();

  const userPermissions = useMemo(() => {
    if (!user || !user.role) return [];
    return rolePermissions[user.role] || [];
  }, [user]);

  const hasPermission = (permission) => {
    return userPermissions.includes(permission);
  };

  const value = {
    role: user?.role,
    permissions: userPermissions,
    hasPermission
  };

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
};

// Higher-Order Component for role-based access control
export const withRoleAccess = (WrappedComponent, requiredPermission) => {
  return (props) => {
    const { hasPermission } = useRole();
    
    if (!hasPermission(requiredPermission)) {
      return <div>You do not have permission to access this resource.</div>;
    }

    return <WrappedComponent {...props} />;
  };
};