import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiSearch, FiBell, FiUser, FiHome, FiMessageSquare, FiSettings, FiLogOut, FiMenu, FiX, FiFileText, FiUsers, FiBook, FiCalendar, FiFilter, FiDownload, FiMail, FiPhone, FiBarChart, FiMoreHorizontal, FiEye, FiEdit, FiTarget } from 'react-icons/fi';
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

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: rgba(25, 25, 30, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid ${props => props.color ? `rgba(${props.color}, 0.2)` : 'rgba(255, 107, 0, 0.1)'};
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 1rem;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  }
  
  .icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: ${props => props.color ? `rgba(${props.color}, 0.15)` : 'rgba(255, 107, 0, 0.15)'};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => props.iconColor || '#ff6b00'};
  }
  
  .content {
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

const TableWrapper = styled.div`
  background: rgba(25, 25, 30, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(83, 166, 0, 0.1);
  overflow: hidden;
  margin-bottom: 2rem;
`;

const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  h2 {
    color: #53a600;
    font-size: 1.3rem;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .actions {
    display: flex;
    gap: 1rem;
  }
`;

const FilterButton = styled.button`
  background: rgba(35, 35, 40, 0.6);
  border: 1px solid rgba(83, 166, 0, 0.1);
  border-radius: 8px;
  padding: 0.5rem 1rem;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;

  &:hover {
    background: rgba(83, 166, 0, 0.1);
    border-color: #53a600;
  }

  svg {
    width: 1rem;
    height: 1rem;
    color: #53a600;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  
  th {
    text-align: left;
    padding: 1rem;
    color: #999;
    font-weight: 500;
    font-size: 0.9rem;
    border-bottom: 1px solid rgba(83, 166, 0, 0.1);
  }
  
  td {
    padding: 1rem;
    color: white;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    font-size: 0.95rem;
    
    &:last-child {
      text-align: right;
    }
    
    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(83, 166, 0, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #53a600;
      font-weight: 600;
      font-size: 1.1rem;
    }
    
    .student-name {
      font-weight: 500;
    }
    
    .student-email {
      color: #999;
      font-size: 0.85rem;
    }
    
    .progress-bar {
      width: 100%;
      height: 8px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      margin-top: 0.5rem;
      overflow: hidden;
      
      .progress {
        height: 100%;
        background: ${props => props.progressColor || '#53a600'};
        border-radius: 4px;
      }
    }
    
    .badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 50px;
      font-size: 0.8rem;
      font-weight: 500;
      
      &.active {
        background: rgba(83, 166, 0, 0.1);
        color: #53a600;
        border: 1px solid rgba(83, 166, 0, 0.3);
      }
      
      &.inactive {
        background: rgba(153, 153, 153, 0.1);
        color: #999;
        border: 1px solid rgba(153, 153, 153, 0.3);
      }
    }
    
    .sdg-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.3rem;
      margin-top: 0.3rem;
    }
    
    .sdg-tag {
      background: rgba(83, 166, 0, 0.1);
      border: 1px solid rgba(83, 166, 0, 0.3);
      color: #53a600;
      border-radius: 20px;
      padding: 0.2rem 0.5rem;
      font-size: 0.7rem;
      display: flex;
      align-items: center;
      gap: 0.3rem;
      white-space: nowrap;
    }
  }
  
  tr {
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba(83, 166, 0, 0.05);
    }
  }
`;

const ActionButtonSmall = styled.button`
  background: rgba(35, 35, 40, 0.6);
  border: 1px solid rgba(83, 166, 0, 0.1);
  color: white;
  border-radius: 8px;
  padding: 0.4rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: rgba(83, 166, 0, 0.1);
    border-color: #53a600;
  }
  
  svg {
    width: 1rem;
    height: 1rem;
    color: #53a600;
  }
`;

const ActionButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
`;

const TeacherStudents = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Sample data for students
  useEffect(() => {
    // Mock data - in a real app, this would be an API call
    const mockStudents = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        course: 'Computer Science',
        year: 3,
        gpa: 3.8,
        progress: 92,
        status: 'active',
        internships: 2,
        sdgs: ['Quality Education', 'Gender Equality']
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        course: 'Electrical Engineering',
        year: 2,
        gpa: 3.6,
        progress: 85,
        status: 'active',
        internships: 1,
        sdgs: ['Climate Action', 'Sustainable Cities']
      },
      {
        id: 3,
        name: 'Alice Johnson',
        email: 'alice.johnson@example.com',
        course: 'Data Science',
        year: 4,
        gpa: 3.9,
        progress: 97,
        status: 'active',
        internships: 3,
        sdgs: ['Good Health', 'Clean Water']
      },
      {
        id: 4,
        name: 'Robert Brown',
        email: 'robert.brown@example.com',
        course: 'Mechanical Engineering',
        year: 3,
        gpa: 3.4,
        progress: 78,
        status: 'inactive',
        internships: 0,
        sdgs: ['Industry Innovation']
      },
      {
        id: 5,
        name: 'Emily Wilson',
        email: 'emily.wilson@example.com',
        course: 'Information Technology',
        year: 2,
        gpa: 3.7,
        progress: 88,
        status: 'active',
        internships: 1,
        sdgs: ['Affordable Clean Energy', 'Responsible Consumption']
      },
      {
        id: 6,
        name: 'Michael Cheng',
        email: 'michael.cheng@example.com',
        course: 'Computer Engineering',
        year: 3,
        gpa: 3.5,
        progress: 83,
        status: 'active',
        internships: 2,
        sdgs: ['Decent Work', 'No Poverty']
      },
      {
        id: 7,
        name: 'Sarah Davis',
        email: 'sarah.davis@example.com',
        course: 'Artificial Intelligence',
        year: 4,
        gpa: 4.0,
        progress: 95,
        status: 'active',
        internships: 2,
        sdgs: ['Partnership for Goals', 'Zero Hunger']
      },
    ];
    
    setTimeout(() => {
      setStudents(mockStudents);
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
        navigate('/teacher/applications');
        break;
      case 'students':
        // Already on students page
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
  
  const handleViewStudent = (id) => {
    // Navigate to student details page
    navigate(`/teacher/students/${id}`);
  };
  
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('');
  };
  
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.course.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const activeStudents = students.filter(student => student.status === 'active').length;
  const totalInternships = students.reduce((acc, student) => acc + student.internships, 0);
  const averageGPA = students.length > 0 
    ? (students.reduce((acc, student) => acc + student.gpa, 0) / students.length).toFixed(2)
    : 0;

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
          active={false} 
          onClick={() => handleNavigation('applications')}
        >
          <FiFileText />
          <span>Applications</span>
        </SidebarItem>
        
        <SidebarItem 
          as={motion.div}
          whileHover={{ x: 5 }}
          isOpen={isSidebarOpen} 
          active={true} 
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
            <input 
              type="text" 
              placeholder="Search students..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
            <h1><FiUsers style={{ color: '#53a600' }} /> Student Management</h1>
            <p>View and manage student information, track progress, and review academic performance.</p>
          </PageTitle>
          
          <StatsRow>
            <StatCard color="83, 166, 0" iconColor="#53a600">
              <div className="icon">
                <FiUsers />
              </div>
              <div className="content">
                <h3>{students.length}</h3>
                <p>Total Students</p>
              </div>
            </StatCard>
            
            <StatCard color="0, 153, 255" iconColor="#0099ff">
              <div className="icon">
                <FiBarChart />
              </div>
              <div className="content">
                <h3>{averageGPA}</h3>
                <p>Average GPA</p>
              </div>
            </StatCard>
            
            <StatCard color="255, 107, 0" iconColor="#ff6b00">
              <div className="icon">
                <FiFileText />
              </div>
              <div className="content">
                <h3>{totalInternships}</h3>
                <p>Total Internships</p>
              </div>
            </StatCard>
            
            <StatCard color="83, 166, 0" iconColor="#53a600">
              <div className="icon">
                <FiCheckCircle />
              </div>
              <div className="content">
                <h3>{activeStudents}</h3>
                <p>Active Students</p>
              </div>
            </StatCard>
          </StatsRow>
          
          <TableWrapper>
            <TableHeader>
              <h2><FiUsers /> Student List</h2>
              <div className="actions">
                <FilterButton>
                  <FiFilter /> Filter
                </FilterButton>
                <FilterButton>
                  <FiDownload /> Export
                </FilterButton>
              </div>
            </TableHeader>
            
            {loading ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                Loading students...
              </div>
            ) : filteredStudents.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                No students found.
              </div>
            ) : (
              <Table>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Course</th>
                    <th>Year</th>
                    <th>GPA</th>
                    <th>Progress</th>
                    <th>Status</th>
                    <th>Internships</th>
                    <th>SDG Focus</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map(student => (
                    <tr key={student.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div className="avatar">
                            {getInitials(student.name)}
                          </div>
                          <div>
                            <div className="student-name">{student.name}</div>
                            <div className="student-email">{student.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>{student.course}</td>
                      <td>Year {student.year}</td>
                      <td>{student.gpa}</td>
                      <td>
                        <div>{student.progress}%</div>
                        <div className="progress-bar">
                          <div className="progress" style={{ width: `${student.progress}%` }}></div>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${student.status}`}>
                          {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                        </span>
                      </td>
                      <td>{student.internships}</td>
                      <td>
                        <div className="sdg-tags">
                          {student.sdgs && student.sdgs.map((sdg, index) => (
                            <span key={index} className="sdg-tag">
                              <FiTarget size={10} /> {sdg}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <ActionButtonGroup>
                          <ActionButtonSmall onClick={() => handleViewStudent(student.id)}>
                            <FiEye />
                          </ActionButtonSmall>
                          <ActionButtonSmall>
                            <FiEdit />
                          </ActionButtonSmall>
                          <ActionButtonSmall>
                            <FiMoreHorizontal />
                          </ActionButtonSmall>
                        </ActionButtonGroup>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </TableWrapper>
        </ContentWrapper>
      </MainContent>
    </Container>
  );
};

export default TeacherStudents; 