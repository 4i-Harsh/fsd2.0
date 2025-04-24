import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiSearch, FiBell, FiUser, FiHome, FiMessageSquare, FiSettings, FiLogOut, FiMenu, FiX, FiFileText, FiUsers, FiBook, FiCalendar, FiFilter, FiDownload, FiCheckCircle, FiXCircle, FiEye, FiTarget } from 'react-icons/fi';
import { motion } from 'framer-motion';
import axios from 'axios';

// Reuse the styled components from TeacherDashboard.jsx
const Container = styled.div`
  min-height: 100vh;
  background-color: #0F0F0F;
  color: white;
  display: flex;
  position: relative;
  
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 100vh;
    background: 
      linear-gradient(45deg, rgba(255, 107, 0, 0.03) 1px, transparent 1px),
      linear-gradient(-45deg, rgba(255, 107, 0, 0.03) 1px, transparent 1px);
    background-size: 30px 30px;
    z-index: 0;
    pointer-events: none;
  }

  &::after {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at 15% 50%, rgba(255, 107, 0, 0.08) 0%, transparent 60%),
                radial-gradient(circle at 85% 30%, rgba(0, 153, 255, 0.08) 0%, transparent 60%);
    pointer-events: none;
    z-index: 1;
  }
`;

const Sidebar = styled(motion.aside)`
  width: ${props => props.isOpen ? '280px' : '80px'};
  background: rgba(15, 15, 15, 0.95);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 107, 0, 0.1);
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  z-index: 100;
  left: 0;
  top: 0;
  box-shadow: 5px 0 15px rgba(0, 0, 0, 0.3);
`;

const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${props => props.isOpen ? 'space-between' : 'center'};
  margin-bottom: 2rem;
  padding: 0 0.5rem;
`;

const Logo = styled.h1`
  font-size: ${props => props.isOpen ? '1.5rem' : '1.2rem'};
  font-weight: bold;
  background: linear-gradient(45deg, #ff6b00, #ff8533, #0099ff);
  background-size: 200% auto;
  color: transparent;
  -webkit-background-clip: text;
  background-clip: text;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s ease;

  &:hover {
    color: #ff6b00;
  }
`;

const SidebarItem = styled(motion.div)`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: ${props => props.active ? '#ff6b00' : '#666'};
  cursor: pointer;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  background: ${props => props.active ? 'rgba(255, 107, 0, 0.1)' : 'transparent'};
  transition: all 0.3s ease;
  text-decoration: none;

  &:hover {
    background: rgba(255, 107, 0, 0.1);
    color: #ff6b00;
    transform: translateX(5px);
  }

  svg {
    width: 1.5rem;
    height: 1.5rem;
    margin-right: ${props => props.isOpen ? '1rem' : '0'};
  }

  span {
    display: ${props => props.isOpen ? 'block' : 'none'};
    white-space: nowrap;
    overflow: hidden;
  }
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: ${props => props.sidebarWidth};
  min-height: 100vh;
  width: calc(100% - ${props => props.sidebarWidth});
  position: relative;
  transition: all 0.3s ease;
  z-index: 5;
`;

const ContentWrapper = styled.div`
  padding: 2rem;
  width: 100%;
`;

const Header = styled.header`
  background: rgba(15, 15, 15, 0.95);
  backdrop-filter: blur(10px);
  padding: 1rem 2rem;
  border-bottom: 1px solid rgba(255, 107, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 90;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
`;

const SearchBar = styled.div`
  position: relative;
  width: 300px;

  input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    background: rgba(30, 30, 30, 0.8);
    border: 1px solid rgba(255, 107, 0, 0.2);
    border-radius: 8px;
    color: white;
    font-size: 0.9rem;
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      border-color: #ff6b00;
      box-shadow: 0 0 0 2px rgba(255, 107, 0, 0.2);
    }
  }

  svg {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: #666;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: color 0.3s ease;

  &:hover {
    color: #ff6b00;
  }

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

const PageTitle = styled.div`
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2rem;
    color: white;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  p {
    color: #999;
    font-size: 1rem;
    max-width: 600px;
  }
`;

const FilterSection = styled.div`
  background: rgba(25, 25, 30, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(0, 153, 255, 0.1);
  margin-bottom: 2rem;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
`;

const FilterButton = styled.button`
  background: rgba(35, 35, 40, 0.6);
  border: 1px solid rgba(0, 153, 255, 0.1);
  border-radius: 8px;
  padding: 0.5rem 1rem;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;

  &:hover, &.active {
    background: rgba(0, 153, 255, 0.1);
    border-color: #0099ff;
  }

  svg {
    width: 1rem;
    height: 1rem;
    color: #0099ff;
  }
`;

const ApplicationsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
`;

const ApplicationCard = styled(motion.div)`
  background: rgba(25, 25, 30, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(0, 153, 255, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    border-color: #0099ff;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1.5rem;
    
    .student-info {
      h3 {
        font-size: 1.2rem;
        margin: 0 0 0.25rem 0;
        color: white;
      }
      
      .meta {
        display: flex;
        gap: 1rem;
        color: #999;
        font-size: 0.9rem;
      }
    }
    
    .status {
      padding: 0.25rem 0.75rem;
      border-radius: 50px;
      font-size: 0.8rem;
      font-weight: 500;
      
      &.pending {
        background: rgba(255, 184, 0, 0.1);
        color: #ffb800;
        border: 1px solid rgba(255, 184, 0, 0.3);
      }
      
      &.approved {
        background: rgba(75, 181, 67, 0.1);
        color: #4bb543;
        border: 1px solid rgba(75, 181, 67, 0.3);
      }
      
      &.rejected {
        background: rgba(255, 0, 0, 0.1);
        color: #ff4d4d;
        border: 1px solid rgba(255, 0, 0, 0.3);
      }
    }
  }
  
  .details {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    margin-bottom: 1.5rem;
    
    .detail-item {
      h4 {
        font-size: 0.9rem;
        color: #999;
        margin: 0 0 0.5rem 0;
        font-weight: normal;
      }
      
      p {
        font-size: 1.1rem;
        color: white;
        margin: 0;
      }
    }
  }
  
  .sdg-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }
  
  .sdg-tag {
    background: rgba(0, 153, 255, 0.1);
    border: 1px solid rgba(0, 153, 255, 0.3);
    color: #0099ff;
    border-radius: 20px;
    padding: 0.25rem 0.75rem;
    font-size: 0.8rem;
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }
  
  .actions {
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
  }
`;

const ActionButton = styled.button`
  background: ${props => props.type === 'view' ? 'rgba(0, 153, 255, 0.1)' : 
                        props.type === 'approve' ? 'rgba(75, 181, 67, 0.1)' : 
                        props.type === 'reject' ? 'rgba(255, 0, 0, 0.1)' : 'rgba(35, 35, 40, 0.6)'};
  border: 1px solid ${props => props.type === 'view' ? 'rgba(0, 153, 255, 0.3)' : 
                             props.type === 'approve' ? 'rgba(75, 181, 67, 0.3)' : 
                             props.type === 'reject' ? 'rgba(255, 0, 0, 0.3)' : 'rgba(153, 153, 153, 0.3)'};
  color: ${props => props.type === 'view' ? '#0099ff' : 
                  props.type === 'approve' ? '#4bb543' : 
                  props.type === 'reject' ? '#ff4d4d' : 'white'};
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    background: ${props => props.type === 'view' ? 'rgba(0, 153, 255, 0.2)' : 
                         props.type === 'approve' ? 'rgba(75, 181, 67, 0.2)' : 
                         props.type === 'reject' ? 'rgba(255, 0, 0, 0.2)' : 'rgba(35, 35, 40, 0.8)'};
  }
  
  svg {
    width: 1rem;
    height: 1rem;
  }
`;

const TeacherApplications = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sample data for applications
  useEffect(() => {
    // Mock data - in a real app, this would be an API call
    const mockApplications = [
      {
        id: 1,
        studentName: 'John Doe',
        studentId: 'S12345',
        company: 'Google Inc.',
        position: 'Software Engineer Intern',
        appliedDate: '2023-05-15',
        startDate: '2023-06-01',
        duration: '3 months',
        status: 'pending',
        sdgs: ['Quality Education', 'Gender Equality', 'Decent Work']
      },
      {
        id: 2,
        studentName: 'Jane Smith',
        studentId: 'S12346',
        company: 'Microsoft',
        position: 'UX Design Intern',
        appliedDate: '2023-05-10',
        startDate: '2023-06-15',
        duration: '6 months',
        status: 'approved',
        sdgs: ['Climate Action', 'Sustainable Cities']
      },
      {
        id: 3,
        studentName: 'Alice Johnson',
        studentId: 'S12347',
        company: 'Amazon',
        position: 'Data Science Intern',
        appliedDate: '2023-05-08',
        startDate: '2023-07-01',
        duration: '4 months',
        status: 'rejected',
        sdgs: ['Good Health', 'Clean Water', 'Reduced Inequalities']
      },
      {
        id: 4,
        studentName: 'Robert Brown',
        studentId: 'S12348',
        company: 'Facebook',
        position: 'Frontend Developer Intern',
        appliedDate: '2023-05-12',
        startDate: '2023-06-15',
        duration: '3 months',
        status: 'pending',
        sdgs: ['Industry Innovation', 'Partnership for Goals']
      },
      {
        id: 5,
        studentName: 'Emily Wilson',
        studentId: 'S12349',
        company: 'Apple',
        position: 'iOS Developer Intern',
        appliedDate: '2023-05-18',
        startDate: '2023-07-01',
        duration: '6 months',
        status: 'pending',
        sdgs: ['Affordable Clean Energy', 'Responsible Consumption']
      }
    ];
    
    setTimeout(() => {
      setApplications(mockApplications);
      setLoading(false);
    }, 1000);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const handleNavigation = (tab) => {
    switch(tab) {
      case 'dashboard':
        navigate('/teacher/dashboard');
        break;
      case 'applications':
        // Already on applications page
        break;
      case 'students':
        navigate('/teacher/students');
        break;
      case 'courses':
        navigate('/teacher/courses');
        break;
      case 'schedule':
        navigate('/teacher/schedule');
        break;
      case 'messages':
        navigate('/teacher/messages');
        break;
      case 'settings':
        navigate('/teacher/settings');
        break;
      default:
        break;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    navigate('/teacher/login');
  };
  
  const filteredApplications = activeFilter === 'all' 
    ? applications 
    : applications.filter(app => app.status === activeFilter);

  const handleViewApplication = (id) => {
    // Navigate to application details page
    navigate(`/teacher/applications/${id}`);
  };
  
  const handleApproveApplication = (id) => {
    // Implement approve logic
    setApplications(prev => 
      prev.map(app => app.id === id ? {...app, status: 'approved'} : app)
    );
  };
  
  const handleRejectApplication = (id) => {
    // Implement reject logic
    setApplications(prev => 
      prev.map(app => app.id === id ? {...app, status: 'rejected'} : app)
    );
  };

  return (
    <Container>
      <Sidebar
        isOpen={isSidebarOpen}
        initial={false}
        animate={{ width: isSidebarOpen ? '280px' : '80px' }}
      >
        <SidebarHeader isOpen={isSidebarOpen}>
          <Logo isOpen={isSidebarOpen}>T-Dashboard</Logo>
          <MenuButton onClick={toggleSidebar}>
            {isSidebarOpen ? <FiX /> : <FiMenu />}
          </MenuButton>
        </SidebarHeader>

        <SidebarItem 
          as={motion.div}
          whileHover={{ x: 5 }}
          isOpen={isSidebarOpen} 
          active={false} 
          onClick={() => handleNavigation('dashboard')}
        >
          <FiHome />
          <span>Dashboard</span>
        </SidebarItem>
        
        <SidebarItem 
          as={motion.div}
          whileHover={{ x: 5 }}
          isOpen={isSidebarOpen} 
          active={true} 
          onClick={() => handleNavigation('applications')}
        >
          <FiFileText />
          <span>Applications</span>
        </SidebarItem>
        
        <SidebarItem 
          as={motion.div}
          whileHover={{ x: 5 }}
          isOpen={isSidebarOpen} 
          active={false} 
          onClick={() => handleNavigation('students')}
        >
          <FiUsers />
          <span>Students</span>
        </SidebarItem>
        
        <SidebarItem 
          as={motion.div}
          whileHover={{ x: 5 }}
          isOpen={isSidebarOpen} 
          active={false} 
          onClick={() => handleNavigation('courses')}
        >
          <FiBook />
          <span>Courses</span>
        </SidebarItem>
        
        <SidebarItem 
          as={motion.div}
          whileHover={{ x: 5 }}
          isOpen={isSidebarOpen} 
          active={false} 
          onClick={() => handleNavigation('schedule')}
        >
          <FiCalendar />
          <span>Schedule</span>
        </SidebarItem>
        
        <SidebarItem 
          as={motion.div}
          whileHover={{ x: 5 }}
          isOpen={isSidebarOpen} 
          active={false} 
          onClick={() => handleNavigation('messages')}
        >
          <FiMessageSquare />
          <span>Messages</span>
        </SidebarItem>
        
        <SidebarItem 
          as={motion.div}
          whileHover={{ x: 5 }}
          isOpen={isSidebarOpen} 
          active={false} 
          onClick={() => handleNavigation('settings')}
        >
          <FiSettings />
          <span>Settings</span>
        </SidebarItem>

        <div style={{ marginTop: 'auto' }}>
          <SidebarItem 
            as={motion.div}
            whileHover={{ x: 5 }}
            isOpen={isSidebarOpen} 
            onClick={handleLogout}
          >
            <FiLogOut />
            <span>Logout</span>
          </SidebarItem>
        </div>
      </Sidebar>

      <MainContent sidebarWidth={isSidebarOpen ? '280px' : '80px'}>
        <Header>
          <SearchBar>
            <FiSearch />
            <input type="text" placeholder="Search applications..." />
          </SearchBar>

          <HeaderActions>
            <IconButton>
              <FiBell />
            </IconButton>
            <IconButton>
              <FiUser />
            </IconButton>
          </HeaderActions>
        </Header>

        <ContentWrapper>
          <PageTitle>
            <h1><FiFileText style={{ color: '#0099ff' }} /> Internship Applications</h1>
            <p>Review and manage student internship applications. Approve or reject applications based on your evaluation.</p>
          </PageTitle>
          
          <FilterSection>
            <FilterButton 
              className={activeFilter === 'all' ? 'active' : ''} 
              onClick={() => setActiveFilter('all')}
            >
              <FiFilter /> All Applications
            </FilterButton>
            <FilterButton 
              className={activeFilter === 'pending' ? 'active' : ''} 
              onClick={() => setActiveFilter('pending')}
            >
              Pending
            </FilterButton>
            <FilterButton 
              className={activeFilter === 'approved' ? 'active' : ''} 
              onClick={() => setActiveFilter('approved')}
            >
              Approved
            </FilterButton>
            <FilterButton 
              className={activeFilter === 'rejected' ? 'active' : ''} 
              onClick={() => setActiveFilter('rejected')}
            >
              Rejected
            </FilterButton>
            
            <div style={{ marginLeft: 'auto' }}>
              <FilterButton>
                <FiDownload /> Export
              </FilterButton>
            </div>
          </FilterSection>
          
          <ApplicationsContainer>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                Loading applications...
              </div>
            ) : filteredApplications.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                No applications found.
              </div>
            ) : (
              filteredApplications.map(app => (
                <ApplicationCard 
                  key={app.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="header">
                    <div className="student-info">
                      <h3>{app.studentName}</h3>
                      <div className="meta">
                        <span>ID: {app.studentId}</span>
                        <span>Applied: {new Date(app.appliedDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className={`status ${app.status}`}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </div>
                  </div>
                  
                  <div className="details">
                    <div className="detail-item">
                      <h4>Company</h4>
                      <p>{app.company}</p>
                    </div>
                    <div className="detail-item">
                      <h4>Position</h4>
                      <p>{app.position}</p>
                    </div>
                    <div className="detail-item">
                      <h4>Start Date</h4>
                      <p>{new Date(app.startDate).toLocaleDateString()}</p>
                    </div>
                    <div className="detail-item">
                      <h4>Duration</h4>
                      <p>{app.duration}</p>
                    </div>
                  </div>
                  
                  <div className="sdg-tags">
                    {app.sdgs && app.sdgs.map((sdg, index) => (
                      <span key={index} className="sdg-tag">
                        <FiTarget size={12} /> {sdg}
                      </span>
                    ))}
                  </div>
                  
                  <div className="actions">
                    <ActionButton 
                      type="view"
                      onClick={() => handleViewApplication(app.id)}
                    >
                      <FiEye /> View Details
                    </ActionButton>
                    
                    {app.status === 'pending' && (
                      <>
                        <ActionButton 
                          type="approve"
                          onClick={() => handleApproveApplication(app.id)}
                        >
                          <FiCheckCircle /> Approve
                        </ActionButton>
                        <ActionButton 
                          type="reject"
                          onClick={() => handleRejectApplication(app.id)}
                        >
                          <FiXCircle /> Reject
                        </ActionButton>
                      </>
                    )}
                  </div>
                </ApplicationCard>
              ))
            )}
          </ApplicationsContainer>
        </ContentWrapper>
      </MainContent>
    </Container>
  );
};

export default TeacherApplications; 