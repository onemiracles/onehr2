// Mock tenant data
let tenants = [
    { id: 1, name: 'Company One', industry: 'Technology', employeeCount: 100, subscriptionPlan: 'Pro' },
    { id: 2, name: 'Company Two', industry: 'Healthcare', employeeCount: 50, subscriptionPlan: 'Basic' },
  ];
  
  const tenantService = {
    getTenants: async () => {
      return new Promise((resolve) => {
        setTimeout(() => resolve(tenants), 300);
      });
    },
  
    getTenantById: async (id) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const tenant = tenants.find(t => t.id === id);
          if (tenant) {
            resolve(tenant);
          } else {
            reject(new Error('Tenant not found'));
          }
        }, 300);
      });
    },
  
    createTenant: async (tenantData) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const newTenant = { id: tenants.length + 1, ...tenantData };
          tenants.push(newTenant);
          resolve(newTenant);
        }, 300);
      });
    },
  
    updateTenant: async (id, updatedData) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const index = tenants.findIndex(t => t.id === id);
          if (index !== -1) {
            tenants[index] = { ...tenants[index], ...updatedData };
            resolve(tenants[index]);
          } else {
            reject(new Error('Tenant not found'));
          }
        }, 300);
      });
    },
  
    deleteTenant: async (id) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const index = tenants.findIndex(t => t.id === id);
          if (index !== -1) {
            tenants = tenants.filter(t => t.id !== id);
            resolve({ success: true });
          } else {
            reject(new Error('Tenant not found'));
          }
        }, 300);
      });
    }
  };
  
  export default tenantService;