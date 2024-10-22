import React, { createContext, useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTenant } from '../hooks/useTenant';
import tenantService from '../services/tenantService';

export const TenantContext = createContext();

export const TenantProvider = ({ children }) => {
  const { user } = useAuth();
  const [currentTenant, setCurrentTenant] = useState(null);
  const [tenantLoading, setTenantLoading] = useState(true);
  const [tenantError, setTenantError] = useState(null);

  useEffect(() => {
    const fetchTenantData = async () => {
      if (user && user.tenantId) {
        try {
          setTenantLoading(true);
          const tenantData = await tenantService.getTenantById(user.tenantId);
          setCurrentTenant(tenantData);
          setTenantError(null);
        } catch (error) {
          console.error('Failed to fetch tenant data:', error);
          setTenantError('Failed to load company data. Please try again later.');
        } finally {
          setTenantLoading(false);
        }
      } else {
        setCurrentTenant(null);
        setTenantLoading(false);
      }
    };

    fetchTenantData();
  }, [user]);

  const switchTenant = async (newTenantId) => {
    if (user.role !== 'SUPER_ADMIN') {
      throw new Error('Only Super Admins can switch tenants');
    }

    try {
      setTenantLoading(true);
      const newTenantData = await tenantService.getTenantById(newTenantId);
      setCurrentTenant(newTenantData);
      setTenantError(null);
    } catch (error) {
      console.error('Failed to switch tenant:', error);
      setTenantError('Failed to switch company. Please try again later.');
    } finally {
      setTenantLoading(false);
    }
  };

  const updateTenantInfo = async (updatedInfo) => {
    try {
      setTenantLoading(true);
      const updatedTenant = await tenantService.updateTenant(currentTenant.id, updatedInfo);
      setCurrentTenant(updatedTenant);
      setTenantError(null);
    } catch (error) {
      console.error('Failed to update tenant info:', error);
      setTenantError('Failed to update company information. Please try again later.');
    } finally {
      setTenantLoading(false);
    }
  };

  const value = {
    currentTenant,
    tenantLoading,
    tenantError,
    switchTenant,
    updateTenantInfo
  };

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
};

// Higher-Order Component for tenant-based access control
export const withTenantAccess = (WrappedComponent) => {
  return (props) => {
    const { currentTenant, tenantLoading, tenantError } = useTenant();
    const { user } = useAuth();

    if (tenantLoading) {
      return <div>Loading company data...</div>;
    }

    if (tenantError) {
      return <div>{tenantError}</div>;
    }

    if (!currentTenant && user.role !== 'SUPER_ADMIN') {
      return <div>No company data available. Please contact support.</div>;
    }

    return <WrappedComponent {...props} />;
  };
};