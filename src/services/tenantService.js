const tenants = [
  { 
    id: 1, 
    name: 'Company One', 
    industry: 'Technology', 
    employeeCount: 100, 
    subscriptionPlan: 'Pro',
    subscriptionStatus: 'active',
    subscriptionStartDate: '2024-01-01',
    subscriptionEndDate: '2024-12-31',
    billingCycle: 'monthly',
    features: [
      'employee_management',
      'attendance_tracking',
      'payroll_basic',
      'performance_reviews',
      'recruitment_basic'
    ],
    settings: {
      maxEmployees: 200,
      maxDepartments: 20,
      maxStorageGB: 50
    },
    billingInfo: {
      contactName: 'John Doe',
      contactEmail: 'john@companyone.com',
      address: '123 Tech St, San Francisco, CA',
      paymentMethod: 'credit_card',
      cardLast4: '4242'
    }
  },
  { 
    id: 2, 
    name: 'Company Two', 
    industry: 'Healthcare', 
    employeeCount: 50, 
    subscriptionPlan: 'Basic',
    subscriptionStatus: 'active',
    subscriptionStartDate: '2024-02-01',
    subscriptionEndDate: '2024-12-31',
    billingCycle: 'annual',
    features: [
      'employee_management',
      'attendance_tracking',
      'payroll_basic'
    ],
    settings: {
      maxEmployees: 100,
      maxDepartments: 10,
      maxStorageGB: 25
    },
    billingInfo: {
      contactName: 'Jane Smith',
      contactEmail: 'jane@companytwo.com',
      address: '456 Health Ave, Boston, MA',
      paymentMethod: 'bank_transfer'
    }
  }
];

const subscriptionPlans = {
  free: {
    name: 'Free',
    maxEmployees: 10,
    maxDepartments: 3,
    maxStorageGB: 5,
    features: [
      'employee_management_basic',
      'attendance_tracking_basic'
    ],
    price: 0
  },
  basic: {
    name: 'Basic',
    maxEmployees: 50,
    maxDepartments: 5,
    maxStorageGB: 20,
    features: [
      'employee_management',
      'attendance_tracking',
      'payroll_basic'
    ],
    price: 10
  },
  pro: {
    name: 'Pro',
    maxEmployees: 200,
    maxDepartments: 20,
    maxStorageGB: 50,
    features: [
      'employee_management',
      'attendance_tracking',
      'payroll_advanced',
      'performance_reviews',
      'recruitment_basic',
      'reports_advanced'
    ],
    price: 25
  },
  enterprise: {
    name: 'Enterprise',
    maxEmployees: 'Unlimited',
    maxDepartments: 'Unlimited',
    maxStorageGB: 500,
    features: [
      'employee_management',
      'attendance_tracking',
      'payroll_advanced',
      'performance_reviews',
      'recruitment_advanced',
      'reports_advanced',
      'api_access',
      'custom_integrations',
      'dedicated_support'
    ],
    price: 'Custom'
  }
};

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
        const newTenant = {
          id: tenants.length + 1,
          ...tenantData,
          subscriptionStatus: 'active',
          subscriptionStartDate: new Date().toISOString().split('T')[0],
          features: subscriptionPlans[tenantData.subscriptionPlan]?.features || [],
          settings: {
            maxEmployees: subscriptionPlans[tenantData.subscriptionPlan]?.maxEmployees || 10,
            maxDepartments: subscriptionPlans[tenantData.subscriptionPlan]?.maxDepartments || 3,
            maxStorageGB: subscriptionPlans[tenantData.subscriptionPlan]?.maxStorageGB || 5
          }
        };
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
          tenants.splice(index, 1);
          resolve({ success: true });
        } else {
          reject(new Error('Tenant not found'));
        }
      }, 300);
    });
  },

  // Subscription-related methods
  getSubscriptionPlans: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(subscriptionPlans), 300);
    });
  },

  updateSubscription: async (tenantId, planName) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const tenant = tenants.find(t => t.id === tenantId);
        if (!tenant) {
          reject(new Error('Tenant not found'));
          return;
        }

        const plan = subscriptionPlans[planName.toLowerCase()];
        if (!plan) {
          reject(new Error('Invalid subscription plan'));
          return;
        }

        tenant.subscriptionPlan = planName;
        tenant.features = plan.features;
        tenant.settings = {
          maxEmployees: plan.maxEmployees,
          maxDepartments: plan.maxDepartments,
          maxStorageGB: plan.maxStorageGB
        };
        tenant.subscriptionStartDate = new Date().toISOString().split('T')[0];
        tenant.subscriptionEndDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
          .toISOString().split('T')[0];

        resolve(tenant);
      }, 300);
    });
  },

  checkFeatureAccess: async (tenantId, featureName) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const tenant = tenants.find(t => t.id === tenantId);
        if (!tenant) {
          reject(new Error('Tenant not found'));
          return;
        }
        resolve(tenant.features.includes(featureName));
      }, 300);
    });
  }
};

export default tenantService;