import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InternshipListing from './InternshipListing';
import ApplicationHistory from './ApplicationHistory';
import styled from 'styled-components';
import { FiSearch, FiBookmark, FiBriefcase, FiBell, FiUser, FiPieChart, FiCheckCircle, FiStar, FiCalendar, FiFilter, FiArrowRight, FiMapPin, FiHome, FiMessageSquare, FiSettings, FiLogOut, FiMenu, FiX, FiChevronRight, FiFileText, FiHeart } from 'react-icons/fi';
import { motion, AnimatePresence, useAnimation, useScroll, useSpring, useTransform } from 'framer-motion';
import { keyframes } from 'styled-components';

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const Container = styled.div`
  min-height: 100vh;
  background-color: #000;
  color: white;
  display: flex;
  flex-direction: column;
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
    animation: gridMove 20s linear infinite;
  }

  @keyframes gridMove {
    0% { transform: translateY(0); }
    100% { transform: translateY(30px); }
  }

  &::after {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 100vh;
    background: radial-gradient(circle at 50% 50%, 
      rgba(255, 107, 0, 0.1) 0%,
      rgba(0, 0, 0, 0) 70%);
    pointer-events: none;
    z-index: 1;
  }
`;

const Header = styled.header`
  background: rgba(10, 10, 10, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3),
              0 0 10px rgba(255, 107, 0, 0.1);
  z-index: 10;
  padding: 0.75rem 1.5rem;
  height: 64px;
  position: sticky;
  top: 0;
  border-bottom: 1px solid rgba(255, 107, 0, 0.1);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, 
      transparent, 
      rgba(255, 107, 0, 0.3), 
      transparent
    );
  }

  .header-content {
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
  }

  .left-section {
    display: flex;
    align-items: center;
    margin-left: -0.5rem;
  }

  .menu-button {
    padding: 0.5rem;
  display: flex;
    align-items: center;
    justify-content: center;
    color: #666;
    transition: all 0.3s ease;
    margin-right: 0.5rem;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      background: rgba(255, 107, 0, 0.2);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      transition: width 0.4s ease, height 0.4s ease;
    }

    &:hover {
      color: #ff6b00;
      
      &::before {
        width: 150%;
        height: 150%;
      }
    }

    svg {
      width: 1.5rem;
      height: 1.5rem;
      position: relative;
      z-index: 1;
    }
  }

  .right-section {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .notification-section {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-right: 1rem;
    padding-right: 1rem;
    border-right: 1px solid rgba(255, 255, 255, 0.1);
  }
`;

const Logo = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  background: linear-gradient(
    45deg,
    #ff6b00,
    #ff8533,
    #ff6b00
  );
  background-size: 200% auto;
  color: transparent;
  -webkit-background-clip: text;
  background-clip: text;
  animation: ${gradientAnimation} 3s linear infinite;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, #ff6b00, transparent);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
  }
  
  &:hover::after {
    transform: scaleX(1);
  }
`;

const SearchBar = styled.div`
  position: relative;
  display: none;
  
  @media (min-width: 768px) {
    display: block;
  }
  
  input {
    width: 300px;
    background: rgba(34, 34, 34, 0.8);
    border: 1px solid rgba(255, 107, 0, 0.1);
    border-radius: 12px;
    padding: 0.75rem 1rem 0.75rem 3rem;
    color: white;
    font-size: 0.875rem;
    transition: all 0.3s ease;
    
    &:focus {
      outline: none;
      border-color: #ff6b00;
      box-shadow: 0 0 15px rgba(255, 107, 0, 0.2);
      background: rgba(34, 34, 34, 0.95);
      width: 350px;
    }

    &::placeholder {
      color: rgba(255, 255, 255, 0.4);
      transition: color 0.3s ease;
    }

    &:focus::placeholder {
      color: rgba(255, 255, 255, 0.6);
    }
  }
  
  svg {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #666;
    transition: all 0.3s ease;
  }
  
  &:focus-within svg {
    color: #ff6b00;
    transform: translateY(-50%) scale(1.1);
  }
`;

const NotificationButton = styled.button`
  position: relative;
  padding: 0.5rem;
  border-radius: 12px;
  color: white;
  transition: all 0.3s ease;
  background: rgba(34, 34, 34, 0.8);
  margin: 0 0.5rem;

  &:hover {
    background: rgba(34, 34, 34, 0.95);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }

  .notification-dot {
    position: absolute;
    top: 0.25rem;
    right: 0.25rem;
    width: 0.5rem;
    height: 0.5rem;
    background: linear-gradient(45deg, #ff6b00, #ff8533);
    border-radius: 50%;
    box-shadow: 0 0 10px rgba(255, 107, 0, 0.5);
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.5); opacity: 0.5; }
    100% { transform: scale(1); opacity: 1; }
  }
`;

const ProfileButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  color: white;
  transition: all 0.3s ease;
  background: transparent;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 107, 0, 0.1);
    border-radius: 12px;
    opacity: 0;
    transform: scale(0.9);
    transition: all 0.3s ease;
  }
  
  &:hover::before {
    opacity: 1;
    transform: scale(1);
  }
  
  .avatar {
    width: 2.25rem;
    height: 2.25rem;
    background: linear-gradient(135deg, #ff6b00, #ff8533);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 15px rgba(255, 107, 0, 0.3);
    transition: all 0.3s ease;
    position: relative;
    z-index: 1;
    
    &::after {
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      background: linear-gradient(135deg, #ff6b00, #ff8533);
      border-radius: 50%;
      z-index: -1;
      opacity: 0;
      transition: all 0.3s ease;
    }
    
    svg {
      width: 1.25rem;
      height: 1.25rem;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
    }
  }
  
  .user-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    position: relative;
    z-index: 1;
    
    .role {
      font-size: 0.75rem;
      color: #ff6b00;
      font-weight: 500;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
    
    .username {
      font-size: 0.875rem;
      font-weight: 600;
      color: white;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
  }

  &:hover {
    .avatar {
      transform: scale(1.05);
      
      &::after {
        opacity: 0.4;
        transform: scale(1.2);
      }
    }
  }
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  overflow: hidden;
  position: relative;
  z-index: 1;
`;

const Sidebar = styled.aside`
  width: 16rem;
  background-color: rgba(17, 17, 17, 0.95);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(34, 34, 34, 0.5);
  padding: 1.5rem 1rem;
  display: none;
  transition: all 0.3s ease;
  
  @media (min-width: 1024px) {
    display: block;
  }
  
  &.collapsed {
    width: 5rem;
    padding: 1.5rem 0.5rem;
  }
`;

const SidebarItem = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  width: 100%;
  color: ${props => props.$active ? 'white' : '#666'};
  background-color: ${props => props.$active ? 'rgba(34, 34, 34, 0.8)' : 'transparent'};
  border-radius: 0.75rem;
  transition: all 0.3s ease;
  margin-bottom: 0.5rem;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 3px;
    background: #ff6b00;
    transform: scaleY(0);
    transition: transform 0.3s ease;
  }
  
  &:hover {
    background-color: rgba(34, 34, 34, 0.8);
    color: white;
    transform: translateX(5px);
  }
  
  &.active::before {
    transform: scaleY(1);
  }
  
  svg {
    font-size: 1.25rem;
    transition: transform 0.3s ease;
  }
  
  &:hover svg {
    transform: scale(1.1);
  }
  
  .badge {
    margin-left: auto;
    background: linear-gradient(135deg, #ff6b00, #ff8533);
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    box-shadow: 0 0 10px rgba(255, 107, 0, 0.3);
  }
`;

const ContentArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  background-color: #000;
`;

const ProfileCompletion = styled.div`
  background-color: #111;
  border: 1px solid #222;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    
    h2 {
      font-size: 1.25rem;
      font-weight: 600;
      color: white;
    }
    
    .percentage {
      color: #ff6b00;
    font-weight: 600;
    }
  }
  
  .progress-bar {
    width: 100%;
    height: 0.5rem;
    background-color: #222;
    border-radius: 9999px;
    overflow: hidden;
    margin-bottom: 1rem;
    
    .progress {
      height: 100%;
      background-color: #ff6b00;
      border-radius: 9999px;
      transition: width 0.3s ease;
    }
  }
  
  .sections {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    
    .section {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      
      svg {
        color: ${props => props.$completed ? '#00ff00' : '#666'};
  }

  span {
        color: ${props => props.$completed ? 'white' : '#666'};
        font-size: 0.875rem;
      }
    }
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled(motion.div)`
  background: linear-gradient(145deg, rgba(30, 25, 20, 0.9), rgba(20, 15, 10, 0.9));
  border: 1px solid rgba(255, 107, 0, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 107, 0, 0.3), transparent);
  }

  .stat-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
    position: relative;
    z-index: 1;
  }

  .label {
    font-size: 0.875rem;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 0.5rem;
  }

  .value {
    font-size: 2.5rem;
    font-weight: 700;
    background: linear-gradient(45deg, #ff6b00, #ff8533);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    line-height: 1;
  }

  .icon-container {
    width: 48px;
    height: 48px;
    background: rgba(255, 107, 0, 0.1);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at center, rgba(255, 107, 0, 0.2), transparent);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    svg {
      font-size: 1.5rem;
      color: #ff6b00;
      filter: drop-shadow(0 0 8px rgba(255, 107, 0, 0.3));
    }
  }

    &:hover {
    .icon-container::before {
      opacity: 1;
    }
  }
`;

const RecentInternships = styled.div`
  background: linear-gradient(145deg, rgba(30, 25, 20, 0.9), rgba(20, 15, 10, 0.9));
  border: 1px solid rgba(255, 107, 0, 0.1);
  border-radius: 20px;
  padding: 2rem;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;

    h2 {
      font-size: 1.5rem;
      font-weight: 600;
  color: white;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .view-all {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #ff6b00;
      font-size: 0.875rem;
      padding: 0.5rem 1rem;
      border-radius: 12px;
      background: rgba(255, 107, 0, 0.1);
      transition: all 0.3s ease;

      &:hover {
        background: rgba(255, 107, 0, 0.2);
        transform: translateX(5px);
      }
    }
  }

  .internship-list {
    display: grid;
    gap: 1rem;
  }
`;

const InternshipCard = styled(motion.div)`
  background: rgba(30, 25, 20, 0.6);
  border: 1px solid rgba(255, 107, 0, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, transparent, rgba(255, 107, 0, 0.03), transparent);
    transform: translateX(-100%);
    transition: transform 0.6s ease;
  }

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(255, 107, 0, 0.3);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);

    &::before {
      transform: translateX(100%);
    }
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1.5rem;

    .title {
      font-size: 1.25rem;
      font-weight: 600;
      color: white;
      margin-bottom: 0.5rem;
    }

    .company {
      color: #ff6b00;
      font-size: 1rem;
      margin-bottom: 0.5rem;
    }

    .location {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #666;
      font-size: 0.875rem;

      svg {
        color: #ff6b00;
      }
    }
  }

  .actions {
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;

    button {
      flex: 1;
      padding: 0.75rem 1.5rem;
      border-radius: 12px;
      font-size: 0.875rem;
      font-weight: 500;
      transition: all 0.3s ease;

      &.primary {
        background: linear-gradient(45deg, #ff6b00, #ff8533);
        color: white;
        border: none;
        box-shadow: 0 4px 15px rgba(255, 107, 0, 0.2);

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 107, 0, 0.3);
        }
      }

      &.secondary {
        background: rgba(255, 255, 255, 0.05);
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.1);

        &:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }
      }
    }
  }
`;

const MotionContainer = styled(motion.div)`
  min-height: 100vh;
  background-color: #000;
  color: white;
  display: flex;
  flex-direction: column;
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
    animation: gridMove 20s linear infinite;
  }

  @keyframes gridMove {
    0% { transform: translateY(0); }
    100% { transform: translateY(30px); }
  }

  &::after {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 100vh;
    background: radial-gradient(circle at 50% 50%, 
      rgba(255, 107, 0, 0.1) 0%,
      rgba(0, 0, 0, 0) 70%);
    pointer-events: none;
    z-index: 1;
  }
`;

const FloatingParticle = styled(motion.div)`
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(255, 107, 0, 0.5);
  border-radius: 50%;
  pointer-events: none;
`;

const PageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.5 }
};

const StaggerContainer = styled(motion.div)`
  display: contents;
`;

const FloatingCard = styled(motion.div)`
  transform-style: preserve-3d;
  perspective: 1000px;
`;

const StudentDashboard = () => {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const controls = useAnimation();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const stats = {
    applications: 12,
    saved: 24,
    interviews: 3,
    profileCompletion: 85
  };

  const recentInternships = [
    { id: 1, title: "Frontend Developer Intern", company: "Google", location: "Remote", posted: "2 days ago", isSaved: true },
    { id: 2, title: "UX Design Intern", company: "Microsoft", location: "Seattle, WA", posted: "3 days ago", isSaved: false },
    { id: 3, title: "Data Science Intern", company: "Amazon", location: "New York, NY", posted: "1 week ago", isSaved: true },
  ];

  // Create particles
  const particles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    initialX: Math.random() * 100,
    initialY: Math.random() * 100,
  }));

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

  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    });
  }, [controls]);

  const handleTabChange = (tab) => {
    if (tab === 'profile') {
      navigate('/student-profile');
      return;
    }
    setActiveTab(tab);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FiHome },
    { id: 'internships', label: 'Internships', icon: FiBriefcase },
    { id: 'applications', label: 'Applications', icon: FiFileText },
    { id: 'saved', label: 'Saved', icon: FiHeart },
    { id: 'messages', label: 'Messages', icon: FiMessageSquare, badge: 3 },
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'settings', label: 'Settings', icon: FiSettings },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-red-500">
        {error}
      </div>
    );
  }

  return (
    <MotionContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Floating particles */}
      {particles.map(particle => (
        <FloatingParticle
          key={particle.id}
          initial={{ 
            x: `${particle.initialX}%`, 
            y: `${particle.initialY}%`,
            opacity: 0.5 
          }}
          animate={{ 
            x: [`${particle.initialX}%`, `${particle.initialX + 10}%`],
            y: [`${particle.initialY}%`, `${particle.initialY + 10}%`],
            opacity: [0.5, 0, 0.5]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Progress bar */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: '#ff6b00',
          transformOrigin: '0%',
          scaleX,
          zIndex: 100
        }}
      />

      <Header>
        <motion.div 
          className="header-content"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.5,
            type: "spring",
            stiffness: 100 
          }}
        >
          <div className="left-section">
            <motion.button 
              onClick={toggleSidebar} 
              className="menu-button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiMenu />
            </motion.button>
            <Logo>InternHub</Logo>
          </div>

          <div className="right-section">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <SearchBar>
                <input type="text" placeholder="Search internships..." />
                <FiSearch />
              </SearchBar>
            </motion.div>

            <motion.div 
              className="notification-section"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <NotificationButton onClick={toggleNotifications}>
                <FiBell className="h-5 w-5" />
                {notifications.length > 0 && <span className="notification-dot" />}
              </NotificationButton>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <ProfileButton>
                <div className="avatar">
                  <FiUser />
                </div>
                <div className="user-info">
                  <span className="role">Student</span>
                  <span className="username">{studentData?.full_name || 'Student'}</span>
                </div>
              </ProfileButton>
            </motion.div>
          </div>
        </motion.div>
      </Header>
      
      <MainContent>
        <AnimatePresence mode="wait">
          <Sidebar className={sidebarOpen ? '' : 'collapsed'}>
            <StaggerContainer
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
            >
              {sidebarItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 }
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <SidebarItem
                    $active={activeTab === item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={activeTab === item.id ? 'active' : ''}
                  >
                    <item.icon />
                    {sidebarOpen && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {item.label}
                      </motion.span>
                    )}
                    {sidebarOpen && item.badge && (
                      <motion.span
                        className="badge"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30
                        }}
                      >
                        {item.badge}
                      </motion.span>
                    )}
                  </SidebarItem>
                </motion.div>
              ))}
            </StaggerContainer>
          </Sidebar>

          <ContentArea>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={PageTransition}
              >
                {activeTab === 'dashboard' && (
                  <StaggerContainer
                    initial="hidden"
                    animate="visible"
                    variants={{
                      visible: {
                        transition: {
                          staggerChildren: 0.1
                        }
                      }
                    }}
                  >
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 }
                      }}
                    >
                      <StatsGrid>
                        {[
                          { label: 'APPLICATIONS', value: '12', icon: FiBriefcase },
                          { label: 'SAVED', value: '24', icon: FiBookmark },
                          { label: 'INTERVIEWS', value: '3', icon: FiStar },
                          { label: 'PROFILE COMPLETION', value: '85', icon: FiPieChart, suffix: '%' }
                        ].map((stat, index) => (
                          <StatCard
                            key={stat.label}
                            whileHover={{ 
                              scale: 1.02,
                              transition: { duration: 0.2 }
                            }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ 
                              opacity: 1, 
                              y: 0,
                              transition: { delay: index * 0.1 }
                            }}
                          >
                            <div className="stat-header">
                              <div>
                                <div className="label">{stat.label}</div>
                                <div className="value">
                                  {stat.value}{stat.suffix || ''}
                                </div>
                              </div>
                              <div className="icon-container">
                                <stat.icon />
                              </div>
                            </div>
                          </StatCard>
                        ))}
                      </StatsGrid>
                    </motion.div>

                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 }
                      }}
                    >
                      <RecentInternships>
                        <div className="header">
                          <h2>
                            <FiBriefcase />
                            Recent Internships
                          </h2>
                          <motion.button 
                            className="view-all"
                            whileHover={{ x: 5 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            View all <FiArrowRight />
                          </motion.button>
                        </div>
                        <div className="internship-list">
                          {recentInternships.map((internship, index) => (
                            <InternshipCard
                              key={internship.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ 
                                opacity: 1, 
                                x: 0,
                                transition: { delay: index * 0.1 }
                              }}
                              whileHover={{ scale: 1.01 }}
                            >
                              <div className="header">
                                <div>
                                  <div className="title">{internship.title}</div>
                                  <div className="company">{internship.company}</div>
                                  <div className="location">
                                    <FiMapPin />
                                    {internship.location}
                                  </div>
                                </div>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  style={{ color: internship.isSaved ? '#ff6b00' : '#666' }}
                                >
                                  <FiBookmark />
                                </motion.button>
                              </div>
                              <div className="actions">
                                <motion.button 
                                  className="primary"
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  Apply Now
                                </motion.button>
                                <motion.button 
                                  className="secondary"
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  View Details
                                </motion.button>
                              </div>
                            </InternshipCard>
                          ))}
                        </div>
                      </RecentInternships>
                    </motion.div>
                  </StaggerContainer>
                )}

                {activeTab === 'internships' && <InternshipListing />}
                {activeTab === 'applications' && <ApplicationHistory />}
              </motion.div>
            </AnimatePresence>
          </ContentArea>
        </AnimatePresence>
      </MainContent>
    </MotionContainer>
  );
};

export default StudentDashboard;