import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { RoleProvider } from './context/RoleContext';
import { TenantProvider } from './context/TenantContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <Router>
      <AuthProvider>
        <RoleProvider>
          <TenantProvider>
            <AppRoutes />
          </TenantProvider>
        </RoleProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;