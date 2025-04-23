import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
  width: 100%;
`;

const Title = styled.h2`
  margin-bottom: 20px;
  font-size: 1.8rem;
  color: #2c3e50;
  border-bottom: 2px solid #3498db;
  padding-bottom: 10px;
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
  text-align: center;
`;

const NoApplications = styled.div`
  text-align: center;
  padding: 30px;
  border: 1px dashed #bdc3c7;
  border-radius: 5px;
  margin-top: 20px;
  color: #7f8c8d;
`;

const BrowseButton = styled.button`
  margin-top: 15px;
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2980b9;
  }
`;

const ApplicationsList = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin-top: 20px;
`;

const ApplicationCard = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const CardHeader = styled.div`
  padding: 15px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    margin: 0;
    font-size: 1.3rem;
    color: #2c3e50;
  }
`;

const StatusBadge = styled.span`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  background-color: ${props => {
    switch (props.status.toLowerCase()) {
      case 'pending':
        return '#f1c40f';
      case 'shortlisted':
        return '#2ecc71';
      case 'rejected':
        return '#e74c3c';
      default:
        return '#f1c40f';
    }
  }};
  color: ${props => {
    switch (props.status.toLowerCase()) {
      case 'pending':
        return '#7f6000';
      case 'shortlisted':
        return '#1b7943';
      case 'rejected':
        return '#7f2620';
      default:
        return '#7f6000';
    }
  }};
`;

const CardDetails = styled.div`
  padding: 15px;
  border-bottom: 1px solid #e9ecef;
`;

const DetailGroup = styled.div`
  margin-bottom: 10px;
  display: flex;
  align-items: flex-start;

  &:last-child {
    margin-bottom: 0;
  }
`;

const DetailLabel = styled.span`
  font-weight: 600;
  margin-right: 10px;
  min-width: 100px;
  color: #7f8c8d;
`;

const ApplicationDescription = styled.div`
  padding: 15px;
  border-bottom: 1px solid #e9ecef;

  h4 {
    margin: 0 0 10px 0;
    font-size: 1.1rem;
    color: #2c3e50;
  }

  p {
    margin: 0;
    color: #34495e;
    line-height: 1.5;
  }
`;

const ResumeSection = styled.div`
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ResumeLabel = styled.span`
  color: #7f8c8d;
  font-weight: 600;
`;

const ViewResumeButton = styled.a`
  background-color: #3498db;
  color: white;
  text-decoration: none;
  padding: 8px 15px;
  border-radius: 4px;
  font-size: 0.9rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2980b9;
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
        
        // Fetch internship details for each application
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

  if (loading) {
    return <LoadingDiv>Loading your applications...</LoadingDiv>;
  }

  if (error) {
    return <ErrorDiv>{error}</ErrorDiv>;
  }

  return (
    <Container>
      <Title>My Applications</Title>
      
      {applications.length === 0 ? (
        <NoApplications>
          <p>You haven't applied to any internships yet.</p>
          <BrowseButton onClick={() => navigate('/student-dashboard')}>
            Browse Available Internships
          </BrowseButton>
        </NoApplications>
      ) : (
        <ApplicationsList>
          {applications.map((application) => (
            <ApplicationCard key={application.id}>
              <CardHeader>
                <h3>{application.internshipDetails?.title || 'Internship'}</h3>
                <StatusBadge status={application.status}>
                  {application.status}
                </StatusBadge>
              </CardHeader>
              
              <CardDetails>
                <DetailGroup>
                  <DetailLabel>Company:</DetailLabel>
                  <span>{application.internshipDetails?.company_name || 'Not specified'}</span>
                </DetailGroup>
                
                <DetailGroup>
                  <DetailLabel>Applied On:</DetailLabel>
                  <span>{formatDate(application.applied_at)}</span>
                </DetailGroup>
                
                <DetailGroup>
                  <DetailLabel>Location:</DetailLabel>
                  <span>{application.internshipDetails?.location || 'Not specified'}</span>
                </DetailGroup>
                
                {application.internshipDetails && (
                  <DetailGroup>
                    <DetailLabel>Duration:</DetailLabel>
                    <span>
                      {formatDate(application.internshipDetails.start_date)} - 
                      {formatDate(application.internshipDetails.end_date)}
                    </span>
                  </DetailGroup>
                )}
              </CardDetails>
              
              <ApplicationDescription>
                <h4>Your Application Note:</h4>
                <p>{application.description}</p>
              </ApplicationDescription>
              
              <ResumeSection>
                <ResumeLabel>Submitted Resume:</ResumeLabel>
                <ViewResumeButton 
                  href={application.resume} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  View Resume
                </ViewResumeButton>
              </ResumeSection>
            </ApplicationCard>
          ))}
        </ApplicationsList>
      )}
    </Container>
  );
};

export default ApplicationHistory; 