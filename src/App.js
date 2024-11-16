import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { RoleProvider } from './context/RoleContext';
import { TenantProvider } from './context/TenantContext';
import AppRoutes from './routes/AppRoutes';
import { Provider } from 'react-redux';
import store from './store/store';

function App() {
  return (
    <Router>
      <Provider store={store}>
        <AuthProvider>
          <RoleProvider>
            <TenantProvider>
              <AppRoutes />
            </TenantProvider>
          </RoleProvider>
        </AuthProvider>
      </Provider>
    </Router>
  );
}

export default App;