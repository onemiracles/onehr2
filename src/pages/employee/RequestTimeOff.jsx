import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Card, Button, Input, Select, Spinner } from '../../components/ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faClock, faComment } from '@fortawesome/free-solid-svg-icons';

const RequestTimeOff = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    leaveType: '',
    comments: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const leaveTypes = [
    { value: 'vacation', label: 'Vacation' },
    { value: 'sick', label: 'Sick Leave' },
    { value: 'personal', label: 'Personal Leave' },
    { value: 'bereavement', label: 'Bereavement' },
    { value: 'unpaid', label: 'Unpaid Leave' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simulating API call to submit time off request
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Replace with actual API call
      console.log('Time off request submitted:', formData);
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting time off request:', error);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Card className="bg-green-50 p-6">
        <h2 className="text-2xl font-bold text-green-800 mb-4">Request Submitted Successfully!</h2>
        <p className="text-gray-600 mb-4">Your time off request has been submitted for approval. You will be notified once it's reviewed.</p>
        <Button variant="primary" onClick={() => setSubmitted(false)}>Submit Another Request</Button>
      </Card>
    );
  }

  return (
    <Card className="bg-primary-50 p-6">
      <h2 className="dark:text-white text-2xl font-bold text-primary-800 mb-6">
        <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
        Request Time Off
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Input
            label="Start Date"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleInputChange}
            required
            icon={faCalendarAlt}
          />
          <Input
            label="End Date"
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={handleInputChange}
            required
            icon={faCalendarAlt}
          />
        </div>
        <div className="mb-4">
          <Select
            label="Leave Type"
            name="leaveType"
            value={formData.leaveType}
            onChange={handleInputChange}
            required
            options={leaveTypes}
            icon={faClock}
          />
        </div>
        <div className="mb-4">
          <Input
            label="Comments"
            name="comments"
            type="textarea"
            value={formData.comments}
            onChange={handleInputChange}
            icon={faComment}
          />
        </div>
        <Button type="submit" variant="primary" className="w-full" disabled={loading}>
          {loading ? (
            <Spinner size="small" color="white" />
          ) : (
            <>
              <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
              Submit Request
            </>
          )}
        </Button>
      </form>
    </Card>
  );
};

export default RequestTimeOff;