import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTenant } from '../hooks/useTenant';
export const TenantContext = createContext();

export const TenantProvider = ({ children }) => {
  const { user } = useAuth();
  const [currentTenant, setCurrentTenant] = useState(null);
  const [tenantLoading, setTenantLoading] = useState(true);
  const [tenantError, setTenantError] = useState(null);
  const [subscriptionPlans, setSubscriptionPlans] = useState(null);
  const [featureAccess, setFeatureAccess] = useState({});

  const fetchTenantData = useCallback(async () => {
    if (user?.tenant) {
      try {
        setTenantLoading(true);
        
        setCurrentTenant(user.tenant);
        setSubscriptionPlans(user.tenant.subscriptionPlan);
        setTenantError(null);

        // Pre-fetch common feature access
        const commonFeatures = [
          'employee_management',
          'attendance_tracking',
          'performance_reviews',
          'payroll_management'
        ];

        // const featureAccessMap = {};
        // await Promise.all(
        //   commonFeatures.map(async (feature) => {
        //     featureAccessMap[feature] = await tenantService.checkFeatureAccess(
        //       user.tenantId,
        //       feature
        //     );
        //   })
        // );
        setFeatureAccess(user.tenant.features);

      } catch (error) {
        console.error('Failed to fetch tenant data:', error);
        setTenantError('Failed to load organization data');
      } finally {
        setTenantLoading(false);
      }
    } else {
      setCurrentTenant(null);
      setTenantLoading(false);
    }
  }, [user?.tenantId]);

  useEffect(() => {
    fetchTenantData();
  }, [fetchTenantData]);

  // const checkFeatureAccess = useCallback(async (featureName) => {
  //   if (!user?.tenantId) return false;

  //   // Return cached result if available
  //   if (featureAccess.hasOwnProperty(featureName)) {
  //     return featureAccess[featureName];
  //   }

  //   try {
  //     const hasAccess = await tenantService.checkFeatureAccess(
  //       user.tenantId,
  //       featureName
  //     );
      
  //     // Cache the result
  //     setFeatureAccess(prev => ({
  //       ...prev,
  //       [featureName]: hasAccess
  //     }));

  //     return hasAccess;
  //   } catch (error) {
  //     console.error('Error checking feature access:', error);
  //     return false;
  //   }
  // }, [user?.tenantId, featureAccess]);

  // const updateTenantInfo = async (updateData) => {
  //   try {
  //     setTenantLoading(true);
  //     const updatedTenant = await tenantService.updateTenant(
  //       currentTenant.id,
  //       updateData
  //     );
  //     setCurrentTenant(updatedTenant);
  //     setTenantError(null);
  //     return updatedTenant;
  //   } catch (error) {
  //     setTenantError('Failed to update organization information');
  //     throw error;
  //   } finally {
  //     setTenantLoading(false);
  //   }
  // };

  // const updateSubscription = async (planName) => {
  //   try {
  //     setTenantLoading(true);
  //     const updatedTenant = await tenantService.updateSubscription(
  //       currentTenant.id,
  //       { plan: planName }
  //     );
  //     setCurrentTenant(updatedTenant);
      
  //     // Clear feature access cache after plan change
  //     setFeatureAccess({});
      
  //     setTenantError(null);
  //     return updatedTenant;
  //   } catch (error) {
  //     setTenantError('Failed to update subscription');
  //     throw error;
  //   } finally {
  //     setTenantLoading(false);
  //   }
  // };

  // const updateSettings = async (settings) => {
  //   try {
  //     setTenantLoading(true);
  //     const updatedSettings = await tenantService.updateTenantSettings(
  //       currentTenant.id,
  //       settings
  //     );
  //     setCurrentTenant(prev => ({
  //       ...prev,
  //       settings: updatedSettings
  //     }));
  //     return updatedSettings;
  //   } catch (error) {
  //     setTenantError('Failed to update settings');
  //     throw error;
  //   } finally {
  //     setTenantLoading(false);
  //   }
  // };

  const value = {
    currentTenant,
    tenantLoading,
    tenantError,
    subscriptionPlans,
    // checkFeatureAccess,
    // updateTenantInfo,
    // updateSubscription,
    // updateSettings,
    refreshTenant: fetchTenantData
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
};

// HOC for feature-based access control
export const withFeatureAccess = (WrappedComponent, requiredFeature) => {
  return function FeatureProtectedComponent(props) {
    const { checkFeatureAccess, tenantLoading } = useTenant();
    const [hasAccess, setHasAccess] = useState(false);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
      const checkAccess = async () => {
        if (!tenantLoading) {
          const access = await checkFeatureAccess(requiredFeature);
          setHasAccess(access);
          setChecking(false);
        }
      };

      checkAccess();
    }, [tenantLoading]);

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
            Please upgrade your subscription to access this feature.
          </p>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
};