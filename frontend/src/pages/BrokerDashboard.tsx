import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Chip,
  Avatar,
  Paper
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  TrendingUp,
  Home,
  AttachMoney
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import ImageUpload from '../components/ImageUpload';
import type { Property, PropertyConfig, OfferType } from '../types';
import api from '../lib/api';

interface PropertyForm {
  configuration: PropertyConfig | '';
  offerType: OfferType | '';
  offerCost: number;
  areaSqft: number;
  address: string;
  street: string;
  city: string;
  images: File[];
}

const initialForm: PropertyForm = {
  configuration: '',
  offerType: '',
  offerCost: 0,
  areaSqft: 0,
  address: '',
  street: '',
  city: '',
  images: []
};

export default function BrokerDashboard() {
  const { user, hasRole } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [formData, setFormData] = useState<PropertyForm>(initialForm);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!hasRole('BROKER')) {
      setError('Access denied. Broker role required.');
      return;
    }
    loadBrokerProperties();
  }, [hasRole]);

  const loadBrokerProperties = async () => {
    setLoading(true);
    try {
      if (!user?.brokerId) {
        setError("Broker profile not found. Please re-login or contact support.");
        setLoading(false);
        return;
      }

      const response = await api.get<Property[]>(`/api/properties/broker/${user.brokerId}`);
      setProperties(response.data);
    } catch (err: any) {
      setError('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (property?: Property) => {
    if (property) {
      setEditingProperty(property);
      setFormData({
        configuration: property.configuration,
        offerType: property.offerType,
        offerCost: property.offerCost,
        areaSqft: property.areaSqft,
        address: property.address,
        street: property.street,
        city: property.city,
        images: [] // Reset images for editing
      });
    } else {
      setEditingProperty(null);
      setFormData(initialForm);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingProperty(null);
    setFormData(initialForm);
  };

  const handleFormChange = (field: keyof PropertyForm, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      setError(null);
      
      // Validation
      if (!formData.configuration || !formData.offerType || !formData.city) {
        setError('Please fill in all required fields');
        return;
      }

      const { images, ...propertyPayload } = formData;
      if (!user?.brokerId) {
        setError('Broker profile not linked to your account');
        return;
      }

      let propertyId: number;

      if (editingProperty) {
        // Update existing property
        const updatedProperty = {
          ...editingProperty,
          ...propertyPayload
        };
        const response = await api.put('/api/properties', updatedProperty);
        propertyId = response.data.propId;
        setSuccess('Property updated successfully');
      } else {
        // Create new property - we need broker ID from user context
        const response = await api.post(`/api/properties?brokerId=${user.brokerId}`, propertyPayload);
        propertyId = response.data.propId;
        setSuccess('Property created successfully');
      }

      // Upload images if any are selected
      if (images && images.length > 0) {
        const imageFormData = new FormData();
        images.forEach((image) => {
          imageFormData.append('files', image);
        });

        await api.post(`/api/properties/${propertyId}/images`, imageFormData);
        setSuccess('Property and images uploaded successfully');
      }

      handleCloseDialog();
      loadBrokerProperties();
    } catch (err: any) {
      setError('Failed to save property');
    }
  };

  const handleDelete = async (propertyId: number) => {
    if (!window.confirm('Are you sure you want to delete this property?')) {
      return;
    }

    try {
      await api.delete(`/api/properties/${propertyId}`);
      setSuccess('Property deleted successfully');
      loadBrokerProperties();
    } catch (err: any) {
      setError('Failed to delete property');
    }
  };

  if (!hasRole('BROKER')) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          Access denied. You must be logged in as a broker to access this page.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <Box
        sx={{
          mb: 5,
          p: 4,
          borderRadius: 4,
          background: "linear-gradient(135deg, #1a237e 0%, #3949ab 45%, #5c6bc0 100%)",
          color: "white",
        }}
      >
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Broker Command Center
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.8 }}>
          Stay on top of your listings, performance metrics, and deal pipeline, {user?.email}.
        </Typography>

        <Grid container spacing={3} sx={{ mt: 1 }}>
          {[
            {
              label: "Total Listings",
              value: properties.length,
              icon: <Home />,
            },
            {
              label: "Available",
              value: properties.filter((p) => p.status).length,
              icon: <Visibility />,
            },
            {
              label: "For Sale",
              value: properties.filter((p) => p.offerType === "SELL").length,
              icon: <AttachMoney />,
            },
            {
              label: "For Rent",
              value: properties.filter((p) => p.offerType === "RENT").length,
              icon: <TrendingUp />,
            },
          ].map((card) => (
            <Grid item xs={12} sm={6} md={3} key={card.label}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  bgcolor: "rgba(255,255,255,0.12)",
                  backdropFilter: "blur(5px)",
                }}
              >
                <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", mb: 2 }}>{card.icon}</Avatar>
                <Typography variant="h4" fontWeight="bold">
                  {card.value}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.75 }}>
                  {card.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {/* Properties Section */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', md: 'center' }, gap: 2, mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          My Properties
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          sx={{ borderRadius: 2, minWidth: 200 }}
        >
          Add New Property
        </Button>
      </Box>

      {/* Properties Grid */}
      <Grid container spacing={3}>
        {properties.map((property) => (
          <Grid item xs={12} sm={6} md={4} key={property.propId}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {property.configuration}
                  </Typography>
                  <Chip
                    label={property.status ? 'Available' : 'Sold'}
                    color={property.status ? 'success' : 'error'}
                    size="small"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {property.address}, {property.city}
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                  ₹{property.offerCost.toLocaleString()}
                </Typography>
                <Typography variant="body2">
                  {property.areaSqft} sq ft • {property.offerType}
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  size="small"
                  startIcon={<Edit />}
                  onClick={() => handleOpenDialog(property)}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  startIcon={<Delete />}
                  color="error"
                  onClick={() => handleDelete(property.propId)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {properties.length === 0 && !loading && (
        <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'grey.50' }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            No properties yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Start by adding your first property listing
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
          >
            Add Your First Property
          </Button>
        </Paper>
      )}

      {/* Add/Edit Property Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingProperty ? 'Edit Property' : 'Add New Property'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Configuration</InputLabel>
                <Select
                  value={formData.configuration}
                  label="Configuration"
                  onChange={(e) => handleFormChange('configuration', e.target.value)}
                >
                  <MenuItem value="FLAT">Flat</MenuItem>
                  <MenuItem value="SHOP">Shop</MenuItem>
                  <MenuItem value="PLOT">Plot</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Offer Type</InputLabel>
                <Select
                  value={formData.offerType}
                  label="Offer Type"
                  onChange={(e) => handleFormChange('offerType', e.target.value)}
                >
                  <MenuItem value="SELL">For Sale</MenuItem>
                  <MenuItem value="RENT">For Rent</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Price"
                type="number"
                fullWidth
                required
                value={formData.offerCost}
                onChange={(e) => handleFormChange('offerCost', Number(e.target.value))}
                InputProps={{
                  startAdornment: '₹'
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Area (sq ft)"
                type="number"
                fullWidth
                required
                value={formData.areaSqft}
                onChange={(e) => handleFormChange('areaSqft', Number(e.target.value))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Address"
                fullWidth
                required
                value={formData.address}
                onChange={(e) => handleFormChange('address', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Street"
                fullWidth
                value={formData.street}
                onChange={(e) => handleFormChange('street', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="City"
                fullWidth
                required
                value={formData.city}
                onChange={(e) => handleFormChange('city', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <ImageUpload
                images={formData.images}
                onImagesChange={(images) => handleFormChange('images', images)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!formData.configuration || !formData.offerType || !formData.city}
          >
            {editingProperty ? 'Update' : 'Create'} Property
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
        onClick={() => handleOpenDialog()}
      >
        <Add />
      </Fab>
    </Container>
  );
}