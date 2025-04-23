import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
  width: 100%;
  margin-top: 20px;
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
`;

const NoInternships = styled.div`
  text-align: center;
  padding: 30px;
  border: 1px dashed #bdc3c7;
  border-radius: 5px;
  margin-top: 20px;
  color: #7f8c8d;
`;

const InternshipsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InternshipCard = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
  }
`;

const CardHeader = styled.div`
  padding: 15px;
  background-color: #3498db;
  color: white;

  h3 {
    margin: 0;
    font-size: 1.4rem;
    line-height: 1.3;
  }
`;

const CompanyName = styled.span`
  display: block;
  margin-top: 5px;
  font-size: 1rem;
  opacity: 0.9;
`;

const CardDetails = styled.div`
  padding: 15px;
  border-bottom: 1px solid #ecf0f1;
`;

const DetailGroup = styled.div`
  margin-bottom: 8px;
  display: flex;
  align-items: flex-start;
`;

const DetailLabel = styled.span`
  font-weight: 600;
  margin-right: 5px;
  min-width: 80px;
  color: #7f8c8d;
`;

const Description = styled.div`
  padding: 15px;
  color: #34495e;
  flex: 1;

  p {
    margin: 0;
    line-height: 1.5;
  }
`;

const AdditionalDetails = styled.div`
  padding: 0 15px;
  margin-bottom: 15px;
`;

const DetailSection = styled.div`
  margin-bottom: 10px;

  h4 {
    font-size: 1rem;
    color: #2c3e50;
    margin-bottom: 5px;
  }

  p {
    margin: 0;
    color: #7f8c8d;
    font-size: 0.9rem;
    line-height: 1.4;
  }
`;

const CardActions = styled.div`
  padding: 15px;
  border-top: 1px solid #ecf0f1;
  display: flex;
  justify-content: flex-end;
  margin-top: auto;
`;

const ApplyButton = styled.button`
  background-color: #2ecc71;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;

  &:hover {
    background-color: #27ae60;
  }
`;

const InternshipListing = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch('http://127.0.0.1:8000/api/students/internships/', {
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
          throw new Error('Failed to fetch internships');
        }

        const data = await response.json();
        setInternships(data);
        setError('');
      } catch (error) {
        console.error('Error fetching internships:', error);
        setError('Failed to load internships: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInternships();
  }, [token, navigate]);

  const handleApply = (internshipId) => {
    navigate(`/apply-internship/${internshipId}`);
  };

  if (loading) {
    return <LoadingDiv>Loading internships...</LoadingDiv>;
  }

  if (error) {
    return <ErrorDiv>{error}</ErrorDiv>;
  }

  return (
    <Container>
      <Title>Available Internships</Title>
      
      {internships.length === 0 ? (
        <NoInternships>
          <p>No internships available at the moment.</p>
        </NoInternships>
      ) : (
        <InternshipsList>
          {internships.map((internship) => (
            <InternshipCard key={internship.id}>
              <CardHeader>
                <h3>{internship.title}</h3>
                <CompanyName>{internship.company_name}</CompanyName>
              </CardHeader>
              
              <CardDetails>
                <DetailGroup>
                  <DetailLabel>Location:</DetailLabel>
                  <span>{internship.location || 'Not specified'}</span>
                </DetailGroup>
                
                <DetailGroup>
                  <DetailLabel>Duration:</DetailLabel>
                  <span>
                    {new Date(internship.start_date).toLocaleDateString()} - 
                    {new Date(internship.end_date).toLocaleDateString()}
                  </span>
                </DetailGroup>
                
                <DetailGroup>
                  <DetailLabel>Apply by:</DetailLabel>
                  <span>{new Date(internship.application_deadline).toLocaleDateString()}</span>
                </DetailGroup>
              </CardDetails>
              
              <Description>
                <p>{internship.description}</p>
              </Description>
              
              {internship.details && (
                <AdditionalDetails>
                  {internship.details.requirements && (
                    <DetailSection>
                      <h4>Requirements</h4>
                      <p>{internship.details.requirements}</p>
                    </DetailSection>
                  )}
                  
                  {internship.details.skills_required && (
                    <DetailSection>
                      <h4>Skills Required</h4>
                      <p>{internship.details.skills_required}</p>
                    </DetailSection>
                  )}
                  
                  {internship.details.stipend && (
                    <DetailSection>
                      <h4>Stipend</h4>
                      <p>{internship.details.stipend}</p>
                    </DetailSection>
                  )}
                </AdditionalDetails>
              )}
              
              <CardActions>
                <ApplyButton onClick={() => handleApply(internship.id)}>
                  Apply Now
                </ApplyButton>
              </CardActions>
            </InternshipCard>
          ))}
        </InternshipsList>
      )}
    </Container>
  );
};

export default InternshipListing; 