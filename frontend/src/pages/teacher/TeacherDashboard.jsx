import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FiSearch, FiBookmark, FiBriefcase, FiBell, FiUser, FiPieChart, FiCheckCircle, FiStar, FiCalendar, FiFilter, FiArrowRight, FiMapPin, FiHome, FiMessageSquare, FiSettings, FiLogOut, FiMenu, FiX, FiChevronRight, FiFileText, FiHeart, FiTrendingUp, FiUsers, FiBook, FiClock, FiLoader, FiTarget } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { keyframes } from 'styled-components';
import axios from 'axios';

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const pulseAnimation = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(255, 107, 0, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(255, 107, 0, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 107, 0, 0); }
`;

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0px); }
`;

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
  animation: ${gradientAnimation} 3s linear infinite;
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

const NotificationBadge = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  background: #ff6b00;
  color: white;
  font-size: 0.7rem;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${pulseAnimation} 2s infinite;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled(motion.div)`
  background: rgba(25, 25, 30, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 107, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
    border-color: rgba(255, 107, 0, 0.3);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${props => {
      switch(props.type) {
        case 'students': return 'linear-gradient(135deg, rgba(255, 107, 0, 0.1) 0%, transparent 100%)';
        case 'applications': return 'linear-gradient(135deg, rgba(0, 153, 255, 0.1) 0%, transparent 100%)';
        case 'courses': return 'linear-gradient(135deg, rgba(83, 166, 0, 0.1) 0%, transparent 100%)';
        case 'hours': return 'linear-gradient(135deg, rgba(204, 0, 255, 0.1) 0%, transparent 100%)';
        default: return 'transparent';
      }
    }};
    pointer-events: none;
    z-index: 0;
  }

  .icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: ${props => {
      switch(props.type) {
        case 'students': return 'rgba(255, 107, 0, 0.15)';
        case 'applications': return 'rgba(0, 153, 255, 0.15)';
        case 'courses': return 'rgba(83, 166, 0, 0.15)';
        case 'hours': return 'rgba(204, 0, 255, 0.15)';
        default: return 'rgba(255, 107, 0, 0.15)';
      }
    }};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => {
      switch(props.type) {
        case 'students': return '#ff6b00';
        case 'applications': return '#0099ff';
        case 'courses': return '#53a600';
        case 'hours': return '#cc00ff';
        default: return '#ff6b00';
      }
    }};
    z-index: 1;
    animation: ${floatAnimation} 3s ease infinite;

    svg {
      width: 24px;
      height: 24px;
    }
  }

  .content {
    position: relative;
    z-index: 1;
    
    h3 {
      font-size: 1.8rem;
      margin: 0;
      color: white;
      font-weight: 700;
    }

    p {
      margin: 0;
      color: #999;
      font-size: 0.9rem;
    }
  }
`;

const ProfileCard = styled(motion.div)`
  background: rgba(25, 25, 30, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid rgba(255, 107, 0, 0.1);
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(255, 107, 0, 0.08) 0%, transparent 100%);
    pointer-events: none;
  }

  h2 {
    color: #ff6b00;
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    position: relative;
    z-index: 1;
  }

  .profile-info {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    position: relative;
    z-index: 1;
  }

  .info-item {
    background: rgba(35, 35, 40, 0.6);
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid rgba(255, 107, 0, 0.1);
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-3px);
      border-color: rgba(255, 107, 0, 0.3);
      background: rgba(35, 35, 40, 0.8);
    }

    label {
      color: #999;
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
      display: block;
    }

    span {
      color: white;
      font-size: 1.1rem;
      display: block;
      font-weight: 500;
    }
  }
`;

const QuickActionsCard = styled(motion.div)`
  background: rgba(25, 25, 30, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid rgba(255, 107, 0, 0.1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(0, 153, 255, 0.08) 0%, transparent 100%);
    pointer-events: none;
  }

  h2 {
    color: #0099ff;
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    position: relative;
    z-index: 1;
  }

  .actions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    position: relative;
    z-index: 1;
  }
`;

const ActionButton = styled.button`
  background: rgba(35, 35, 40, 0.6);
  border: 1px solid rgba(0, 153, 255, 0.1);
  border-radius: 8px;
  padding: 1rem;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  &:hover {
    background: rgba(0, 153, 255, 0.1);
    border-color: #0099ff;
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }

  svg {
    width: 1.5rem;
    height: 1.5rem;
    color: #0099ff;
  }
`;

const SDGOverviewCard = styled(motion.div)`
  background: rgba(25, 25, 30, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid rgba(83, 166, 0, 0.1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
  margin-top: 2rem;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(83, 166, 0, 0.08) 0%, transparent 100%);
    pointer-events: none;
  }

  h2 {
    color: #53a600;
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    position: relative;
    z-index: 1;
  }

  .sdg-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
    position: relative;
    z-index: 1;
  }
  
  .sdg-item {
    background: rgba(35, 35, 40, 0.6);
    border: 1px solid rgba(83, 166, 0, 0.1);
    border-radius: 8px;
    padding: 1rem;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-3px);
      border-color: rgba(83, 166, 0, 0.3);
      background: rgba(35, 35, 40, 0.8);
    }
    
    h3 {
      color: #53a600;
      font-size: 1rem;
      margin: 0 0 0.5rem 0;
      display: flex;
      align-items: center;
      gap: 0.3rem;
    }
    
    p {
      margin: 0;
      color: white;
      font-size: 1.5rem;
      font-weight: 600;
    }
    
    span {
      color: #999;
      font-size: 0.85rem;
    }
  }
`;

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [teacherData, setTeacherData] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sdgData, setSdgData] = useState([
    { name: 'Quality Education', count: 42 },
    { name: 'Climate Action', count: 36 },
    { name: 'Gender Equality', count: 29 },
    { name: 'Decent Work', count: 34 },
  ]);

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          'http://localhost:8000/api/teachers/profile/',
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        setTeacherData(response.data);
      } catch (err) {
        setError('Failed to load teacher data');
        console.error('Error fetching teacher data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    navigate('/teacher/login');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const handleNavigation = (tab) => {
    setActiveTab(tab);
    switch(tab) {
      case 'dashboard':
        // Stay on current page
        break;
      case 'applications':
        navigate('/teacher/applications');
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

  if (loading) {
    return (
      <Container>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          width: '100vw' 
        }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <FiLoader size={40} color="#ff6b00" />
          </motion.div>
        </div>
      </Container>
    );
  }

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
          active={activeTab === 'dashboard'} 
          onClick={() => handleNavigation('dashboard')}
        >
          <FiHome />
          <span>Dashboard</span>
        </SidebarItem>
        
        <SidebarItem 
          as={motion.div}
          whileHover={{ x: 5 }}
          isOpen={isSidebarOpen} 
          active={activeTab === 'applications'} 
          onClick={() => handleNavigation('applications')}
        >
          <FiFileText />
          <span>Applications</span>
        </SidebarItem>
        
        <SidebarItem 
          as={motion.div}
          whileHover={{ x: 5 }}
          isOpen={isSidebarOpen} 
          active={activeTab === 'students'} 
          onClick={() => handleNavigation('students')}
        >
          <FiUsers />
          <span>Students</span>
        </SidebarItem>
        
        <SidebarItem 
          as={motion.div}
          whileHover={{ x: 5 }}
          isOpen={isSidebarOpen} 
          active={activeTab === 'courses'} 
          onClick={() => handleNavigation('courses')}
        >
          <FiBook />
          <span>Courses</span>
        </SidebarItem>
        
        <SidebarItem 
          as={motion.div}
          whileHover={{ x: 5 }}
          isOpen={isSidebarOpen} 
          active={activeTab === 'schedule'} 
          onClick={() => handleNavigation('schedule')}
        >
          <FiCalendar />
          <span>Schedule</span>
        </SidebarItem>
        
        <SidebarItem 
          as={motion.div}
          whileHover={{ x: 5 }}
          isOpen={isSidebarOpen} 
          active={activeTab === 'messages'} 
          onClick={() => handleNavigation('messages')}
        >
          <FiMessageSquare />
          <span>Messages</span>
        </SidebarItem>
        
        <SidebarItem 
          as={motion.div}
          whileHover={{ x: 5 }}
          isOpen={isSidebarOpen} 
          active={activeTab === 'settings'} 
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
            <input type="text" placeholder="Search..." />
          </SearchBar>

          <HeaderActions>
            <IconButton>
              <FiBell />
              <NotificationBadge>3</NotificationBadge>
            </IconButton>
            <IconButton>
              <FiMessageSquare />
              <NotificationBadge>5</NotificationBadge>
            </IconButton>
            <IconButton>
              <FiUser />
            </IconButton>
          </HeaderActions>
        </Header>

        <ContentWrapper>
          <StatsGrid>
            <StatCard
              type="students"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -5 }}
            >
              <div className="icon">
                <FiUsers />
              </div>
              <div className="content">
                <h3>150</h3>
                <p>Total Students</p>
              </div>
            </StatCard>

            <StatCard
              type="applications"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="icon">
                <FiFileText />
              </div>
              <div className="content">
                <h3>45</h3>
                <p>Applications</p>
              </div>
            </StatCard>

            <StatCard
              type="courses"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              whileHover={{ y: -5 }}
            >
              <div className="icon">
                <FiBook />
              </div>
              <div className="content">
                <h3>12</h3>
                <p>Active Courses</p>
              </div>
            </StatCard>

            <StatCard
              type="hours"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              whileHover={{ y: -5 }}
            >
              <div className="icon">
                <FiClock />
              </div>
              <div className="content">
                <h3>24</h3>
                <p>Hours Taught</p>
              </div>
            </StatCard>
          </StatsGrid>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: 'rgba(255, 0, 0, 0.1)',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1rem',
                border: '1px solid rgba(255, 0, 0, 0.3)'
              }}
            >
              {error}
            </motion.div>
          )}

          {teacherData && (
            <>
              <ProfileCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2><FiUser /> Profile Information</h2>
                <div className="profile-info">
                  <div className="info-item">
                    <label>Name</label>
                    <span>{teacherData.full_name}</span>
                  </div>
                  <div className="info-item">
                    <label>Department</label>
                    <span>{teacherData.department}</span>
                  </div>
                  <div className="info-item">
                    <label>Designation</label>
                    <span>{teacherData.designation}</span>
                  </div>
                  <div className="info-item">
                    <label>Email</label>
                    <span>{teacherData.email}</span>
                  </div>
                  <div className="info-item">
                    <label>Experience</label>
                    <span>{teacherData.years_of_experience} years</span>
                  </div>
                </div>
              </ProfileCard>

              <QuickActionsCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2><FiTrendingUp /> Quick Actions</h2>
                <div className="actions-grid">
                  <ActionButton onClick={() => handleNavigation('applications')}>
                    <FiFileText />
                    View Applications
                  </ActionButton>
                  <ActionButton onClick={() => handleNavigation('students')}>
                    <FiUsers />
                    Manage Students
                  </ActionButton>
                  <ActionButton onClick={() => handleNavigation('messages')}>
                    <FiMessageSquare />
                    Messages
                  </ActionButton>
                  <ActionButton onClick={() => handleNavigation('settings')}>
                    <FiSettings />
                    Settings
                  </ActionButton>
                </div>
              </QuickActionsCard>

              <SDGOverviewCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h2><FiTarget /> SDG Goals Overview</h2>
                <div className="sdg-grid">
                  {sdgData.map((sdg, index) => (
                    <div key={index} className="sdg-item">
                      <h3><FiTarget /> {sdg.name}</h3>
                      <p>{sdg.count}</p>
                      <span>{sdg.students} students</span>
                    </div>
                  ))}
                </div>
              </SDGOverviewCard>
            </>
          )}
        </ContentWrapper>
      </MainContent>
    </Container>
  );
};

export default TeacherDashboard; 