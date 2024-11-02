import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Card, Button, Table, Loading, Modal } from '../../components/ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faDownload, faEye } from '@fortawesome/free-solid-svg-icons';

const ViewPayslips = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [payslips, setPayslips] = useState([]);
  const [selectedPayslip, setSelectedPayslip] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchPayslips();
  }, []);

  const fetchPayslips = async () => {
    setLoading(true);
    try {
      // Simulating API call to fetch payslips
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Replace with actual API call
      const mockPayslips = [
        { id: 1, date: '2024-03-31', grossPay: 5000, netPay: 3800, status: 'Paid' },
        { id: 2, date: '2024-02-29', grossPay: 5000, netPay: 3800, status: 'Paid' },
        { id: 3, date: '2024-01-31', grossPay: 5000, netPay: 3800, status: 'Paid' },
        { id: 4, date: '2023-12-31', grossPay: 5000, netPay: 3800, status: 'Paid' },
      ];
      setPayslips(mockPayslips);
    } catch (error) {
      console.error('Error fetching payslips:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (payslip) => {
    setSelectedPayslip(payslip);
    setIsModalOpen(true);
  };

  const handleDownload = (payslip) => {
    // Implement payslip download logic here
    console.log('Downloading payslip:', payslip);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPayslip(null);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Card className="bg-primary-50 p-6">
      <h2 className="dark:text-white text-2xl font-bold text-primary-800 mb-6">
        <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
        Your Payslips
      </h2>
      <Table
        headers={['Date', 'Gross Pay', 'Net Pay', 'Status', 'Actions']}
        data={payslips.map((payslip) => [
          payslip.date,
          `$${payslip.grossPay.toFixed(2)}`,
          `$${payslip.netPay.toFixed(2)}`,
          payslip.status,
          <div key={payslip.id} className="flex space-x-2">
            <Button
              variant="secondary"
              onClick={() => handleViewDetails(payslip)}
              className="text-sm"
            >
              <FontAwesomeIcon icon={faEye} className="mr-1" /> View
            </Button>
            <Button
              variant="primary"
              onClick={() => handleDownload(payslip)}
              className="text-sm"
            >
              <FontAwesomeIcon icon={faDownload} className="mr-1" /> Download
            </Button>
          </div>
        ])}
      />

      <Modal isOpen={isModalOpen} onClose={closeModal} title="Payslip Details">
        {selectedPayslip && (
          <div className='dark:text-white'>
            <p><strong>Date:</strong> {selectedPayslip.date}</p>
            <p><strong>Gross Pay:</strong> ${selectedPayslip.grossPay.toFixed(2)}</p>
            <p><strong>Net Pay:</strong> ${selectedPayslip.netPay.toFixed(2)}</p>
            <p><strong>Status:</strong> {selectedPayslip.status}</p>
            {/* Add more payslip details here */}
          </div>
        )}
      </Modal>
    </Card>
  );
};

export default ViewPayslips;