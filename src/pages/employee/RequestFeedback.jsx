import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Card, Button, Input, Select, Loading, Spinner, Modal } from '../../components/ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faUser, faEnvelope, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const RequestFeedback = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [colleagues, setColleagues] = useState([]);
  const [formData, setFormData] = useState({
    recipient: '',
    subject: '',
    message: ''
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchColleagues();
  }, []);

  const fetchColleagues = async () => {
    setLoading(true);
    try {
      // Simulating API call to fetch colleagues
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Replace with actual API call
      const mockColleagues = [
        { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com' },
        { id: 3, name: 'Mike Johnson', email: 'mike.johnson@example.com' },
      ];
      setColleagues(mockColleagues);
    } catch (error) {
      console.error('Error fetching colleagues:', error);
    } finally {
      setLoading(false);
    }
  };

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
      // Simulating API call to submit feedback request
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Replace with actual API call
      console.log('Feedback request submitted:', formData);
      setSubmitted(true);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error submitting feedback request:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      recipient: '',
      subject: '',
      message: ''
    });
    setSubmitted(false);
    setIsModalOpen(false);
  };

  if (loading && colleagues.length === 0) {
    return <Loading />;
  }

  return (
    <Card className="bg-white dark:bg-gray-800 p-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        <FontAwesomeIcon icon={faComments} className="mr-2" />
        Request Feedback
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Select
            label="Recipient"
            name="recipient"
            value={formData.recipient}
            onChange={handleInputChange}
            required
            icon={faUser}
          >
            <option value="">Select a colleague</option>
            {colleagues.map(colleague => (
              <option key={colleague.id} value={colleague.email}>{colleague.name}</option>
            ))}
          </Select>
        </div>
        <div className="mb-4">
          <Input
            label="Subject"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            required
            icon={faEnvelope}
            placeholder="e.g., Feedback on recent project"
          />
        </div>
        <div className="mb-4">
          <Input
            label="Message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            required
            type="textarea"
            rows={4}
            placeholder="Specify areas you'd like feedback on..."
          />
        </div>
        <Button type="submit" variant="primary" className="w-full" disabled={loading}>
          {loading ? (
            <Spinner size="small" color="white" />
          ) : (
            <>
              <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
              Send Feedback Request
            </>
          )}
        </Button>
      </form>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Feedback Request Sent">
        <div className="p-4">
          <p className="text-green-600 dark:text-green-400 mb-4">
            Your feedback request has been sent successfully!
          </p>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            We'll notify you when {formData.recipient} responds to your request.
          </p>
          <Button variant="primary" onClick={resetForm} className="w-full">
            Request More Feedback
          </Button>
        </div>
      </Modal>
    </Card>
  );
};

export default RequestFeedback;