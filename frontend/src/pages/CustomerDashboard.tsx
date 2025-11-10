import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardActions,
  Button,
  Box,
  Tab,
  Tabs,
  Alert,
  Avatar,
  Paper,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton
} from '@mui/material';
import {
  Favorite,
  Visibility,
  LocationOn,
  Home,
  AttachMoney,
  History
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../hooks/useFavorites';
import { useNavigate } from 'react-router-dom';
import type { Property } from '../types';

interface Deal {
  dealId: number;
  dealDate: string;
  dealCost: number;
  property: Property;
}
import api from '../lib/api';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`customer-tabpanel-${index}`}
      aria-labelledby={`customer-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function CustomerDashboard() {
  const { user, hasRole } = useAuth();
  const { loadFavorites, toggleFavorite } = useFavorites();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState(0);
  const [favoriteProperties, setFavoriteProperties] = useState<Property[]>([]);
  const [dealHistory, setDealHistory] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (hasRole('CUSTOMER')) {
      loadCustomerData();
    }
  }, [hasRole, user]);

  const loadCustomerData = async () => {
    try {
      setLoading(true);
      if (!user?.customerId) {
        setError('Customer profile not found. Please re-login or contact support.');
        setLoading(false);
        return;
      }
      
      // Load favorite properties (customer properties)
      if (user.customerId) {
        const propertiesResponse = await api.get(`/api/customers/${user.customerId}/properties`);
        setFavoriteProperties(propertiesResponse.data);
        
        // Load deal history
        const dealsResponse = await api.get(`/api/customers/${user.customerId}/deals`);
        setDealHistory(dealsResponse.data);
      }
    } catch (err: any) {
      setError('Failed to load customer data');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleViewProperty = (propertyId: number) => {
    navigate(`/properties/${propertyId}`);
  };

  const handleRemoveFavorite = async (propertyId: number) => {
    try {
      await toggleFavorite(propertyId, false);
      // Remove from local state immediately for responsive UI
      setFavoriteProperties(prev => prev.filter(p => p.propId !== propertyId));
      // Reload favorites to ensure sync
      await loadFavorites();
    } catch (err) {
      console.error('Failed to remove favorite:', err);
      setError('Failed to remove favorite property');
    }
  };

  if (!hasRole('CUSTOMER')) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          Access denied. You must be logged in as a customer to access this page.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Paper
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 4,
          background: 'linear-gradient(135deg, #0d47a1 0%, #1976d2 45%, #42a5f5 100%)',
          color: 'white',
        }}
        elevation={6}
      >
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Welcome back, {user?.email?.split('@')[0] || 'Explorer'}
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.85 }}>
          Track saved homes, revisit your favorites, and stay updated on recent activity.
        </Typography>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.18)' }}>
              <Typography variant="h4" fontWeight="bold">
                {favoriteProperties.length}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.75 }}>
                Favorite Properties
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.18)' }}>
              <Typography variant="h4" fontWeight="bold">
                {dealHistory.length}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.75 }}>
                Past Deals
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.18)' }}>
              <Typography variant="h4" fontWeight="bold">
                {favoriteProperties.filter((p) => p.status).length}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.75 }}>
                Still Available
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ mt: 3 }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          aria-label="customer dashboard tabs"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab 
            icon={<Favorite />} 
            label="Favorite Properties" 
            iconPosition="start"
          />
          <Tab 
            icon={<History />} 
            label="Deal History" 
            iconPosition="start"
          />
        </Tabs>

        <TabPanel value={currentTab} index={0}>
          <Typography variant="h5" gutterBottom>
            My Favorite Properties
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Typography>Loading...</Typography>
          ) : favoriteProperties.length === 0 ? (
            <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.50' }}>
              <Favorite sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No Favorite Properties Yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Start browsing properties and add them to your favorites!
              </Typography>
              <Button variant="contained" onClick={() => navigate('/properties')}>
                Browse Properties
              </Button>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {favoriteProperties.map((property) => (
                <Grid item xs={12} sm={6} md={4} key={property.propId}>
                  <Card>
                    <Box sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Home sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="h6">
                          {property.configuration}
                        </Typography>
                        <Chip 
                          label={property.offerType} 
                          color="primary" 
                          size="small"
                          sx={{ ml: 'auto' }}
                        />
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {property.city}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <AttachMoney sx={{ mr: 1, color: 'success.main' }} />
                        <Typography variant="h6" color="success.main">
                          ₹{property.offerCost.toLocaleString()}
                        </Typography>
                      </Box>

                      <Typography variant="body2" color="text.secondary">
                        {property.areaSqft} sq ft
                      </Typography>
                    </Box>

                    <CardActions sx={{ justifyContent: 'space-between' }}>
                      <Button
                        size="small"
                        startIcon={<Visibility />}
                        onClick={() => handleViewProperty(property.propId)}
                      >
                        View Details
                      </Button>
                      <IconButton
                        color="error"
                        onClick={() => handleRemoveFavorite(property.propId)}
                        title="Remove from favorites"
                      >
                        <Favorite />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>

        <TabPanel value={currentTab} index={1}>
          <Typography variant="h5" gutterBottom>
            Deal History
          </Typography>

          {loading ? (
            <Typography>Loading...</Typography>
          ) : dealHistory.length === 0 ? (
            <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.50' }}>
              <History sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No Deal History
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                You haven't made any deals yet. Start exploring properties!
              </Typography>
              <Button variant="contained" onClick={() => navigate('/properties')}>
                Browse Properties
              </Button>
            </Paper>
          ) : (
            <List>
              {dealHistory.map((deal) => (
                <ListItem key={deal.dealId} divider>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <Home />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`Deal #${deal.dealId}`}
                    secondary={`Cost: ₹${deal.dealCost.toLocaleString()} • Date: ${deal.dealDate}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" onClick={() => handleViewProperty(deal.property.propId)}>
                      <Visibility />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </TabPanel>
      </Paper>
    </Container>
  );
}