import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import tenantService from '../services/tenantService';
import { useTenant } from '../hooks/useTenant';

export const TenantContext = createContext();

export const TenantProvider = ({ children }) => {
  const { user } = useAuth();
  const [currentTenant, setCurrentTenant] = useState(null);
  const [tenantLoading, setTenantLoading] = useState(true);
  const [tenantError, setTenantError] = useState(null);
  const [subscriptionPlans, setSubscriptionPlans] = useState(null);

  useEffect(() => {
    const fetchTenantData = async () => {
      if (user && user.tenantId) {
        try {
          setTenantLoading(true);
          const [tenantData, plans] = await Promise.all([
            tenantService.getTenantById(user.tenantId),
            tenantService.getSubscriptionPlans()
          ]);
          setCurrentTenant(tenantData);
          setSubscriptionPlans(plans);
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
      throw error;
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
      throw error;
    } finally {
      setTenantLoading(false);
    }
  };

  const updateSubscription = async (planName) => {
    try {
      setTenantLoading(true);
      const updatedTenant = await tenantService.updateSubscription(currentTenant.id, planName);
      setCurrentTenant(updatedTenant);
      setTenantError(null);
    } catch (error) {
      console.error('Failed to update subscription:', error);
      setTenantError('Failed to update subscription. Please try again later.');
      throw error;
    } finally {
      setTenantLoading(false);
    }
  };

  const checkFeatureAccess = async (featureName) => {
    try {
      if (!currentTenant) return false;
      return await tenantService.checkFeatureAccess(currentTenant.id, featureName);
    } catch (error) {
      console.error('Failed to check feature access:', error);
      return false;
    }
  };

  const value = {
    currentTenant,
    tenantLoading,
    tenantError,
    subscriptionPlans,
    switchTenant,
    updateTenantInfo,
    updateSubscription,
    checkFeatureAccess
  };

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
};

// Higher-Order Component for feature-based access control
export const withFeatureAccess = (WrappedComponent, requiredFeature) => {
  return (props) => {
    const { checkFeatureAccess, tenantLoading } = useTenant();
    const [hasAccess, setHasAccess] = useState(false);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
      const checkAccess = async () => {
        const access = await checkFeatureAccess(requiredFeature);
        setHasAccess(access);
        setChecking(false);
      };

      if (!tenantLoading) {
        checkAccess();
      }
    }, [tenantLoading, requiredFeature]);

    if (tenantLoading || checking) {
      return <div>Loading...</div>;
    }

    if (!hasAccess) {
      return (
        <div className="text-center p-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Feature Not Available
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            This feature requires a higher subscription plan.
          </p>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
};