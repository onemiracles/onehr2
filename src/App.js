import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { RoleProvider } from './context/RoleContext';
import { TenantProvider } from './context/TenantContext';
import AppRoutes from './routes/AppRoutes';
import { ModalProvider } from './components/ModalProvider';

function App() {
  return (
    <Router>
      <ModalProvider>
        <AuthProvider>
          <RoleProvider>
            <TenantProvider>
              <AppRoutes />
            </TenantProvider>
          </RoleProvider>
        </AuthProvider>
      </ModalProvider>
    </Router>
  );
}

export default App;