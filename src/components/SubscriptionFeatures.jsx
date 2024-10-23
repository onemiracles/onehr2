import React, { useState, useEffect } from 'react';
import { Card, Button, Spinner } from '@/components/ui/';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faInfoCircle, faCrown, faChartLine, faUsers, faFileAlt, faCog } from '@fortawesome/free-solid-svg-icons';

const SubscriptionFeatures = () => {
  const [loading, setLoading] = useState(true);
  const [currentPlan, setCurrentPlan] = useState('basic');
  const [features, setFeatures] = useState([]);

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    setLoading(true);
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Mock features data
      setFeatures([
        {
          category: 'Employee Management',
          features: [
            { name: 'Basic Employee Profiles', free: true, basic: true, pro: true, enterprise: true },
            { name: 'Advanced Employee Data', free: false, basic: true, pro: true, enterprise: true },
            { name: 'Org Chart', free: false, basic: false, pro: true, enterprise: true },
            { name: 'Custom Fields', free: false, basic: false, pro: true, enterprise: true },
            { name: 'Bulk Import/Export', free: false, basic: false, pro: true, enterprise: true }
          ]
        },
        {
          category: 'Attendance & Time Tracking',
          features: [
            { name: 'Basic Time Tracking', free: true, basic: true, pro: true, enterprise: true },
            { name: 'Leave Management', free: false, basic: true, pro: true, enterprise: true },
            { name: 'Shift Management', free: false, basic: false, pro: true, enterprise: true },
            { name: 'Overtime Tracking', free: false, basic: false, pro: true, enterprise: true },
            { name: 'Advanced Reports', free: false, basic: false, pro: true, enterprise: true }
          ]
        },
        {
          category: 'Performance Management',
          features: [
            { name: 'Basic Reviews', free: true, basic: true, pro: true, enterprise: true },
            { name: '360° Feedback', free: false, basic: false, pro: true, enterprise: true },
            { name: 'Goal Tracking', free: false, basic: false, pro: true, enterprise: true },
            { name: 'Performance Analytics', free: false, basic: false, pro: false, enterprise: true },
            { name: 'Custom Review Cycles', free: false, basic: false, pro: false, enterprise: true }
          ]
        },
        {
          category: 'Payroll & Benefits',
          features: [
            { name: 'Basic Payroll', free: false, basic: true, pro: true, enterprise: true },
            { name: 'Tax Management', free: false, basic: true, pro: true, enterprise: true },
            { name: 'Benefits Administration', free: false, basic: false, pro: true, enterprise: true },
            { name: 'Multi-country Payroll', free: false, basic: false, pro: false, enterprise: true },
            { name: 'Custom Pay Rules', free: false, basic: false, pro: false, enterprise: true }
          ]
        }
      ]);
    } catch (error) {
      console.error('Error fetching features:', error);
    } finally {
      setLoading(false);
    }
  };

  const plans = [
    {
      name: 'Free',
      price: '$0',
      description: 'For small teams getting started',
      color: 'bg-gray-100 dark:bg-gray-800',
      button: 'Start Free'
    },
    {
      name: 'Basic',
      price: '$10',
      description: 'Perfect for growing teams',
      color: 'bg-blue-100 dark:bg-blue-900',
      button: 'Upgrade to Basic'
    },
    {
      name: 'Pro',
      price: '$25',
      description: 'For professional HR teams',
      color: 'bg-purple-100 dark:bg-purple-900',
      button: 'Upgrade to Pro',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For large organizations',
      color: 'bg-indigo-100 dark:bg-indigo-900',
      button: 'Contact Sales'
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner className="h-8 w-8 text-primary-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Choose Your Plan
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Select the perfect plan for your HR management needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {plans.map((plan) => (
          <Card 
            key={plan.name} 
            className={`relative ${plan.color} overflow-hidden`}
          >
            {plan.popular && (
              <div className="absolute top-4 right-4">
                <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
                  Popular
                </span>
              </div>
            )}
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {plan.name}
              </h3>
              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  {plan.price}
                </span>
                {plan.price !== 'Custom' && (
                  <span className="text-gray-600 dark:text-gray-400">/user/month</span>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {plan.description}
              </p>
              <Button 
                variant={plan.popular ? 'default' : 'secondary'}
                className="w-full"
              >
                {plan.button}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <div className="space-y-8">
        {features.map((category) => (
          <Card key={category.category} className="overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                {category.category}
              </h3>
              <div className="relative overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white">
                        Feature
                      </th>
                      {plans.map((plan) => (
                        <th key={plan.name} className="text-center py-4 px-6 font-semibold text-gray-900 dark:text-white">
                          {plan.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {category.features.map((feature, index) => (
                      <tr 
                        key={feature.name}
                        className={`border-b border-gray-200 dark:border-gray-700 ${
                          index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800' : ''
                        }`}
                      >
                        <td className="py-4 px-6 text-gray-900 dark:text-white">
                          {feature.name}
                        </td>
                        <td className="text-center py-4 px-6">
                          {feature.free ? (
                            <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                          ) : (
                            <FontAwesomeIcon icon={faTimes} className="text-red-500" />
                          )}
                        </td>
                        <td className="text-center py-4 px-6">
                          {feature.basic ? (
                            <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                          ) : (
                            <FontAwesomeIcon icon={faTimes} className="text-red-500" />
                          )}
                        </td>
                        <td className="text-center py-4 px-6">
                          {feature.pro ? (
                            <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                          ) : (
                            <FontAwesomeIcon icon={faTimes} className="text-red-500" />
                          )}
                        </td>
                        <td className="text-center py-4 px-6">
                          {feature.enterprise ? (
                            <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                          ) : (
                            <FontAwesomeIcon icon={faTimes} className="text-red-500" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-12 bg-blue-50 dark:bg-blue-900 rounded-lg p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <FontAwesomeIcon icon={faInfoCircle} className="text-blue-600 dark:text-blue-400 text-2xl" />
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Need help choosing?
            </h4>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Our team is here to help you select the best plan for your organization's needs.
            </p>
            <Button variant="default">Contact Sales</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionFeatures;