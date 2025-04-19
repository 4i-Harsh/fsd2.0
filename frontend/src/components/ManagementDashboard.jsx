import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Container,
  Divider,
  Button,
  Paper,
  Badge,
  Avatar,
  useTheme,
  alpha
} from '@mui/material';
import {
  Menu as MenuIcon,
  VerifiedUser as VerifiedUserIcon,
  Dashboard as DashboardIcon,
  ExitToApp as LogoutIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import ManagementVerificationList from './ManagementVerificationList';
import ManagementVerificationDetail from './ManagementVerificationDetail';
import InternshipPost from './InternshipPost';
import MentorAssignment from './MentorAssignment';

const drawerWidth = 280;

const ManagementDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Simulate loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    navigate('/login');
  };

  const menuItems = [
    {
      text: 'Dashboard Overview',
      icon: <DashboardIcon />,
      path: '/management/dashboard'
    },
    {
      text: 'Teacher Verifications',
      icon: <VerifiedUserIcon />,
      path: '/management/dashboard/verifications'
    },
    {
      text: 'Teachers',
      icon: <SchoolIcon />,
      path: '/management/dashboard/teachers'
    },
    {
      text: 'Post Internship',
      icon: <WorkIcon />,
      path: '/management/dashboard/post-internship'
    },
    {
      text: 'Assign Mentors',
      icon: <AssignmentIcon />,
      path: '/management/dashboard/mentor-assignments'
    }
  ];

  const drawer = (
    <Box sx={{ 
      height: '100%', 
      background: 'linear-gradient(180deg, #000000 0%, #111111 100%)',
      overflowX: 'hidden'
    }}>
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        borderBottom: '1px solid #333',
        background: 'rgba(249, 115, 22, 0.03)',
        height: 64
      }}>
        <Typography variant="h5" sx={{ 
          fontWeight: 'bold', 
          color: '#f97316',
          background: 'linear-gradient(90deg, #f97316, #f97316 70%, #fb923c)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          InternHub <span style={{ color: 'white', WebkitTextFillColor: 'white' }}>Admin</span>
        </Typography>
      </Box>
      <Box sx={{ mt: 2, px: 2 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          p: 2,
          borderRadius: 2,
          mb: 3,
          background: 'rgba(249, 115, 22, 0.1)'
        }}>
          <Avatar sx={{ 
            bgcolor: '#f97316',
            width: 40,
            height: 40
          }}>M</Avatar>
          <Box sx={{ ml: 2 }}>
            <Typography variant="body1" sx={{ color: 'white', fontWeight: 'bold' }}>Admin User</Typography>
            <Typography variant="body2" sx={{ color: 'gray' }}>Management Panel</Typography>
          </Box>
        </Box>
      </Box>
      <List sx={{ px: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem 
              key={item.text}
              onClick={() => navigate(item.path)}
              selected={isActive}
              sx={{ 
                cursor: 'pointer',
                borderRadius: 2,
                mb: 1,
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                color: isActive ? 'white' : '#aaa',
                '&::before': isActive ? {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  height: '100%',
                  width: '4px',
                  backgroundColor: '#f97316',
                  borderRadius: '0 4px 4px 0'
                } : {},
                '&:hover': {
                  backgroundColor: 'rgba(249, 115, 22, 0.1)',
                  color: 'white'
                },
                ...(isActive && {
                  backgroundColor: 'rgba(249, 115, 22, 0.15)',
                  backdropFilter: 'blur(12px)',
                  boxShadow: '0 4px 12px rgba(249, 115, 22, 0.1)'
                })
              }}
            >
              <ListItemIcon sx={{ 
                color: isActive ? '#f97316' : 'inherit',
                minWidth: 40
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ 
                  fontWeight: isActive ? 600 : 400,
                  fontSize: '0.9rem'
                }}
              />
              {isActive && (
                <Box sx={{
                  position: 'absolute',
                  right: 16,
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  bgcolor: '#f97316'
                }}/>
              )}
            </ListItem>
          );
        })}
      </List>
      <Divider sx={{ mt: 2, backgroundColor: 'rgba(255,255,255,0.1)' }} />
      <List sx={{ px: 1, mt: 2 }}>
        <ListItem 
          onClick={handleLogout}
          sx={{ 
            cursor: 'pointer',
            borderRadius: 2,
            color: '#aaa',
            mb: 1,
            '&:hover': {
              backgroundColor: 'rgba(249, 115, 22, 0.1)',
              color: 'white'
            }
          }}
        >
          <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Logout" 
            primaryTypographyProps={{ 
              fontWeight: 400,
              fontSize: '0.9rem'
            }}
          />
        </ListItem>
      </List>
    </Box>
  );

  const DashboardHome = () => (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 4
      }}>
        <Typography variant="h4" sx={{ 
          fontWeight: 'bold',
          color: 'white',
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            left: 0,
            bottom: -8,
            height: 4,
            width: 60,
            background: 'linear-gradient(90deg, #f97316 0%, rgba(249, 115, 22, 0) 100%)',
            borderRadius: 2
          }
        }}>
          Dashboard Overview
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton 
            sx={{ 
              color: 'white', 
              bgcolor: 'rgba(255,255,255,0.05)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
            }}
          >
            <Badge badgeContent={4} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton 
            sx={{ 
              color: 'white', 
              bgcolor: 'rgba(255,255,255,0.05)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
            }}
          >
            <SettingsIcon />
          </IconButton>
        </Box>
      </Box>

      <Box 
        sx={{ 
          display: 'grid', 
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(3, 1fr)'
          }, 
          gap: 3, 
          mb: 4
        }}
      >
        {[
          { title: 'Total Verifications', count: 48, color: '#f97316' },
          { title: 'Pending Verifications', count: 12, color: '#ec4899' },
          { title: 'Total Teachers', count: 87, color: '#3b82f6' }
        ].map((card, index) => (
          <Paper 
            key={index}
            sx={{
              p: 3,
              borderRadius: 2,
              background: 'linear-gradient(145deg, rgba(0,0,0,0.8) 0%, rgba(20,20,20,0.9) 100%)',
              border: '1px solid rgba(255,255,255,0.05)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: `radial-gradient(circle at 10% 10%, ${alpha(card.color, 0.15)}, transparent 80%)`,
                zIndex: 0
              }
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'white', mb: 1 }}>
                {card.count}
              </Typography>
              <Typography variant="body2" sx={{ color: 'gray' }}>
                {card.title}
              </Typography>
            </Box>
            <Box 
              sx={{ 
                position: 'absolute', 
                top: 16, 
                right: 16, 
                width: 40, 
                height: 40, 
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: alpha(card.color, 0.2),
                color: card.color
              }}
            >
              {index === 0 ? <VerifiedUserIcon /> : index === 1 ? <SchoolIcon /> : <WorkIcon />}
            </Box>
          </Paper>
        ))}
      </Box>

      <Box sx={{ mt: 4 }}>
        <Paper 
          sx={{ 
            p: 3, 
            borderRadius: 2,
            background: 'linear-gradient(145deg, rgba(0,0,0,0.8) 0%, rgba(20,20,20,0.9) 100%)',
            border: '1px solid rgba(255,255,255,0.05)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
          }}
        >
          <Typography variant="h5" sx={{ 
            fontWeight: 'bold', 
            color: 'white', 
            mb: 3,
            position: 'relative',
            display: 'inline-block',
            '&::after': {
              content: '""',
              position: 'absolute',
              left: 0,
              bottom: -8,
              height: 3,
              width: '70%',
              background: 'linear-gradient(90deg, #f97316 0%, rgba(249, 115, 22, 0) 100%)',
              borderRadius: 2
            }
          }}>
            Quick Actions
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              startIcon={<VerifiedUserIcon />}
              onClick={() => navigate('/management/dashboard/verifications')}
              sx={{
                bgcolor: '#f97316',
                color: 'white',
                px: 3, 
                py: 1.2,
                borderRadius: '12px',
                fontWeight: 'bold',
                textTransform: 'none',
                '&:hover': {
                  bgcolor: '#ea580c',
                  boxShadow: '0 6px 20px rgba(249, 115, 22, 0.4)'
                }
              }}
            >
              View Pending Verifications
            </Button>
            <Button
              variant="outlined"
              startIcon={<WorkIcon />}
              onClick={() => navigate('/management/dashboard/post-internship')}
              sx={{
                color: '#f97316',
                borderColor: 'rgba(249, 115, 22, 0.5)',
                px: 3, 
                py: 1.2,
                borderRadius: '12px',
                fontWeight: 'bold',
                textTransform: 'none',
                '&:hover': {
                  borderColor: '#f97316',
                  bgcolor: 'rgba(249, 115, 22, 0.04)'
                }
              }}
            >
              Post New Internship
            </Button>
            <Button
              variant="outlined"
              startIcon={<SchoolIcon />}
              onClick={() => navigate('/management/dashboard/teachers')}
              sx={{
                color: 'white',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                px: 3, 
                py: 1.2,
                borderRadius: '12px',
                fontWeight: 'bold',
                textTransform: 'none',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.04)'
                }
              }}
            >
              View Teachers
            </Button>
            <Button
              variant="outlined"
              startIcon={<AssignmentIcon />}
              onClick={() => navigate('/management/dashboard/mentor-assignments')}
              sx={{
                color: '#f97316',
                borderColor: 'rgba(249, 115, 22, 0.5)',
                px: 3, 
                py: 1.2,
                borderRadius: '12px',
                fontWeight: 'bold',
                textTransform: 'none',
                '&:hover': {
                  borderColor: '#f97316',
                  bgcolor: 'rgba(249, 115, 22, 0.04)'
                }
              }}
            >
              Assign Mentors
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );

  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: '#000000'
      }}>
        <Box sx={{
          width: 120,
          height: 120,
          borderRadius: '50%',
          border: '3px solid transparent',
          borderTopColor: '#f97316',
          animation: 'spin 1s linear infinite',
          '@keyframes spin': {
            '0%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(360deg)' }
          }
        }} />
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        display: 'flex',
        minHeight: '100vh',
        bgcolor: '#000000',
        backgroundImage: `
          radial-gradient(at 10% 10%, rgba(249, 115, 22, 0.03) 0px, transparent 50%),
          radial-gradient(at 90% 90%, rgba(249, 115, 22, 0.03) 0px, transparent 50%)
        `,
        backgroundSize: '100% 100%',
        backgroundAttachment: 'fixed'
      }}
    >
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          boxShadow: 'none'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="body1" component="div" sx={{ 
            flexGrow: 1,
            fontWeight: 500,
            color: '#aaa',
            fontSize: '0.95rem'
          }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </Typography>
          <Button 
            color="inherit" 
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            sx={{
              color: '#f97316',
              fontWeight: 'medium',
              textTransform: 'none',
              borderRadius: 2,
              '&:hover': {
                bgcolor: 'rgba(249, 115, 22, 0.1)'
              }
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              borderRight: 'none'
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              borderRight: 'none',
              background: 'transparent'
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
          color: 'white'
        }}
      >
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/verifications" element={<ManagementVerificationList />} />
          <Route path="/verifications/:id" element={<ManagementVerificationDetail />} />
          <Route path="/post-internship" element={<InternshipPost />} />
          <Route path="/mentor-assignments" element={<MentorAssignment />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default ManagementDashboard; 