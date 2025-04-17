import React, { useState } from 'react';
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
  Button
} from '@mui/material';
import {
  Menu as MenuIcon,
  VerifiedUser as VerifiedUserIcon,
  Dashboard as DashboardIcon,
  ExitToApp as LogoutIcon,
  School as SchoolIcon,
  Work as WorkIcon
} from '@mui/icons-material';
import ManagementVerificationList from './ManagementVerificationList';
import ManagementVerificationDetail from './ManagementVerificationDetail';
import InternshipPost from './InternshipPost';

const drawerWidth = 240;

const ManagementDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

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
    }
  ];

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap>
          Management Panel
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem 
            key={item.text}
            onClick={() => navigate(item.path)}
            selected={location.pathname === item.path}
            sx={{ 
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem 
          onClick={handleLogout}
          sx={{ 
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)'
            }
          }}
        >
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </div>
  );

  const DashboardHome = () => (
    <Container>
      <Typography variant="h4" gutterBottom>
        Welcome to Management Dashboard
      </Typography>
      <Typography variant="body1" paragraph>
        Use the sidebar to navigate through different sections.
      </Typography>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Quick Actions
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button
            variant="contained"
            startIcon={<VerifiedUserIcon />}
            onClick={() => navigate('/management/dashboard/verifications')}
          >
            View Pending Verifications
          </Button>
          <Button
            variant="outlined"
            startIcon={<SchoolIcon />}
            onClick={() => navigate('/management/dashboard/teachers')}
          >
            View Teachers
          </Button>
        </Box>
      </Box>
    </Container>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
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
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Management Dashboard
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
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
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
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
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8
        }}
      >
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/verifications" element={<ManagementVerificationList />} />
          <Route path="/verifications/:id" element={<ManagementVerificationDetail />} />
          <Route path="/post-internship" element={<InternshipPost />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default ManagementDashboard; 