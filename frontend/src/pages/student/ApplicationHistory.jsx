import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBriefcase, FiMapPin, FiCalendar, FiClock, FiFileText, FiExternalLink, FiCheck, FiClock as FiPending, FiX } from 'react-icons/fi';

const Container = styled(motion.div)`
  padding: 2rem;
  width: 100%;
  background: #000;
  min-height: 100vh;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
    background: 
      linear-gradient(45deg, rgba(255, 107, 0, 0.05) 1px, transparent 1px),
      linear-gradient(-45deg, rgba(255, 107, 0, 0.05) 1px, transparent 1px);
    background-size: 30px 30px;
    z-index: 0;
    pointer-events: none;
  }
`;

const Title = styled(motion.h2)`
  font-size: 2rem;
  color: white;
  margin-bottom: 2rem;
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(90deg, #ff6b00, transparent);
    border-radius: 2px;
  }
`;

const LoadingDiv = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  color: #ff6b00;
  font-size: 1.2rem;
  gap: 1rem;

  svg {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const ErrorDiv = styled(motion.div)`
  color: #ff4444;
  background: rgba(255, 68, 68, 0.1);
  border-left: 4px solid #ff4444;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
`;

const NoApplications = styled(motion.div)`
  text-align: center;
  padding: 3rem;
  border: 2px dashed rgba(255, 107, 0, 0.3);
  border-radius: 12px;
  color: #ff6b00;
  background: rgba(255, 107, 0, 0.05);
  backdrop-filter: blur(10px);

  p {
    margin-bottom: 1.5rem;
    font-size: 1.1rem;
  }
`;

const BrowseButton = styled(motion.button)`
  background: linear-gradient(45deg, #ff6b00, #ff8533);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(255, 107, 0, 0.2);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 auto;

  &:hover {
    box-shadow: 0 6px 20px rgba(255, 107, 0, 0.3);
    transform: translateY(-2px);
  }
`;

const ApplicationsList = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  position: relative;
  z-index: 1;
`;

const ApplicationCard = styled(motion.div)`
  background: rgba(20, 20, 20, 0.8);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 107, 0, 0.1);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 107, 0, 0.3), transparent);
  }
`;

const CardHeader = styled.div`
  padding: 1.5rem;
  background: linear-gradient(145deg, rgba(30, 25, 20, 0.9), rgba(20, 15, 10, 0.9));
  border-bottom: 1px solid rgba(255, 107, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    margin: 0;
    font-size: 1.4rem;
    color: white;
    display: flex;
    align-items: center;
    gap: 0.75rem;

    svg {
      color: #ff6b00;
    }
  }
`;

const StatusBadge = styled.span`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  ${props => {
    switch (props.status.toLowerCase()) {
      case 'pending':
        return `
          background: rgba(241, 196, 15, 0.1);
          color: #f1c40f;
          border: 1px solid rgba(241, 196, 15, 0.2);
        `;
      case 'shortlisted':
        return `
          background: rgba(46, 204, 113, 0.1);
          color: #2ecc71;
          border: 1px solid rgba(46, 204, 113, 0.2);
        `;
      case 'rejected':
        return `
          background: rgba(231, 76, 60, 0.1);
          color: #e74c3c;
          border: 1px solid rgba(231, 76, 60, 0.2);
        `;
      default:
        return `
          background: rgba(241, 196, 15, 0.1);
          color: #f1c40f;
          border: 1px solid rgba(241, 196, 15, 0.2);
        `;
    }
  }}
`;

const CardDetails = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 107, 0, 0.1);
`;

const DetailGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  color: #999;

  &:last-child {
    margin-bottom: 0;
  }

  svg {
    color: #ff6b00;
    font-size: 1.1rem;
  }
`;

const ApplicationDescription = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 107, 0, 0.1);
  background: rgba(255, 107, 0, 0.05);

  h4 {
    margin: 0 0 1rem 0;
    font-size: 1.1rem;
    color: #ff6b00;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  p {
    margin: 0;
    color: #ccc;
    line-height: 1.6;
  }
`;

const ResumeSection = styled.div`
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ResumeLabel = styled.span`
  color: #999;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    color: #ff6b00;
  }
`;

const ViewResumeButton = styled(motion.a)`
  background: rgba(255, 255, 255, 0.05);
  color: white;
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.9rem;
  border: 1px solid rgba(255, 107, 0, 0.3);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }

  svg {
    color: #ff6b00;
  }
`;

const ApplicationHistory = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch('http://127.0.0.1:8000/api/students/applications/', {
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
          throw new Error('Failed to fetch applications');
        }

        const data = await response.json();
        
        const applicationsWithDetails = await Promise.all(
          data.map(async (application) => {
            try {
              const internshipResponse = await fetch(
                `http://127.0.0.1:8000/api/managements/internships/${application.internship}/`,
                {
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                  }
                }
              );

              if (!internshipResponse.ok) {
                throw new Error('Failed to fetch internship details');
              }

              const internshipData = await internshipResponse.json();
              return {
                ...application,
                internshipDetails: internshipData
              };
            } catch (error) {
              console.error('Error fetching internship details:', error);
              return {
                ...application,
                internshipDetails: null
              };
            }
          })
        );

        setApplications(applicationsWithDetails);
        setError('');
      } catch (error) {
        console.error('Error fetching applications:', error);
        setError('Failed to load applications: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [token, navigate]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <FiPending />;
      case 'shortlisted':
        return <FiCheck />;
      case 'rejected':
        return <FiX />;
      default:
        return <FiPending />;
    }
  };

  if (loading) {
    return (
      <Container
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <LoadingDiv>
          <FiBriefcase />
          Loading your applications...
        </LoadingDiv>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </ErrorDiv>
      </Container>
    );
  }

  return (
    <Container
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Title
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        My Applications
      </Title>
      
      {applications.length === 0 ? (
        <NoApplications
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p>You haven't applied to any internships yet.</p>
          <BrowseButton
            onClick={() => navigate('/student-dashboard')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiBriefcase />
            Browse Available Internships
          </BrowseButton>
        </NoApplications>
      ) : (
        <ApplicationsList>
          <AnimatePresence>
            {applications.map((application, index) => (
              <ApplicationCard
                key={application.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { delay: index * 0.1 }
                }}
                whileHover={{ y: -5 }}
              >
                <CardHeader>
                  <h3>
                    <FiBriefcase />
                    {application.internshipDetails?.title || 'Internship'}
                  </h3>
                  <StatusBadge status={application.status}>
                    {getStatusIcon(application.status)}
                    {application.status}
                  </StatusBadge>
                </CardHeader>
                
                <CardDetails>
                  <DetailGroup>
                    <FiBriefcase />
                    <span>{application.internshipDetails?.company_name || 'Not specified'}</span>
                  </DetailGroup>
                  
                  <DetailGroup>
                    <FiCalendar />
                    <span>Applied on: {formatDate(application.applied_at)}</span>
                  </DetailGroup>
                  
                  <DetailGroup>
                    <FiMapPin />
                    <span>{application.internshipDetails?.location || 'Not specified'}</span>
                  </DetailGroup>
                  
                  {application.internshipDetails && (
                    <DetailGroup>
                      <FiClock />
                      <span>
                        Duration: {formatDate(application.internshipDetails.start_date)} - 
                        {formatDate(application.internshipDetails.end_date)}
                      </span>
                    </DetailGroup>
                  )}
                </CardDetails>
                
                <ApplicationDescription>
                  <h4>
                    <FiFileText />
                    Your Application Note
                  </h4>
                  <p>{application.description}</p>
                </ApplicationDescription>
                
                <ResumeSection>
                  <ResumeLabel>
                    <FiFileText />
                    Submitted Resume
                  </ResumeLabel>
                  <ViewResumeButton 
                    href={application.resume} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FiExternalLink />
                    View Resume
                  </ViewResumeButton>
                </ResumeSection>
              </ApplicationCard>
            ))}
          </AnimatePresence>
        </ApplicationsList>
      )}
    </Container>
  );
};

export default ApplicationHistory; 