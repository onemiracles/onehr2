import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Card, Button, Input, Spinner } from '../components/ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faEnvelope, 
  faPhone, 
  faBriefcase,
  faCalendarAlt,
  faLock,
  faIdCard,
  faMapMarkerAlt,
  faLanguage,
  faKey
} from '@fortawesome/free-solid-svg-icons';

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProfileData({
        personalInfo: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '+1 (555) 123-4567',
          dateOfBirth: '1990-05-15',
          gender: 'Male',
          address: '123 Main St, City, Country',
          languages: ['English', 'Spanish']
        },
        employmentInfo: {
          employeeId: 'EMP001',
          department: 'Engineering',
          position: 'Senior Developer',
          joinDate: '2022-03-15',
          reportingTo: 'Jane Manager',
          workLocation: 'Remote',
          employmentType: 'Full-time'
        },
        skills: [
          'React', 'Node.js', 'TypeScript', 'AWS', 'Docker'
        ],
        emergencyContact: {
          name: 'Jane Doe',
          relationship: 'Spouse',
          phone: '+1 (555) 987-6543'
        }
      });
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEditMode(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="large" color="primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          My Profile
        </h1>
        <div className="space-x-4">
          {editMode ? (
            <>
              <Button 
                variant="secondary" 
                onClick={() => setEditMode(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? <Spinner size="small" color="white" /> : 'Save Changes'}
              </Button>
            </>
          ) : (
            <Button 
              variant="primary" 
              onClick={() => setEditMode(true)}
            >
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Summary Card */}
        <Card className="lg:col-span-1 bg-white dark:bg-gray-800">
          <div className="p-6 text-center">
            <div className="w-32 h-32 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mx-auto mb-4">
              <FontAwesomeIcon 
                icon={faUser} 
                className="text-4xl text-primary-600 dark:text-primary-400" 
              />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {`${profileData.personalInfo.firstName} ${profileData.personalInfo.lastName}`}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {profileData.employmentInfo.position}
            </p>
            <div className="flex justify-center space-x-2">
              <Button variant="secondary" size="small">
                <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                Message
              </Button>
              <Button variant="secondary" size="small">
                <FontAwesomeIcon icon={faPhone} className="mr-2" />
                Call
              </Button>
            </div>
          </div>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card className="bg-white dark:bg-gray-800">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  value={profileData.personalInfo.firstName}
                  disabled={!editMode}
                  icon={faUser}
                />
                <Input
                  label="Last Name"
                  value={profileData.personalInfo.lastName}
                  disabled={!editMode}
                  icon={faUser}
                />
                <Input
                  label="Email"
                  value={profileData.personalInfo.email}
                  disabled={!editMode}
                  icon={faEnvelope}
                />
                <Input
                  label="Phone"
                  value={profileData.personalInfo.phone}
                  disabled={!editMode}
                  icon={faPhone}
                />
                <Input
                  label="Date of Birth"
                  value={profileData.personalInfo.dateOfBirth}
                  type="date"
                  disabled={!editMode}
                  icon={faCalendarAlt}
                />
                <Input
                  label="Address"
                  value={profileData.personalInfo.address}
                  disabled={!editMode}
                  icon={faMapMarkerAlt}
                />
              </div>
            </div>
          </Card>

          {/* Employment Information */}
          <Card className="bg-white dark:bg-gray-800">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Employment Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Employee ID"
                  value={profileData.employmentInfo.employeeId}
                  disabled
                  icon={faIdCard}
                />
                <Input
                  label="Department"
                  value={profileData.employmentInfo.department}
                  disabled={!editMode}
                  icon={faBriefcase}
                />
                <Input
                  label="Position"
                  value={profileData.employmentInfo.position}
                  disabled={!editMode}
                  icon={faBriefcase}
                />
                <Input
                  label="Join Date"
                  value={profileData.employmentInfo.joinDate}
                  type="date"
                  disabled
                  icon={faCalendarAlt}
                />
                <Input
                  label="Reporting To"
                  value={profileData.employmentInfo.reportingTo}
                  disabled
                  icon={faUser}
                />
                <Input
                  label="Work Location"
                  value={profileData.employmentInfo.workLocation}
                  disabled={!editMode}
                  icon={faMapMarkerAlt}
                />
              </div>
            </div>
          </Card>

          {/* Skills */}
          <Card className="bg-white dark:bg-gray-800">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Skills & Expertise
              </h3>
              <div className="flex flex-wrap gap-2">
                {profileData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200"
                  >
                    {skill}
                  </span>
                ))}
                {editMode && (
                  <Button variant="secondary" size="small">
                    + Add Skill
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* Emergency Contact */}
          <Card className="bg-white dark:bg-gray-800">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Emergency Contact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Contact Name"
                  value={profileData.emergencyContact.name}
                  disabled={!editMode}
                  icon={faUser}
                />
                <Input
                  label="Relationship"
                  value={profileData.emergencyContact.relationship}
                  disabled={!editMode}
                  icon={faUser}
                />
                <Input
                  label="Contact Phone"
                  value={profileData.emergencyContact.phone}
                  disabled={!editMode}
                  icon={faPhone}
                />
              </div>
            </div>
          </Card>

          {/* Account Security */}
          <Card className="bg-white dark:bg-gray-800">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Account Security
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Password
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Last changed 30 days ago
                    </p>
                  </div>
                  <Button variant="secondary">
                    <FontAwesomeIcon icon={faKey} className="mr-2" />
                    Change Password
                  </Button>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Two-Factor Authentication
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Enhance your account security
                    </p>
                  </div>
                  <Button variant="secondary">
                    <FontAwesomeIcon icon={faLock} className="mr-2" />
                    Enable 2FA
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;