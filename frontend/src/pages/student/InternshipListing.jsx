import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBriefcase, FiMapPin, FiCalendar, FiClock, FiDollarSign, FiBookmark } from 'react-icons/fi';

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

const NoInternships = styled(motion.div)`
  text-align: center;
  padding: 3rem;
  border: 2px dashed rgba(255, 107, 0, 0.3);
  border-radius: 12px;
  color: #ff6b00;
  background: rgba(255, 107, 0, 0.05);
  backdrop-filter: blur(10px);
`;

const InternshipsList = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  position: relative;
  z-index: 1;
`;

const InternshipCard = styled(motion.div)`
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

  h3 {
    margin: 0;
    font-size: 1.4rem;
    color: white;
    margin-bottom: 0.5rem;
  }
`;

const CompanyName = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #ff6b00;
  font-size: 1rem;
  margin-top: 0.5rem;

  svg {
    font-size: 1.2rem;
  }
`;

const CardDetails = styled.div`
  padding: 1.5rem;
`;

const DetailGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  color: #999;

  svg {
    color: #ff6b00;
    font-size: 1.1rem;
  }
`;

const Description = styled.div`
  padding: 1.5rem;
  color: #ccc;
  border-top: 1px solid rgba(255, 107, 0, 0.1);
  
  p {
    margin: 0;
    line-height: 1.6;
  }
`;

const AdditionalDetails = styled.div`
  padding: 1.5rem;
  background: rgba(255, 107, 0, 0.05);
`;

const DetailSection = styled.div`
  margin-bottom: 1rem;

  h4 {
    font-size: 1rem;
    color: #ff6b00;
    margin-bottom: 0.5rem;
  }

  p {
    color: #999;
    font-size: 0.9rem;
    line-height: 1.5;
    margin: 0;
  }
`;

const CardActions = styled.div`
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  border-top: 1px solid rgba(255, 107, 0, 0.1);
`;

const ActionButton = styled(motion.button)`
  flex: 1;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  ${props => props.$primary ? `
    background: linear-gradient(45deg, #ff6b00, #ff8533);
    color: white;
    border: none;
    box-shadow: 0 4px 15px rgba(255, 107, 0, 0.2);

    &:hover {
      box-shadow: 0 6px 20px rgba(255, 107, 0, 0.3);
    }
  ` : `
    background: rgba(255, 255, 255, 0.05);
    color: white;
    border: 1px solid rgba(255, 107, 0, 0.3);

    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  `}
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
    return (
      <Container
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <LoadingDiv>
          <FiBriefcase />
          Loading internships...
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
        Available Internships
      </Title>
      
      {internships.length === 0 ? (
        <NoInternships
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p>No internships available at the moment.</p>
        </NoInternships>
      ) : (
        <InternshipsList>
          <AnimatePresence>
            {internships.map((internship, index) => (
              <InternshipCard
                key={internship.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { delay: index * 0.1 }
                }}
                whileHover={{ y: -5 }}
              >
                <CardHeader>
                  <h3>{internship.title}</h3>
                  <CompanyName>
                    <FiBriefcase />
                    {internship.company_name}
                  </CompanyName>
                </CardHeader>
                
                <CardDetails>
                  <DetailGroup>
                    <FiMapPin />
                    <span>{internship.location || 'Remote'}</span>
                  </DetailGroup>
                  
                  <DetailGroup>
                    <FiCalendar />
                    <span>
                      {new Date(internship.start_date).toLocaleDateString()} - 
                      {new Date(internship.end_date).toLocaleDateString()}
                    </span>
                  </DetailGroup>
                  
                  <DetailGroup>
                    <FiClock />
                    <span>Apply by: {new Date(internship.application_deadline).toLocaleDateString()}</span>
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
                        <p>
                          <FiDollarSign style={{ verticalAlign: 'middle' }} />
                          {internship.details.stipend}
                        </p>
                      </DetailSection>
                    )}
                  </AdditionalDetails>
                )}
                
                <CardActions>
                  <ActionButton
                    $primary
                    onClick={() => handleApply(internship.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Apply Now
                  </ActionButton>
                  <ActionButton
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FiBookmark /> Save
                  </ActionButton>
                </CardActions>
              </InternshipCard>
            ))}
          </AnimatePresence>
        </InternshipsList>
      )}
    </Container>
  );
};

export default InternshipListing; 