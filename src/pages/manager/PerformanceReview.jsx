import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Card, Button, Input, Select, Spinner, Modal, Table, Progress } from '../../components/ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faStar, faComment, faSave, faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';

const PerformanceReview = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentReview, setCurrentReview] = useState(null);
  const [formData, setFormData] = useState({
    performance: '',
    strengths: '',
    areasForImprovement: '',
    goals: '',
    overallRating: '',
    comments: '',
  });

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    setLoading(true);
    try {
      // Simulating API call to fetch team members
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Replace this with actual API call
      const mockTeamMembers = [
        { id: 1, name: 'John Doe', position: 'Software Engineer', lastReviewDate: '2023-12-15', performanceScore: 85 },
        { id: 2, name: 'Jane Smith', position: 'UX Designer', lastReviewDate: '2024-01-10', performanceScore: 92 },
        { id: 3, name: 'Mike Johnson', position: 'Product Manager', lastReviewDate: '2023-11-20', performanceScore: 78 },
      ];
      setTeamMembers(mockTeamMembers);
    } catch (error) {
      console.error('Error fetching team members:', error);
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

  const handleReviewClick = (member) => {
    setCurrentReview(member);
    setFormData({
      performance: '',
      strengths: '',
      areasForImprovement: '',
      goals: '',
      overallRating: '',
      comments: '',
    });
    setIsModalOpen(true);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simulating API call to submit review
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Replace this with actual API call
      console.log('Submitting review for:', currentReview.name, formData);
      // Update the team member's last review date
      setTeamMembers(teamMembers.map(member => 
        member.id === currentReview.id 
          ? { ...member, lastReviewDate: new Date().toISOString().split('T')[0] }
          : member
      ));
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && teamMembers.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="large" color="primary" />
      </div>
    );
  }

  return (
    <Card className="bg-white dark:bg-gray-800 p-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Review Team Performance</h2>

      <Table
        headers={['Name', 'Position', 'Last Review', 'Performance', 'Action']}
        data={teamMembers.map(member => [
          member.name,
          member.position,
          member.lastReviewDate,
          <Progress value={member.performanceScore} max={100} />,
          <Button variant="primary" onClick={() => handleReviewClick(member)}>
            <FontAwesomeIcon icon={faStar} className="mr-2" />
            Review
          </Button>
        ])}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Review for ${currentReview?.name}`}>
        <form onSubmit={handleSubmitReview} className="space-y-4">
          <Input
            label="Performance Summary"
            name="performance"
            value={formData.performance}
            onChange={handleInputChange}
            required
            type="textarea"
            rows={3}
          />
          <Input
            label="Strengths"
            name="strengths"
            value={formData.strengths}
            onChange={handleInputChange}
            required
            type="textarea"
            rows={2}
          />
          <Input
            label="Areas for Improvement"
            name="areasForImprovement"
            value={formData.areasForImprovement}
            onChange={handleInputChange}
            required
            type="textarea"
            rows={2}
          />
          <Input
            label="Goals for Next Period"
            name="goals"
            value={formData.goals}
            onChange={handleInputChange}
            required
            type="textarea"
            rows={2}
          />
          <Select
            label="Overall Rating"
            name="overallRating"
            value={formData.overallRating}
            onChange={handleInputChange}
            required
            options={[
              { value: '5', label: 'Excellent' },
              { value: '4', label: 'Very Good' },
              { value: '3', label: 'Good' },
              { value: '2', label: 'Needs Improvement' },
              { value: '1', label: 'Unsatisfactory' },
            ]}
          />
          <Input
            label="Additional Comments"
            name="comments"
            value={formData.comments}
            onChange={handleInputChange}
            type="textarea"
            rows={3}
          />
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              <FontAwesomeIcon icon={faTimes} className="mr-2" />
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              <FontAwesomeIcon icon={faSave} className="mr-2" />
              Submit Review
            </Button>
          </div>
        </form>
      </Modal>
    </Card>
  );
};

export default PerformanceReview;