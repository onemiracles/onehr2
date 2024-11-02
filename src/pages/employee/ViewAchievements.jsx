import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Card, Button, Loading, Modal } from '../../components/ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faMedal, faCertificate, faAward, faSearch } from '@fortawesome/free-solid-svg-icons';

const AchievementCard = ({ achievement, onView }) => (
  <Card className="mb-4 p-4 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
    <div className="flex items-center">
      <div className={`p-3 rounded-full ${achievement.color} text-white mr-4`}>
        <FontAwesomeIcon icon={achievement.icon} className="text-2xl" />
      </div>
      <div className="flex-grow">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{achievement.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">{achievement.date}</p>
      </div>
      <Button variant="secondary" onClick={() => onView(achievement)}>
        <FontAwesomeIcon icon={faSearch} className="mr-2" />
        View
      </Button>
    </div>
  </Card>
);

const ViewAchievements = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [achievements, setAchievements] = useState([]);
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    setLoading(true);
    try {
      // Simulating API call to fetch achievements
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Replace with actual API call
      const mockAchievements = [
        { id: 1, title: 'Employee of the Month', date: 'June 2024', icon: faTrophy, color: 'bg-yellow-500', description: 'Recognized for outstanding performance and dedication to the team.' },
        { id: 2, title: '5 Year Service Award', date: 'March 2024', icon: faMedal, color: 'bg-blue-500', description: 'Celebrating 5 years of valuable contribution to the company.' },
        { id: 3, title: 'Innovation Award', date: 'December 2023', icon: faAward, color: 'bg-purple-500', description: 'Awarded for developing a new process that increased efficiency by 30%.' },
        { id: 4, title: 'Leadership Certification', date: 'September 2023', icon: faCertificate, color: 'bg-green-500', description: 'Successfully completed the Advanced Leadership Training Program.' },
      ];
      setAchievements(mockAchievements);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewAchievement = (achievement) => {
    setSelectedAchievement(achievement);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAchievement(null);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Your Achievements</h1>
      
      {achievements.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300">No achievements found. Keep up the great work!</p>
        </Card>
      ) : (
        achievements.map(achievement => (
          <AchievementCard 
            key={achievement.id} 
            achievement={achievement} 
            onView={handleViewAchievement} 
          />
        ))
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal} title="Achievement Details">
        {selectedAchievement && (
          <div className="p-4">
            <div className={`p-4 rounded-full ${selectedAchievement.color} text-white mb-4 inline-block`}>
              <FontAwesomeIcon icon={selectedAchievement.icon} className="text-4xl" />
            </div>
            <h2 className="text-2xl font-bold mb-2">{selectedAchievement.title}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{selectedAchievement.date}</p>
            <p className="text-gray-800 dark:text-gray-200">{selectedAchievement.description}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ViewAchievements;