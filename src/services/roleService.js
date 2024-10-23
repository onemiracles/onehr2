// Mock role data
const roles = [
    { id: 1, name: 'SUPER_ADMIN', permissions: ['manage_companies', 'manage_admins', 'view_global_reports'] },
    { id: 2, name: 'COMPANY_ADMIN', permissions: ['manage_hr', 'manage_employees', 'manage_payroll', 'manage_attendance', 'manage_recruitment'] },
    { id: 3, name: 'COMPANY_MANAGER', permissions: ['view_department_employees', 'approve_leaves', 'manage_team', 'manage_timesheets', 'conduct_reviews'] },
    { id: 4, name: 'COMPANY_EMPLOYEE', permissions: ['manage_work', 'view_profile', 'submit_timesheet', 'request_leave', 'view_payslips'] },
  ];
  
  const roleService = {
    getRoles: async () => {
      return new Promise((resolve) => {
        setTimeout(() => resolve(roles), 300);
      });
    },
  
    getRoleByName: async (roleName) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const role = roles.find(r => r.name === roleName);
          if (role) {
            resolve(role);
          } else {
            reject(new Error('Role not found'));
          }
        }, 300);
      });
    },
  
    updateRole: async (roleId, updatedPermissions) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const roleIndex = roles.findIndex(r => r.id === roleId);
          if (roleIndex !== -1) {
            roles[roleIndex] = { ...roles[roleIndex], permissions: updatedPermissions };
            resolve(roles[roleIndex]);
          } else {
            reject(new Error('Role not found'));
          }
        }, 300);
      });
    }
  };
  
  export default roleService;