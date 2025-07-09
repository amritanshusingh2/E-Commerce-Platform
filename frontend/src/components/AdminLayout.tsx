import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, AppBar, Toolbar, Typography, IconButton, Avatar, ListItemButton } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InsightsIcon from '@mui/icons-material/Insights';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { useAuth } from '../contexts/AuthContext';

// Enhanced dark theme with better gradients and styling
const AdminBackground = styled(Box)({
  minHeight: '100vh',
  width: '100vw',
  background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%)',
  color: '#fff',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)',
    pointerEvents: 'none',
  }
});

const LogoBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '2rem 1rem 1rem 1rem',
  justifyContent: 'center',
});

const DrawerHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '1.5rem 1rem 1rem 1rem',
  background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
  backdropFilter: 'blur(10px)',
  borderBottom: '1px solid rgba(255,255,255,0.1)',
});

// Enhanced tech logo with better styling
const TechLogo = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#667eea" />
        <stop offset="100%" stopColor="#764ba2" />
      </linearGradient>
    </defs>
    <circle cx="20" cy="20" r="20" fill="url(#logoGradient)" fillOpacity="0.3" />
    <rect x="10" y="10" width="20" height="20" rx="6" fill="url(#logoGradient)" fillOpacity="0.6" />
    <path d="M15 25L25 15M15 15L25 25" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="20" cy="20" r="3" fill="#fff" fillOpacity="0.9" />
  </svg>
);

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
  { text: 'Users', icon: <PeopleIcon />, path: '/admin/users' },
  { text: 'Products', icon: <InventoryIcon />, path: '/admin/products' },
  { text: 'Orders', icon: <ShoppingCartIcon />, path: '/admin/orders' },
  { text: 'Analytics', icon: <InsightsIcon />, path: '/admin/analytics' },
];

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleDrawerOpen = () => setDrawerOpen(true);
  const handleDrawerClose = () => setDrawerOpen(false);

  return (
    <AdminBackground>
      <AppBar 
        position="static" 
        elevation={0} 
        sx={{ 
          background: 'linear-gradient(90deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          color: '#fff',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TechLogo />
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 800, 
                letterSpacing: 2,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                background: 'linear-gradient(45deg, #fff, #f0f0f0)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              ADMIN DASHBOARD
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar 
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)', 
                color: '#fff', 
                fontWeight: 700,
                border: '2px solid rgba(255,255,255,0.3)',
                '&:hover': {
                  border: '2px solid rgba(255,255,255,0.5)',
                }
              }}
            >
              {user?.firstName?.[0] || 'A'}
            </Avatar>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                color: '#fff',
                fontWeight: 600,
                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
              }}
            >
              {user?.firstName || 'Admin'}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
      
      <Box sx={{ 
        p: 4, 
        position: 'relative',
        zIndex: 1,
      }}>
        {children}
      </Box>
    </AdminBackground>
  );
};

export default AdminLayout; 