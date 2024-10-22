import React, { useState, useEffect } from 'react';
import { Card, Checkbox, Button, Input, Select, Spinner, Modal, Table, Progress } from '../../components/ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMoneyBillWave,
  faCalculator,
  faCheckCircle,
  faTimesCircle,
  faClock,
  faFileInvoiceDollar,
  faExclamationTriangle,
  faSpinner,
  faChevronRight,
  faChevronLeft,
  faSave
} from '@fortawesome/free-solid-svg-icons';

const PayrollProcess = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [payrollData, setPayrollData] = useState(null);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [verificationResults, setVerificationResults] = useState(null);
  const [payrollSummary, setPayrollSummary] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  useEffect(() => {
    fetchPayrollData();
  }, []);

  const fetchPayrollData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockData = {
        payPeriod: 'March 2024',
        employees: [
          {
            id: 1,
            name: 'John Doe',
            position: 'Senior Developer',
            baseSalary: 95000,
            hoursWorked: 168,
            overtime: 8,
            deductions: 2500,
            benefits: 1500,
            status: 'pending'
          },
          {
            id: 2,
            name: 'Jane Smith',
            position: 'Product Manager',
            baseSalary: 105000,
            hoursWorked: 160,
            overtime: 0,
            deductions: 2800,
            benefits: 1800,
            status: 'pending'
          },
        ]
      };
      setPayrollData(mockData);
    } catch (error) {
      console.error('Error fetching payroll data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculatePayroll = (employee) => {
    const hourlyRate = employee.baseSalary / (52 * 40);
    const regularPay = hourlyRate * employee.hoursWorked;
    const overtimePay = (hourlyRate * 1.5) * employee.overtime;
    const grossPay = regularPay + overtimePay;
    const taxRate = 0.25; // Example tax rate
    const taxes = grossPay * taxRate;
    const netPay = grossPay - taxes - employee.deductions + employee.benefits;

    return {
      ...employee,
      regularPay,
      overtimePay,
      grossPay,
      taxes,
      netPay
    };
  };

  const verifyPayrollData = () => {
    const errors = [];
    const warnings = [];

    payrollData.employees.forEach(emp => {
      if (emp.hoursWorked > 200) {
        errors.push(`Excessive hours for ${emp.name}: ${emp.hoursWorked}`);
      }
      if (emp.overtime > 20) {
        warnings.push(`High overtime for ${emp.name}: ${emp.overtime} hours`);
      }
    });

    return { errors, warnings };
  };

  const handleEmployeeSelection = (employeeId) => {
    setSelectedEmployees(prev => {
      if (prev.includes(employeeId)) {
        return prev.filter(id => id !== employeeId);
      }
      return [...prev, employeeId];
    });
  };

  const handleSelectAll = () => {
    if (selectedEmployees.length === payrollData.employees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(payrollData.employees.map(emp => emp.id));
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      const results = verifyPayrollData();
      setVerificationResults(results);
    } else if (currentStep === 2) {
      const summary = payrollData.employees
        .filter(emp => selectedEmployees.includes(emp.id))
        .map(calculatePayroll);
      setPayrollSummary(summary);
    }
    setCurrentStep(prev => prev + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleProcessPayroll = async () => {
    setProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsConfirmModalOpen(true);
    } catch (error) {
      console.error('Error processing payroll:', error);
    } finally {
      setProcessing(false);
    }
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
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
          {step < 3 && (
            <div className={`w-24 h-1 ${
              step < currentStep
                ? 'bg-green-500'
                : 'bg-gray-200 dark:bg-gray-700'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="large" color="primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white dark:bg-gray-800 p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Process Payroll - {payrollData.payPeriod}
        </h2>
        <StepIndicator />

        {currentStep === 1 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Select Employees
            </h3>
            <Table
              headers={[
                <Checkbox
                  checked={selectedEmployees.length === payrollData.employees.length}
                  onChange={handleSelectAll}
                />,
                'Employee',
                'Position',
                'Hours Worked',
                'Overtime',
                'Status'
              ]}
              data={payrollData.employees.map(emp => [
                <Checkbox
                  checked={selectedEmployees.includes(emp.id)}
                  onChange={() => handleEmployeeSelection(emp.id)}
                />,
                emp.name,
                emp.position,
                emp.hoursWorked,
                emp.overtime,
                <span className={`px-2 py-1 rounded-full text-xs ${
                  emp.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {emp.status}
                </span>
              ])}
            />
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Verify Data
            </h3>
            {verificationResults && (
              <div className="space-y-4">
                {verificationResults.errors.length > 0 && (
                  <div className="bg-red-50 dark:bg-red-900 p-4 rounded-lg">
                    <h4 className="text-red-800 dark:text-red-200 font-medium mb-2">Errors</h4>
                    <ul className="list-disc pl-4">
                      {verificationResults.errors.map((error, index) => (
                        <li key={index} className="text-red-600 dark:text-red-300">{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {verificationResults.warnings.length > 0 && (
                  <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg">
                    <h4 className="text-yellow-800 dark:text-yellow-200 font-medium mb-2">Warnings</h4>
                    <ul className="list-disc pl-4">
                      {verificationResults.warnings.map((warning, index) => (
                        <li key={index} className="text-yellow-600 dark:text-yellow-300">{warning}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Review and Process
            </h3>
            {payrollSummary && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="bg-primary-50 dark:bg-primary-900 p-4">
                    <h4 className="text-primary-800 dark:text-primary-200 text-sm font-medium">
                      Total Gross Pay
                    </h4>
                    <p className="text-2xl font-bold text-primary-900 dark:text-primary-100">
                      ${payrollSummary.reduce((sum, emp) => sum + emp.grossPay, 0).toLocaleString()}
                    </p>
                  </Card>
                  <Card className="bg-secondary-50 dark:bg-secondary-900 p-4">
                    <h4 className="text-secondary-800 dark:text-secondary-200 text-sm font-medium">
                      Total Net Pay
                    </h4>
                    <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                      ${payrollSummary.reduce((sum, emp) => sum + emp.netPay, 0).toLocaleString()}
                    </p>
                  </Card>
                  <Card className="bg-primary-50 dark:bg-primary-900 p-4">
                    <h4 className="text-primary-800 dark:text-primary-200 text-sm font-medium">
                      Total Taxes
                    </h4>
                    <p className="text-2xl font-bold text-primary-900 dark:text-primary-100">
                      ${payrollSummary.reduce((sum, emp) => sum + emp.taxes, 0).toLocaleString()}
                    </p>
                  </Card>
                  <Card className="bg-secondary-50 dark:bg-secondary-900 p-4">
                    <h4 className="text-secondary-800 dark:text-secondary-200 text-sm font-medium">
                      Employees
                    </h4>
                    <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                      {payrollSummary.length}
                    </p>
                  </Card>
                </div>

                <Table
                  headers={['Employee', 'Regular Pay', 'Overtime Pay', 'Deductions', 'Net Pay']}
                  data={payrollSummary.map(emp => [
                    emp.name,
                    `$${emp.regularPay.toLocaleString()}`,
                    `$${emp.overtimePay.toLocaleString()}`,
                    `$${emp.deductions.toLocaleString()}`,
                    `$${emp.netPay.toLocaleString()}`
                  ])}
                />
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between mt-6">
          {currentStep > 1 && (
            <Button variant="secondary" onClick={handlePreviousStep}>
              <FontAwesomeIcon icon={faChevronLeft} className="mr-2" />
              Previous
            </Button>
          )}
          {currentStep < 3 ? (
            <Button 
              variant="primary" 
              onClick={handleNextStep}
              disabled={currentStep === 1 && selectedEmployees.length === 0}
            >
              Next
              <FontAwesomeIcon icon={faChevronRight} className="ml-2" />
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleProcessPayroll}
              disabled={processing || verificationResults?.errors.length > 0}
            >
              {processing ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faMoneyBillWave} className="mr-2" />
                  Process Payroll
                </>
              )}
            </Button>
          )}
        </div>
      </Card>

      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title="Payroll Processing Complete"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-center text-green-500 text-6xl mb-4">
            <FontAwesomeIcon icon={faCheckCircle} />
          </div>
          <p className="text-center text-gray-600 dark:text-gray-300">
            Payroll has been successfully processed for {payrollSummary?.length} employees.
          </p>
          <div className="flex justify-center space-x-4 mt-6">
            <Button variant="secondary" onClick={() => setIsConfirmModalOpen(false)}>
              Close
            </Button>
            <Button variant="primary">
              <FontAwesomeIcon icon={faFileInvoiceDollar} className="mr-2" />
              View Reports
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PayrollProcess;