import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Alert, 
  Skeleton, 
  Box, 
  Card, 
  CardMedia, 
  Grid, 
  Chip, 
  Button, 
  Avatar, 
  Rating, 
  Divider,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import { 
  LocationOn, 
  Home, 
  AspectRatio, 
  Phone, 
  Email, 
  Favorite, 
  FavoriteBorder,
  Share,
  AttachMoney 
} from '@mui/icons-material';

import type { Property } from '../types';
import api from '../lib/api';
import { resolveImageUrl } from '../lib/imageUtils';
import PropertyComments from '../components/PropertyComments';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../hooks/useFavorites';
import { createDeal } from '../lib/propertyApi';

export default function PropertyDetails() {
  const { id } = useParams<{ id: string }>();
  const { user, hasRole } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offerDialogOpen, setOfferDialogOpen] = useState(false);
  const [offerAmount, setOfferAmount] = useState<number>(0);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchProperty(parseInt(id));
    }
  }, [id]);

  const fetchProperty = async (propertyId: number) => {
    try {
      setLoading(true);
  const response = await api.get(`/api/properties/${propertyId}`);
      setProperty(response.data);
    } catch (err: any) {
      setError('Failed to load property details');
    } finally {
      setLoading(false);
    }
  };

  const handleMakeOffer = () => {
    if (!hasRole('CUSTOMER')) {
      setError('Please log in as a customer to make an offer');
      return;
    }
    if (property) {
      setOfferAmount(property.offerCost);
      setOfferDialogOpen(true);
    }
  };

  const handleSubmitOffer = async () => {
    if (!property || !user) return;
    
    try {
      await createDeal(property.propId, offerAmount);
      setSuccess('Offer submitted successfully!');
      setOfferDialogOpen(false);
    } catch (err) {
      setError('Failed to submit offer. Please try again.');
    }
  };

  const handleContactBroker = () => {
    if (property?.broker) {
      // In a real app, this would open a contact form or chat
      alert(`Contact ${property.broker.broName} at their office or through the platform messaging system.`);
    }
  };

  const handleSaveProperty = async () => {
    if (!hasRole('CUSTOMER') || !property) {
      setError('Please log in as a customer to save properties');
      return;
    }
    
    try {
      const currentlyFavorited = isFavorite(property.propId);
      await toggleFavorite(property.propId, !currentlyFavorited);
      setSuccess(currentlyFavorited ? 'Property removed from favorites!' : 'Property saved to your favorites!');
    } catch (err) {
      setError('Failed to update favorites');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Skeleton variant="rectangular" height={400} />
      </Container>
    );
  }

  if (error || !property) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error || 'Property not found'}</Alert>
      </Container>
    );
  }

  const resolvedImages = (property.imageUrls || [])
    .map(resolveImageUrl)
    .filter((src): src is string => Boolean(src));

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {/* Property Images */}
        <Grid item xs={12} md={8}>
          <Card>
            {resolvedImages.length > 0 ? (
              <>
                <CardMedia
                  component="img"
                  height="400"
                  image={resolvedImages[0]}
                  alt={`${property.configuration} in ${property.city}`}
                  sx={{
                    objectFit: 'cover'
                  }}
                />
                
                {/* Additional Images Thumbnails */}
                {resolvedImages.length > 1 && (
                  <Box sx={{ p: 2, display: 'flex', gap: 1, overflowX: 'auto' }}>
                    {resolvedImages.slice(1).map((imageUrl, index) => (
                      <Box
                        key={index}
                        component="img"
                        src={imageUrl}
                        alt={`Property image ${index + 2}`}
                        sx={{
                          width: 80,
                          height: 80,
                          objectFit: 'cover',
                          borderRadius: 1,
                          cursor: 'pointer',
                          '&:hover': {
                            opacity: 0.8
                          }
                        }}
                      />
                    ))}
                  </Box>
                )}
              </>
            ) : (
              <Box
                sx={{
                  height: 400,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#f5f5f5',
                  color: '#666'
                }}
              >
                <Home sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
                <Typography variant="h6" gutterBottom>
                  No Images Available
                </Typography>
                <Typography variant="body2">
                  Property images will be displayed here once uploaded
                </Typography>
              </Box>
            )}
          </Card>
        </Grid>

        {/* Property Summary */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              ₹{property.offerCost.toLocaleString()}
            </Typography>
            <Chip 
              label={property.offerType} 
              color="primary" 
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocationOn sx={{ mr: 1 }} />
              <Typography variant="body1">{property.city}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Home sx={{ mr: 1 }} />
              <Typography variant="body1">{property.configuration}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <AspectRatio sx={{ mr: 1 }} />
              <Typography variant="body1">{property.areaSqft} sq ft</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
              <Button 
                variant="contained" 
                fullWidth 
                startIcon={<AttachMoney />}
                onClick={() => handleMakeOffer()}
              >
                Make Offer
              </Button>
              <Button 
                variant="outlined" 
                fullWidth 
                startIcon={<Phone />}
                onClick={() => handleContactBroker()}
              >
                Contact Broker
              </Button>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button 
                  variant="outlined" 
                  startIcon={property && isFavorite(property.propId) ? <Favorite color="error" /> : <FavoriteBorder />}
                  onClick={() => handleSaveProperty()}
                >
                  {property && isFavorite(property.propId) ? 'Remove' : 'Save'}
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<Share />}
                >
                  Share
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Property Details */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Property Details
            </Typography>
            <Divider sx={{ my: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Type
                </Typography>
                <Typography variant="body1">
                  {property.configuration}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Area
                </Typography>
                <Typography variant="body1">
                  {property.areaSqft} sq ft
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Offer Type
                </Typography>
                <Typography variant="body1">
                  {property.offerType}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Location
                </Typography>
                <Typography variant="body1">
                  {property.city}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Broker Information */}
        <Grid item xs={12} md={4}>
          {property.broker ? (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Listed by
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                  {property.broker.broName?.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1">
                    {property.broker.broName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Licensed Broker
                  </Typography>
                </Box>
              </Box>
              
              <Rating value={4.5} readOnly sx={{ mb: 2 }} />
              <Typography variant="caption" color="text.secondary">
                Verified Broker
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
                <Button 
                  variant="contained" 
                  startIcon={<Phone />}
                  fullWidth
                >
                  Call {property.broker.broName}
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<Email />}
                  fullWidth
                >
                  Email
                </Button>
              </Box>
            </Paper>
          ) : (
            <Paper sx={{ p: 3 }}>
              <Skeleton variant="rectangular" height={200} />
            </Paper>
          )}
        </Grid>

        {/* Comments and Reviews */}
        <Grid item xs={12}>
          <PropertyComments propertyId={property.propId} />
        </Grid>
      </Grid>

      {/* Success/Error Messages */}
      {success && (
        <Alert severity="success" sx={{ mt: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mt: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Make Offer Dialog */}
      <Dialog open={offerDialogOpen} onClose={() => setOfferDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Make an Offer for {property?.configuration}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Property listed at: ₹{property?.offerCost.toLocaleString()}
          </Typography>
          <TextField
            fullWidth
            label="Your Offer Amount (₹)"
            type="number"
            value={offerAmount}
            onChange={(e) => setOfferAmount(Number(e.target.value))}
            sx={{ mt: 1 }}
            helperText="Enter your offer amount in rupees"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOfferDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmitOffer}
            variant="contained"
            disabled={!offerAmount || offerAmount <= 0}
          >
            Submit Offer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
