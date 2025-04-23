import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InternshipListing from './InternshipListing';
import ApplicationHistory from './ApplicationHistory';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 30px;

  h1 {
    font-size: 2rem;
    color: #2c3e50;
    margin-bottom: 20px;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 2px solid #e0e0e0;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    flex-wrap: wrap;
  }
`;

const TabButton = styled.button`
  padding: 10px 20px;
  margin-right: 10px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  color: ${props => props.$active ? '#3498db' : '#7f8c8d'};
  transition: all 0.3s ease;
  position: relative;
  font-weight: ${props => props.$active ? '600' : '500'};

  &:hover {
    color: #3498db;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: ${props => props.$active ? '#3498db' : 'transparent'};
  }

  @media (max-width: 768px) {
    padding: 8px 15px;
    margin-bottom: 10px;
  }
`;

const LoadingDiv = styled.div`
  text-align: center;
  padding: 20px;
  font-size: 1.1rem;
`;

const ErrorDiv = styled.div`
  color: #e74c3c;
  background-color: #fadbd8;
  border-radius: 5px;
  padding: 15px;
`;

const Content = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const ProfileSection = styled.div`
  padding: 20px;

  h2 {
    margin-top: 0;
    margin-bottom: 20px;
    font-size: 1.5rem;
    color: #2c3e50;
    border-bottom: 2px solid #3498db;
    padding-bottom: 10px;
  }
`;

const ProfileInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InfoGroup = styled.div`
  margin-bottom: 15px;

  label {
    display: block;
    font-weight: 600;
    margin-bottom: 5px;
    color: #7f8c8d;
  }

  span {
    color: #2c3e50;
  }

  a {
    color: #3498db;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const EditButton = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;
  font-weight: 600;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2980b9;
  }
`;

const StudentDashboard = () => {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch('http://127.0.0.1:8000/api/students/profile/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('token');
            navigate('/login');
            return;
          }
          throw new Error('Failed to fetch student data');
        }

        const data = await response.json();
        setStudentData(data);
        setError('');
      } catch (error) {
        console.error('Error fetching student data:', error);
        setError('Failed to load student data: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [token, navigate]);

  const handleEditProfile = () => {
    navigate('/student-profile');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  if (loading) {
    return <LoadingDiv>Loading...</LoadingDiv>;
  }

  if (error) {
    return <ErrorDiv>{error}</ErrorDiv>;
  }

  return (
    <Container>
      <Header>
        <h1>Welcome, {studentData?.full_name || 'Student'}</h1>
        
        <TabsContainer>
          <TabButton 
            $active={activeTab === 'profile'}
            onClick={() => handleTabChange('profile')}
          >
            My Profile
          </TabButton>
          <TabButton 
            $active={activeTab === 'internships'}
            onClick={() => handleTabChange('internships')}
          >
            Internships
          </TabButton>
          <TabButton 
            $active={activeTab === 'applications'}
            onClick={() => handleTabChange('applications')}
          >
            My Applications
          </TabButton>
        </TabsContainer>
      </Header>
      
      <Content>
        {activeTab === 'profile' && (
          <ProfileSection>
            <h2>Your Profile</h2>
            <ProfileInfo>
              <InfoGroup>
                <label>Full Name:</label>
                <span>{studentData?.full_name}</span>
              </InfoGroup>
              <InfoGroup>
                <label>Roll Number:</label>
                <span>{studentData?.roll_no}</span>
              </InfoGroup>
              <InfoGroup>
                <label>Email:</label>
                <span>{studentData?.email}</span>
              </InfoGroup>
              <InfoGroup>
                <label>Mobile Number:</label>
                <span>{studentData?.mobile_no}</span>
              </InfoGroup>
              <InfoGroup>
                <label>Department:</label>
                <span>{studentData?.dept_of_study}</span>
              </InfoGroup>
              {studentData?.linkedin_url && (
                <InfoGroup>
                  <label>LinkedIn:</label>
                  <a href={studentData.linkedin_url} target="_blank" rel="noopener noreferrer">
                    View Profile
                  </a>
                </InfoGroup>
              )}
            </ProfileInfo>
            <EditButton onClick={handleEditProfile}>
              Edit Profile
            </EditButton>
          </ProfileSection>
        )}
        
        {activeTab === 'internships' && (
          <InternshipListing />
        )}
        
        {activeTab === 'applications' && (
          <ApplicationHistory />
        )}
      </Content>
    </Container>
  );
};

export default StudentDashboard;