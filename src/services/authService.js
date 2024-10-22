// Mock user data
const users = [
    { id: 1, email: 'admin@example.com', password: 'admin123', role: 'SUPER_ADMIN', tenantId: null },
    { id: 2, email: 'manager@company1.com', password: 'manager123', role: 'COMPANY_MANAGER', tenantId: 1 },
    { id: 3, email: 'employee@company1.com', password: 'employee123', role: 'COMPANY_EMPLOYEE', tenantId: 1 },
    { id: 4, email: 'admin@company2.com', password: 'admin123', role: 'COMPANY_ADMIN', tenantId: 2 },
  ];
  
  const authService = {
    login: async (email, password) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const user = users.find(u => u.email === email && u.password === password);
          if (user) {
            const { password, ...userWithoutPassword } = user;
            const token = btoa(JSON.stringify(userWithoutPassword));
            resolve({ ...userWithoutPassword, token });
          } else {
            reject(new Error('Invalid credentials'));
          }
        }, 300); // Simulate network delay
      });
    },
  
    logout: async () => {
      return new Promise((resolve) => {
        setTimeout(resolve, 300); // Simulate network delay
      });
    },
  
    validateToken: async (token) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            const decoded = JSON.parse(atob(token));
            const user = users.find(u => u.id === decoded.id);
            if (user) {
              const { password, ...userWithoutPassword } = user;
              resolve(userWithoutPassword);
            } else {
              reject(new Error('Invalid token'));
            }
          } catch (error) {
            reject(new Error('Invalid token'));
          }
        }, 300);
      });
    },
  
    register: async (userData) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (users.some(u => u.email === userData.email)) {
            reject(new Error('User already exists'));
          } else {
            const newUser = { id: users.length + 1, ...userData };
            users.push(newUser);
            resolve(newUser);
          }
        }, 300);
      });
    }
  };
  
  export default authService;