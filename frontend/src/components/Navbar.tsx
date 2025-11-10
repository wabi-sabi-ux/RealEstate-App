import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Chip,
  Divider
} from '@mui/material';
import { 
  Home, 
  Person, 
  Business, 
  Add, 
  AccountCircle,
  Dashboard,
  Logout,
  Favorite
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from 'react';

export default function Navbar() {
  const { user, logout, hasRole } = useAuth();
  const nav = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    nav("/login");
  };

  return (
    <AppBar 
      position="static" 
      elevation={2}
      sx={{
        background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
      }}
    >
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Home sx={{ mr: 1 }} />
          <Typography 
            variant="h6" 
            component={RouterLink} 
            to="/" 
            sx={{ 
              textDecoration: 'none', 
              color: 'inherit',
              fontWeight: 'bold',
              letterSpacing: '0.5px'
            }}
          >
            RealEstate Pro
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/"
            startIcon={<Home />}
            sx={{ textTransform: 'none' }}
          >
            Home
          </Button>
          
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/brokers"
            startIcon={<Business />}
            sx={{ textTransform: 'none' }}
          >
            Brokers
          </Button>

          {hasRole("BROKER") && (
            <Button 
              color="inherit" 
              component={RouterLink} 
              to="/broker/dashboard"
              startIcon={<Dashboard />}
              sx={{ textTransform: 'none' }}
            >
              Dashboard
            </Button>
          )}

          {hasRole("CUSTOMER") && (
            <Button
              color="inherit"
              component={RouterLink}
              to="/customer/dashboard"
              startIcon={<Favorite />}
              sx={{ textTransform: 'none' }}
            >
              My Space
            </Button>
          )}

          {user ? (
            <>
              <Chip
                avatar={<Avatar sx={{ bgcolor: 'secondary.main' }}>
                  {user.email.charAt(0).toUpperCase()}
                </Avatar>}
                label={user.role}
                variant="outlined"
                sx={{ 
                  color: 'white', 
                  borderColor: 'white',
                  ml: 2 
                }}
              />
              <IconButton
                onClick={handleMenuOpen}
                sx={{ color: 'white' }}
              >
                <AccountCircle />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: { minWidth: 200 }
                }}
              >
                <MenuItem disabled>
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      {user.email}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {user.role}
                    </Typography>
                  </Box>
                </MenuItem>
                <Divider />
                {hasRole("CUSTOMER") && (
                  <MenuItem 
                    onClick={() => { nav("/customer/dashboard"); handleMenuClose(); }}
                  >
                    <Person sx={{ mr: 1 }} />
                    Customer Dashboard
                  </MenuItem>
                )}
                {hasRole("BROKER") && (
                  <>
                    <MenuItem 
                      onClick={() => { nav("/broker/properties"); handleMenuClose(); }}
                    >
                      <Dashboard sx={{ mr: 1 }} />
                      My Listings
                    </MenuItem>
                    <MenuItem 
                      onClick={() => { nav("/broker/add-property"); handleMenuClose(); }}
                    >
                      <Add sx={{ mr: 1 }} />
                      Add Property
                    </MenuItem>
                  </>
                )}
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <Logout sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/login"
                startIcon={<Person />}
                sx={{ textTransform: 'none' }}
              >
                Login
              </Button>
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/signup"
                variant="outlined"
                sx={{ textTransform: 'none', borderRadius: 2, borderColor: 'white', ml: 1 }}
              >
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}