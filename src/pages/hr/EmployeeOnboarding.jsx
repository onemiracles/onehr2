import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Select, Spinner, Modal, Table, Progress } from '../../components/ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserPlus,
  faCheckCircle,
  faSpinner,
  faFileAlt,
  faClipboardList,
  faEnvelope,
  faLaptop,
  faIdCard,
  faBuilding,
  faUsers,
  faKey,
  faCalendarAlt,
  faListAlt,
  faExclamationTriangle,
  faEdit,
  faEye,
  faDownload,
  faTrash,
  faPlus
} from '@fortawesome/free-solid-svg-icons';

const EmployeeOnboarding = () => {
  const [loading, setLoading] = useState(true);
  const [onboardingList, setOnboardingList] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [selectedDocType, setSelectedDocType] = useState(null)
  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      startDate: '',
      department: '',
      position: '',
      manager: '',
    },
    documents: {
      identification: null,
      taxForms: null,
      bankDetails: null,
      contracts: null,
    },
    systemAccess: {
      email: false,
      slack: false,
      github: false,
      drive: false,
    },
    equipment: {
      laptop: false,
      phone: false,
      monitor: false,
      accessories: false,
    }
  });
  // Add to existing state declarations
  const [documentsList, setDocumentsList] = useState([
    {
      id: 1,
      name: 'Passport.pdf',
      type: 'Identification',
      status: 'verified',
      date: '2024-03-15',
      size: '2.4 MB',
      uploadedBy: 'HR Manager',
      metadata: {
        category: 'identification',
        expiryDate: '2029-03-15',
        documentNumber: 'P123456789'
      }
    },
    {
      id: 2,
      name: 'Employment_Contract.pdf',
      type: 'Contracts',
      status: 'pending',
      date: '2024-03-16',
      size: '1.8 MB',
      uploadedBy: 'HR Manager',
      metadata: {
        category: 'contracts',
        version: '1.0',
        signingDeadline: '2024-03-20'
      }
    },
    {
      id: 3,
      name: 'Tax_Form_W4.pdf',
      type: 'Tax Forms',
      status: 'verified',
      date: '2024-03-16',
      size: '890 KB',
      uploadedBy: 'Employee',
      metadata: {
        category: 'taxForms',
        taxYear: '2024',
        formType: 'W-4'
      }
    },
    {
      id: 4,
      name: 'Direct_Deposit_Form.pdf',
      type: 'Bank Details',
      status: 'pending',
      date: '2024-03-17',
      size: '650 KB',
      uploadedBy: 'Employee',
      metadata: {
        category: 'bankDetails',
        accountType: 'Checking',
        bankName: 'Example Bank'
      }
    }
  ]);

  useEffect(() => {
    fetchOnboardingData();
  }, []);

  const fetchOnboardingData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockData = [
        {
          id: 1,
          name: 'John Doe',
          position: 'Senior Developer',
          department: 'Engineering',
          startDate: '2024-04-01',
          status: 'in-progress',
          progress: 65,
          steps: {
            personalInfo: 'completed',
            documents: 'in-progress',
            systemAccess: 'pending',
            equipment: 'pending'
          }
        },
        {
          id: 2,
          name: 'Jane Smith',
          position: 'Product Manager',
          department: 'Product',
          startDate: '2024-04-15',
          status: 'pending',
          progress: 25,
          steps: {
            personalInfo: 'completed',
            documents: 'pending',
            systemAccess: 'pending',
            equipment: 'pending'
          }
        }
      ];
      setOnboardingList(mockData);
    } catch (error) {
      console.error('Error fetching onboarding data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const handlePreviousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleFileUpload = (section, field, file) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: file
      }
    }));
  };

  const handleSubmit = async () => {
    try {
      // Handle form submission
      setIsModalOpen(false);
      await fetchOnboardingData(); // Refresh the list
    } catch (error) {
      console.error('Error submitting onboarding data:', error);
    }
  };

  // Add document management functions
  const handleDocumentUpload = async (file) => {
    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newDocument = {
        id: Date.now(),
        name: file.name,
        type: selectedDocType,
        status: 'pending',
        date: new Date().toISOString().split('T')[0],
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        uploadedBy: 'Employee',
        metadata: {
          category: selectedDocType,
          uploadDate: new Date().toISOString()
        }
      };

      setDocumentsList(prev => [...prev, newDocument]);
      return newDocument;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  };

  const handleDocumentDelete = async (documentId) => {
    try {
      if (window.confirm('Are you sure you want to delete this document?')) {
        // Simulate delete request
        await new Promise(resolve => setTimeout(resolve, 500));
        setDocumentsList(prev => prev.filter(doc => doc.id !== documentId));
      }
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  const handleDocumentStatusChange = async (documentId, newStatus) => {
    try {
      // Simulate status update request
      await new Promise(resolve => setTimeout(resolve, 500));
      setDocumentsList(prev => 
        prev.map(doc => 
          doc.id === documentId 
            ? { ...doc, status: newStatus }
            : doc
        )
      );
    } catch (error) {
      console.error('Error updating document status:', error);
    }
  };

  // Update the ViewDocuments modal content
  const ViewDocuments = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Document Management
        </h3>
        <Button variant="primary" onClick={() => setModalContent('addDocument')}>
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Add Document
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {documentsList.map((doc) => (
          <div 
            key={doc.id} 
            className="bg-white dark:bg-gray-800 shadow rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary-50 dark:bg-primary-900 rounded">
                  <FontAwesomeIcon 
                    icon={faFileAlt} 
                    className="text-primary-600 dark:text-primary-400"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    {doc.name}
                  </h4>
                  <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>{doc.type}</span>
                    <span>•</span>
                    <span>{doc.size}</span>
                    <span>•</span>
                    <span>{doc.date}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  doc.status === 'verified'
                    ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                }`}>
                  {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                </span>
                <div className="flex space-x-2">
                  <Button 
                    variant="secondary"
                    size="small"
                    onClick={() => setModalContent({ type: 'viewDocument', data: doc })}
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </Button>
                  <Button 
                    variant="primary"
                    size="small"
                    // onClick={() => handleDocumentDownload(doc)}
                  >
                    <FontAwesomeIcon icon={faDownload} />
                  </Button>
                  <Button 
                    variant="danger"
                    size="small"
                    onClick={() => handleDocumentDelete(doc.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                </div>
              </div>
            </div>
            
            {doc.metadata && (
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  {Object.entries(doc.metadata).map(([key, value]) => (
                    <div key={key}>
                      <span className="text-gray-500 dark:text-gray-400 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                      </span>
                      <span className="ml-1 text-gray-900 dark:text-white">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
          Close
        </Button>
        <Button 
          variant="primary" 
          onClick={() => setModalContent('addDocument')}
        >
          Upload New Document
        </Button>
      </div>
    </div>
  );

  // Add document preview modal content
  const ViewDocumentDetails = ({ document }) => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {document.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Uploaded by {document.uploadedBy} on {document.date}
          </p>
        </div>
        <Select
          value={document.status}
          onChange={(e) => handleDocumentStatusChange(document.id, e.target.value)}
        >
          <option value="pending">Pending</option>
          <option value="verified">Verified</option>
          <option value="rejected">Rejected</option>
        </Select>
      </div>

      <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Document Details
        </h4>
        <dl className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-sm text-gray-500 dark:text-gray-400">Type</dt>
            <dd className="text-sm font-medium text-gray-900 dark:text-white">{document.type}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500 dark:text-gray-400">Size</dt>
            <dd className="text-sm font-medium text-gray-900 dark:text-white">{document.size}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500 dark:text-gray-400">Upload Date</dt>
            <dd className="text-sm font-medium text-gray-900 dark:text-white">{document.date}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500 dark:text-gray-400">Status</dt>
            <dd className="text-sm font-medium text-gray-900 dark:text-white capitalize">{document.status}</dd>
          </div>
        </dl>
      </div>

      {document.metadata && (
        <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Additional Information
          </h4>
          <dl className="grid grid-cols-2 gap-4">
            {Object.entries(document.metadata).map(([key, value]) => (
              <div key={key}>
                <dt className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </dt>
                <dd className="text-sm font-medium text-gray-900 dark:text-white">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      <div className="flex justify-end space-x-2">
        <Button variant="secondary" onClick={() => setModalContent('viewDocuments')}>
          Back to List
        </Button>
        <Button variant="primary" 
          // onClick={() => handleDocumentDownload(document)}
        >
          Download Document
        </Button>
      </div>
    </div>
  );

  const getStepIcon = (status) => {
    switch (status) {
      case 'completed':
        return <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />;
      case 'in-progress':
        return <FontAwesomeIcon icon={faSpinner} className="text-blue-500 animate-spin" />;
      default:
        return <FontAwesomeIcon icon={faExclamationTriangle} className="text-gray-400" />;
    }
  };

  const OnboardingProgress = ({ employee }) => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-gray-700 dark:text-gray-300">Overall Progress</span>
        <span className="text-gray-900 dark:text-white font-medium">{employee.progress}%</span>
      </div>
      <Progress value={employee.progress} color="primary" />
      
      <div className="mt-4 space-y-2">
        {Object.entries(employee.steps).map(([step, status]) => (
          <div key={step} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
            <div className="flex items-center">
              {getStepIcon(status)}
              <span className="ml-2 capitalize text-gray-700 dark:text-gray-300">
                {step.replace(/([A-Z])/g, ' $1').trim()}
              </span>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs capitalize ${
              status === 'completed' 
                ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                : status === 'in-progress'
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
            }`}>
              {status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  const PersonalInfoForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First Name"
          value={formData.personalInfo.firstName}
          onChange={(e) => handleInputChange('personalInfo', 'firstName', e.target.value)}
          required
        />
        <Input
          label="Last Name"
          value={formData.personalInfo.lastName}
          onChange={(e) => handleInputChange('personalInfo', 'lastName', e.target.value)}
          required
        />
      </div>
      <Input
        label="Email"
        type="email"
        value={formData.personalInfo.email}
        onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
        required
      />
      <Input
        label="Phone"
        value={formData.personalInfo.phone}
        onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
        required
      />
      <Input
        label="Start Date"
        type="date"
        value={formData.personalInfo.startDate}
        onChange={(e) => handleInputChange('personalInfo', 'startDate', e.target.value)}
        required
      />
      <Select
        label="Department"
        value={formData.personalInfo.department}
        onChange={(e) => handleInputChange('personalInfo', 'department', e.target.value)}
        required
      >
        <option value="">Select Department</option>
        <option value="Engineering">Engineering</option>
        <option value="Product">Product</option>
        <option value="Marketing">Marketing</option>
        <option value="Sales">Sales</option>
      </Select>
      <Input
        label="Position"
        value={formData.personalInfo.position}
        onChange={(e) => handleInputChange('personalInfo', 'position', e.target.value)}
        required
      />
      <Input
        label="Manager"
        value={formData.personalInfo.manager}
        onChange={(e) => handleInputChange('personalInfo', 'manager', e.target.value)}
        required
      />
    </div>
  );

  const DocumentsForm = () => (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6">
        <div className="space-y-4">
          {[
            { key: 'identification', label: 'Identification Documents' },
            { key: 'taxForms', label: 'Tax Forms' },
            { key: 'bankDetails', label: 'Bank Details' },
            { key: 'contracts', label: 'Employment Contracts' }
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faFileAlt} className="text-gray-400 mr-3" />
                <span className="text-gray-700 dark:text-gray-300">{label}</span>
              </div>
              <Input
                type="file"
                onChange={(e) => handleFileUpload('documents', key, e.target.files[0])}
                className="w-auto"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const SystemAccessForm = () => (
    <div className="space-y-4">
      {[
        { key: 'email', label: 'Email Account', icon: faEnvelope },
        { key: 'slack', label: 'Slack Access', icon: faUsers },
        { key: 'github', label: 'GitHub Access', icon: faLaptop },
        { key: 'drive', label: 'Drive Access', icon: faKey }
      ].map(({ key, label, icon }) => (
        <div key={key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded">
          <div className="flex items-center">
            <FontAwesomeIcon icon={icon} className="text-gray-400 mr-3" />
            <span className="text-gray-700 dark:text-gray-300">{label}</span>
          </div>
          <input
            type="checkbox"
            checked={formData.systemAccess[key]}
            onChange={(e) => handleInputChange('systemAccess', key, e.target.checked)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
        </div>
      ))}
    </div>
  );

  const EquipmentForm = () => (
    <div className="space-y-4">
      {[
        { key: 'laptop', label: 'Laptop' },
        { key: 'phone', label: 'Phone' },
        { key: 'monitor', label: 'Monitor' },
        { key: 'accessories', label: 'Accessories' }
      ].map(({ key, label }) => (
        <div key={key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faLaptop} className="text-gray-400 mr-3" />
            <span className="text-gray-700 dark:text-gray-300">{label}</span>
          </div>
          <input
            type="checkbox"
            checked={formData.equipment[key]}
            onChange={(e) => handleInputChange('equipment', key, e.target.checked)}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
        </div>
      ))}
    </div>
  );

  const renderModalContent = () => {
    if (!modalContent) return null;
  
    switch (modalContent.type) {
      case 'viewProgress':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Employee
                </label>
                <p className="text-gray-900 dark:text-white font-medium">
                  {modalContent.data.name}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Department
                </label>
                <p className="text-gray-900 dark:text-white font-medium">
                  {modalContent.data.department}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Start Date
                </label>
                <p className="text-gray-900 dark:text-white font-medium">
                  {modalContent.data.startDate}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Position
                </label>
                <p className="text-gray-900 dark:text-white font-medium">
                  {modalContent.data.position}
                </p>
              </div>
            </div>
  
            <OnboardingProgress employee={modalContent.data} />
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Onboarding Checklist
              </h4>
              <OnboardingChecklist />
            </div>
  
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Notifications
              </h4>
              <NotificationSettings />
            </div>
  
            <div className="flex justify-end space-x-2">
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Close
              </Button>
              <Button 
                variant="primary"
                onClick={() => {
                  setModalContent({ type: 'editOnboarding', data: modalContent.data });
                }}
              >
                Edit Onboarding
              </Button>
            </div>
          </div>
        );
  
      case 'editOnboarding':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {Object.entries(modalContent.data.steps).map(([step, status]) => (
                <Card key={step} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 capitalize">
                      {step.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <Select
                      value={status}
                      // onChange={(e) => handleStepStatusChange(step, e.target.value)}
                      className="w-32"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </Select>
                  </div>
                  <div className="mt-2">
                    <Progress 
                      value={
                        status === 'completed' ? 100 :
                        status === 'in-progress' ? 50 :
                        0
                      }
                      color={
                        status === 'completed' ? 'green' :
                        status === 'in-progress' ? 'primary' :
                        'gray'
                      }
                    />
                  </div>
                </Card>
              ))}
            </div>
  
            <div className="space-y-4">
              {currentStep === 1 && <PersonalInfoForm />}
              {currentStep === 2 && <DocumentsForm />}
              {currentStep === 3 && <SystemAccessForm />}
              {currentStep === 4 && <EquipmentForm />}
            </div>
  
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Additional Steps
              </h4>
              <div className="space-y-4">
                <Select
                  label="Current Step Focus"
                  value={currentStep}
                  onChange={(e) => setCurrentStep(Number(e.target.value))}
                >
                  <option value={1}>Personal Information</option>
                  <option value={2}>Documents</option>
                  <option value={3}>System Access</option>
                  <option value={4}>Equipment</option>
                </Select>
                
                <Input
                  type="textarea"
                  label="Notes"
                  placeholder="Add any additional notes or instructions..."
                  rows={3}
                />
              </div>
            </div>
  
            <div className="flex justify-end space-x-2">
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSubmit}>
                Save Changes
              </Button>
            </div>
          </div>
        );
  
      case 'addDocument':
        return (
          <div className="space-y-6">
            <Input
              type="file"
              label="Upload Document"
              onChange={(e) => handleFileUpload(e.target.files[0])}
            />
            <Select
              label="Document Type"
              value={selectedDocType}
              onChange={(e) => setSelectedDocType(e.target.value)}
            >
              <option value="identification">Identification</option>
              <option value="taxForms">Tax Forms</option>
              <option value="bankDetails">Bank Details</option>
              <option value="contracts">Contracts</option>
            </Select>
            <Input
              type="textarea"
              label="Notes"
              placeholder="Add any notes about this document..."
              rows={3}
            />
            <div className="flex justify-end space-x-2">
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleDocumentUpload}>
                Upload Document
              </Button>
            </div>
          </div>
        );
  
      case 'viewDocuments':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {documentsList.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded">
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faFileAlt} className="text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {doc.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {doc.type} • Uploaded on {doc.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="secondary" size="small">
                      <FontAwesomeIcon icon={faEye} />
                    </Button>
                    <Button variant="primary" size="small">
                      <FontAwesomeIcon icon={faDownload} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        );
  
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="large" color="primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Employee Onboarding
        </h2>
        <Button 
          variant="primary" 
          onClick={() => {
            setCurrentStep(1);
            setIsModalOpen(true);
          }}
        >
          <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
          Start New Onboarding
        </Button>
      </div>

      <Card className="bg-white dark:bg-gray-800">
        <div className="p-6">
          <Table
            headers={['Employee', 'Position', 'Start Date', 'Progress', 'Status', 'Actions']}
            data={onboardingList.map(employee => [
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{employee.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{employee.department}</p>
              </div>,
              employee.position,
              employee.startDate,
              <div className="w-full max-w-xs">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Progress</span>
                  <span className="text-gray-900 dark:text-white">{employee.progress}%</span>
                </div>
                <Progress value={employee.progress} color="primary" />
              </div>,
              <span className={`px-2 py-1 rounded-full text-xs ${
                employee.status === 'completed'
                  ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                  : employee.status === 'in-progress'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
              }`}>
                {employee.status.replace('-', ' ').charAt(0).toUpperCase() + 
                 employee.status.slice(1).replace('-', ' ')}
              </span>,
              <div className="flex space-x-2">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setModalContent({ type: 'viewProgress', data: employee });
                    setIsModalOpen(true);
                  }}
                >
                  <FontAwesomeIcon icon={faListAlt} />
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    setModalContent({ type: 'editOnboarding', data: employee });
                    setIsModalOpen(true);
                  }}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </Button>
              </div>
              ])}
              />
            </div>
          </Card>
    
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={modalContent ? getModalTitle(modalContent) : "New Employee Onboarding"}
          >
            {modalContent ? (
              renderModalContent()
            ) : (
              <div className="space-y-6">
                <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Onboarding Steps
                    </h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Step {currentStep} of 4
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    {[1, 2, 3, 4].map((step) => (
                      <React.Fragment key={step}>
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            step === currentStep
                              ? 'bg-primary-600 text-white'
                              : step < currentStep
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                          }`}>
                            {step < currentStep ? (
                              <FontAwesomeIcon icon={faCheckCircle} />
                            ) : (
                              step
                            )}
                          </div>
                          <span className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                            {getStepTitle(step)}
                          </span>
                        </div>
                        {step < 4 && (
                          <div className={`flex-1 h-1 mx-2 ${
                            step < currentStep
                              ? 'bg-green-500'
                              : 'bg-gray-200 dark:bg-gray-700'
                          }`} />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
    
                <div className="py-4">
                  {currentStep === 1 && <PersonalInfoForm />}
                  {currentStep === 2 && <DocumentsForm />}
                  {currentStep === 3 && <SystemAccessForm />}
                  {currentStep === 4 && <EquipmentForm />}
                </div>
    
                <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    variant="secondary"
                    onClick={handlePreviousStep}
                    disabled={currentStep === 1}
                  >
                    Previous
                  </Button>
                  {currentStep < 4 ? (
                    <Button variant="primary" onClick={handleNextStep}>
                      Next
                    </Button>
                  ) : (
                    <Button variant="primary" onClick={handleSubmit}>
                      Complete Onboarding
                    </Button>
                  )}
                </div>
              </div>
            )}
          </Modal>
        </div>
      );
    };
    
    // Helper functions
    const getStepTitle = (step) => {
      switch (step) {
        case 1:
          return 'Personal Info';
        case 2:
          return 'Documents';
        case 3:
          return 'System Access';
        case 4:
          return 'Equipment';
        default:
          return '';
      }
    };
    
    const getModalTitle = (modalContent) => {
      switch (modalContent.type) {
        case 'viewProgress':
          return `Onboarding Progress - ${modalContent.data.name}`;
        case 'editOnboarding':
          return `Edit Onboarding - ${modalContent.data.name}`;
        default:
          return 'New Employee Onboarding';
      }
    };
    
    const OnboardingChecklist = () => {
      const checklistItems = [
        { category: 'Pre-onboarding', items: [
          'Send offer letter',
          'Complete background check',
          'Process employment contract',
          'Schedule first day',
        ]},
        { category: 'First Day', items: [
          'Office tour',
          'Team introductions',
          'Setup workstation',
          'Security badge access',
        ]},
        { category: 'First Week', items: [
          'HR orientation',
          'IT systems training',
          'Department onboarding',
          'Team lunch',
        ]},
        { category: 'First Month', items: [
          'Complete required training',
          'Set initial goals',
          'Schedule check-ins',
          'Benefits enrollment',
        ]},
      ];
    
      return (
        <div className="space-y-6">
          {checklistItems.map((section, index) => (
            <div key={index} className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                {section.category}
              </h4>
              <div className="space-y-2">
                {section.items.map((item, itemIndex) => (
                  <div 
                    key={itemIndex}
                    className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded"
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-3 text-gray-700 dark:text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    };
    
    const NotificationSettings = () => {
      const [notifications, setNotifications] = useState({
        email: true,
        slack: true,
        managers: true,
        hr: true,
      });
    
      return (
        <div className="space-y-4">
          {Object.entries({
            email: 'Email Notifications',
            slack: 'Slack Notifications',
            managers: 'Notify Managers',
            hr: 'Notify HR Team',
          }).map(([key, label]) => (
            <div 
              key={key}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded"
            >
              <span className="text-gray-700 dark:text-gray-300">{label}</span>
              <input
                type="checkbox"
                checked={notifications[key]}
                onChange={(e) => setNotifications(prev => ({
                  ...prev,
                  [key]: e.target.checked
                }))}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
            </div>
          ))}
        </div>
      );
    };
    
    export default EmployeeOnboarding;