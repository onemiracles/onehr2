import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Select, Loading, Switch } from '../../components/ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLayerGroup,
  faSave,
  faUndo,
  faPlus,
  faTrash,
  faEdit,
  faInfoCircle,
  faSearch,
  faFilter,
} from '@fortawesome/free-solid-svg-icons';

const FeatureManagement = () => {
  const [loading, setLoading] = useState(true);
  const [features, setFeatures] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState(null);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    setLoading(true);
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockFeatures = [
        {
          id: 1,
          name: 'employee_management',
          displayName: 'Employee Management',
          description: 'Basic employee profile management',
          category: 'Core',
          plans: {
            free: true,
            basic: true,
            pro: true,
            enterprise: true
          },
          limits: {
            free: { maxEmployees: 10 },
            basic: { maxEmployees: 50 },
            pro: { maxEmployees: 200 },
            enterprise: { maxEmployees: null }
          }
        },
        {
          id: 2,
          name: 'attendance_tracking',
          displayName: 'Attendance Tracking',
          description: 'Time and attendance management',
          category: 'Core',
          plans: {
            free: true,
            basic: true,
            pro: true,
            enterprise: true
          },
          limits: {
            free: { maxDays: 30 },
            basic: { maxDays: 90 },
            pro: { maxDays: 365 },
            enterprise: { maxDays: null }
          }
        },
        {
          id: 3,
          name: 'performance_reviews',
          displayName: 'Performance Reviews',
          description: 'Employee performance management',
          category: 'HR',
          plans: {
            free: false,
            basic: false,
            pro: true,
            enterprise: true
          },
          limits: {
            pro: { reviewCycles: 2 },
            enterprise: { reviewCycles: null }
          }
        },
        // Add more features...
      ];

      setFeatures(mockFeatures);
      const uniqueCategories = [...new Set(mockFeatures.map(f => f.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching features:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFeatureToggle = (featureId, plan) => {
    setFeatures(features.map(feature => {
      if (feature.id === featureId) {
        return {
          ...feature,
          plans: {
            ...feature.plans,
            [plan]: !feature.plans[plan]
          }
        };
      }
      return feature;
    }));
    setUnsavedChanges(true);
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    try {
      // Simulating API call to save changes
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUnsavedChanges(false);
      // Show success message
    } catch (error) {
      console.error('Error saving changes:', error);
      // Show error message
    } finally {
      setLoading(false);
    }
  };

  const handleAddFeature = () => {
    setEditingFeature({
      name: '',
      displayName: '',
      description: '',
      category: categories[0],
      plans: {
        free: false,
        basic: false,
        pro: false,
        enterprise: false
      },
      limits: {}
    });
    setIsModalOpen(true);
  };

  const handleEditFeature = (feature) => {
    setEditingFeature({ ...feature });
    setIsModalOpen(true);
  };

  const handleSaveFeature = async () => {
    setLoading(true);
    try {
      // Simulating API call to save feature
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (editingFeature.id) {
        setFeatures(features.map(f => f.id === editingFeature.id ? editingFeature : f));
      } else {
        const newFeature = {
          ...editingFeature,
          id: features.length + 1
        };
        setFeatures([...features, newFeature]);
      }
      
      setIsModalOpen(false);
      setEditingFeature(null);
    } catch (error) {
      console.error('Error saving feature:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFeatures = features.filter(feature => {
    const matchesCategory = selectedCategory === 'all' || feature.category === selectedCategory;
    const matchesSearch = 
      feature.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feature.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const FeatureModal = () => (
    <form onSubmit={(e) => { e.preventDefault(); handleSaveFeature(); }} className="space-y-4">
      <Input
        label="Feature Name (System)"
        value={editingFeature.name}
        onChange={(e) => setEditingFeature({ ...editingFeature, name: e.target.value })}
        required
      />
      <Input
        label="Display Name"
        value={editingFeature.displayName}
        onChange={(e) => setEditingFeature({ ...editingFeature, displayName: e.target.value })}
        required
      />
      <Input
        label="Description"
        value={editingFeature.description}
        onChange={(e) => setEditingFeature({ ...editingFeature, description: e.target.value })}
        required
        type="textarea"
      />
      <Select
        label="Category"
        value={editingFeature.category}
        onChange={(e) => setEditingFeature({ ...editingFeature, category: e.target.value })}
        required
      >
        {categories.map(category => (
          <option key={category} value={category}>{category}</option>
        ))}
      </Select>
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
          Available in Plans
        </label>
        <div className="space-y-2">
          {Object.keys(editingFeature.plans).map(plan => (
            <div key={plan} className="flex items-center">
              <Switch
                checked={editingFeature.plans[plan]}
                onCheckedChange={(checked) => setEditingFeature({
                  ...editingFeature,
                  plans: { ...editingFeature.plans, [plan]: checked }
                })}
              />
              <span className="ml-2 capitalize">{plan}</span>
            </div>
          ))}
        </div>
      </div>
    </form>
  );

  if (loading && features.length === 0) {
    return (
      <Loading />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Feature Management
        </h1>
        <div className="flex space-x-4">
          {unsavedChanges && (
            <Button variant="secondary" onClick={() => fetchFeatures()}>
              <FontAwesomeIcon icon={faUndo} className="mr-2" />
              Reset Changes
            </Button>
          )}
          <Button
            variant="primary"
            onClick={handleSaveChanges}
            disabled={!unsavedChanges}
          >
            <FontAwesomeIcon icon={faSave} className="mr-2" />
            Save Changes
          </Button>
          <Button variant="primary" onClick={handleAddFeature}>
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add Feature
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6 space-x-4">
        <div className="flex-1">
          <Input
            placeholder="Search features..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={faSearch}
          />
        </div>
        <Select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-48"
          icon={faFilter}
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </Select>
      </div>

      <Card className="overflow-hidden">
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Feature
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Free
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Basic
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Pro
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Enterprise
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                {filteredFeatures.map((feature) => (
                  <tr key={feature.id}>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {feature.displayName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {feature.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {feature.category}
                    </td>
                    {['free', 'basic', 'pro', 'enterprise'].map((plan) => (
                      <td key={plan} className="px-6 py-4 text-center">
                        <Switch
                          checked={feature.plans[plan]}
                          onCheckedChange={() => handleFeatureToggle(feature.id, plan)}
                        />
                      </td>
                    ))}
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => handleEditFeature(feature)}
                      >
                        <FontAwesomeIcon icon={faEdit} className="mr-2" />
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingFeature(null);
        }}
        title={editingFeature?.id ? "Edit Feature" : "Add New Feature"}
      >
        <FeatureModal />
      </Modal>
    </div>
  );
};

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {title}
            </h3>
            {children}
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex justify-end space-x-2">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => {
              // Submit form
              const form = document.querySelector('form');
              form.dispatchEvent(new Event('submit', { cancelable: true }));
            }}>
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureManagement;