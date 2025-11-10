import { useEffect, useMemo, useState } from "react";
import { 
  Container, 
  Typography, 
  Grid,
  Box, 
  Paper, 
  Button, 
  Chip,
  Alert,
  Fade,
  Skeleton,
  Stack
} from "@mui/material";
import { Search, TrendingUp, Star, Security, Handshake } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { listAllProperties, searchProperties, createDeal } from "../lib/propertyApi";
import PropertyCard from "../components/PropertyCard";
import AdvancedSearch, { SearchFilters } from "../components/AdvancedSearch";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../hooks/useFavorites";
import type { Property } from "../types";

export default function HomePage() {
  const [data, setData] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { hasRole } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const navigate = useNavigate();

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    setLoading(true);
    try {
      setData(await listAllProperties());
    } catch (e: any) {
      setError(e?.response?.data || "Failed to load properties");
    } finally {
      setLoading(false);
    }
  };



  const onAdvancedSearch = async (filters: SearchFilters) => {
    setLoading(true);
    setError(null);
    try {
      // Convert advanced filters to search params
      const params: any = {};
      if (filters.city) params.city = filters.city;
      if (filters.configuration) params.config = filters.configuration;
      if (filters.offerType) params.offer = filters.offerType;
      if (filters.minCost && filters.minCost > 0) params.minCost = filters.minCost;
      if (filters.maxCost && filters.maxCost < 10000000) params.maxCost = filters.maxCost;
      if (filters.minArea && filters.minArea > 0) params.minArea = filters.minArea;
      if (filters.maxArea && filters.maxArea < 5000) params.maxArea = filters.maxArea;
      if (filters.minRating && filters.minRating > 0) params.minRating = filters.minRating;
      if (filters.availableOnly !== undefined) params.availableOnly = filters.availableOnly;
      
      const results = await searchProperties(params);
      setData(results);
    } catch (e: any) {
      setError(e?.response?.data || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  const onBuyOrRent = async (p: Property) => {
    if (!hasRole("CUSTOMER")) {
      alert("Login as CUSTOMER to buy/rent.");
      return;
    }
    try {
      await createDeal(p.propId, p.offerCost);
      alert("Deal created! Property marked unavailable.");
      await loadProperties();
    } catch (e: any) {
      alert(e?.response?.data?.message || "Failed to create deal");
    }
  };

  const onFavorite = async (propertyId: number, newState: boolean) => {
    try {
      await toggleFavorite(propertyId, newState);
    } catch (error) {
      console.error('Failed to update favorite:', error);
      // You could show a toast/alert here
    }
  };

  const featuredProperties = useMemo(() => data.slice(0, 6), [data]);

  return (
    <>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          color: 'white',
          mb: 6,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url(https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1400&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.45)',
            transform: 'scale(1.05)',
          }}
        />
        <Box
          sx={{
            position: 'relative',
            py: { xs: 10, md: 14 },
            px: 2,
            background: 'linear-gradient(120deg, rgba(13,71,161,0.75) 0%, rgba(21,101,192,0.6) 35%, rgba(13,71,161,0.2) 100%)',
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={6} alignItems="center">
              <Grid item xs={12} md={7}>
                <Stack spacing={2.5}>
                  <Chip
                    icon={<TrendingUp />}
                    label="New-age property marketplace"
                    color="secondary"
                    sx={{ alignSelf: 'flex-start', px: 1.5 }}
                  />
                  <Typography component="h1" variant="h2" fontWeight="bold">
                    Unlock the best deals in every neighborhood
                  </Typography>
                  <Typography variant="h6" sx={{ maxWidth: 500, opacity: 0.9 }}>
                    Personalized recommendations, trusted brokers, and in-depth analytics to help you move faster.
                  </Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ pt: 1 }}>
                    <Button
                      variant="contained"
                      color="secondary"
                      size="large"
                      onClick={() => navigate('/properties')}
                      sx={{ borderRadius: 2, px: 4 }}
                    >
                      Explore Properties
                    </Button>
                    <Button
                      variant="outlined"
                      color="inherit"
                      size="large"
                      onClick={() => navigate('/signup?role=BROKER')}
                      sx={{ borderRadius: 2, px: 4 }}
                    >
                      Join as Broker
                    </Button>
                  </Stack>
                </Stack>
              </Grid>
              <Grid item xs={12} md={5}>
                <Paper
                  elevation={10}
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    bgcolor: 'rgba(255,255,255,0.85)',
                    color: 'text.primary',
                  }}
                >
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Search smarter with filters that matter
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Filter by price, configuration, neighbourhood vibe, and more.
                  </Typography>
                  <AdvancedSearch onSearch={onAdvancedSearch} loading={loading} />
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>

      <Container maxWidth="lg" sx={{ pb: 4 }}>
        {/* Highlights Section */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Grid item xs={12} sm={4}>
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
              <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                {data.length}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Properties Available
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
              <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>
                {data.filter(p => p.offerType === 'SELL').length}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                For Sale
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
              <Typography variant="h4" color="info.main" sx={{ fontWeight: 'bold' }}>
                {data.filter(p => p.offerType === 'RENT').length}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                For Rent
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Why Choose Section */}
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
          Why buyers and brokers love RealEstate Pro
        </Typography>
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {[{
            icon: <Search color="primary" sx={{ fontSize: 36 }} />,
            title: 'Hyper-personalized discovery',
            description: 'Find curated matches with neighbourhood insights, commute scores, and pricing trends.'
          }, {
            icon: <Security color="primary" sx={{ fontSize: 36 }} />,
            title: 'Verified professionals',
            description: 'Connect with vetted brokers backed by transparent ratings and customer feedback.'
          }, {
            icon: <Handshake color="primary" sx={{ fontSize: 36 }} />,
            title: 'Instant deal flow',
            description: 'Collaborate in real-time, submit offers, and track negotiations from a unified space.'
          }].map((feature) => (
            <Grid item xs={12} md={4} key={feature.title}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                <Stack spacing={2}>
                  {feature.icon}
                  <Typography variant="h6" fontWeight="bold">{feature.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{feature.description}</Typography>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Error Display */}
        {error && (
          <Fade in={!!error}>
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          </Fade>
        )}

        {/* Properties Section */}
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
          <Star color="warning" /> Top Picks for You
        </Typography>

        {loading && (
          <Grid container spacing={3}>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item}>
                <Skeleton variant="rectangular" height={220} sx={{ mb: 1, borderRadius: 1 }} />
                <Skeleton height={30} />
                <Skeleton height={20} width="60%" />
                <Skeleton height={25} width="40%" />
              </Grid>
            ))}
          </Grid>
        )}

        {!loading && featuredProperties.length === 0 && (
          <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'grey.50' }}>
            <Typography variant="h6" color="text.secondary">
              No properties found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Try adjusting your search criteria
            </Typography>
          </Paper>
        )}

        <Grid container spacing={3}>
          {featuredProperties.map((property) => (
            <Grid item xs={12} sm={6} md={4} key={property.propId}>
              <PropertyCard 
                property={property} 
                isFavorite={isFavorite(property.propId)}
                onFavorite={onFavorite}
              />
              {property.status && hasRole("CUSTOMER") && (
                <Button
                  variant="contained"
                  color={property.offerType === "SELL" ? "success" : "info"}
                  fullWidth
                  onClick={() => onBuyOrRent(property)}
                  sx={{
                    mt: 1,
                    borderRadius: 2,
                    fontWeight: 'bold',
                    textTransform: 'none'
                  }}
                >
                  {property.offerType === "SELL" ? "Buy Now" : "Rent Now"}
                </Button>
              )}
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Call to Action */}
      <Box sx={{ py: 8, bgcolor: 'grey.100', mt: 6 }}>
        <Container maxWidth="lg">
          <Paper
            elevation={0}
            sx={{
              p: { xs: 4, md: 6 },
              borderRadius: 4,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #1a237e 0%, #283593 40%, #5c6bc0 100%)',
              color: 'white',
            }}
          >
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Ready to unlock your next opportunity?
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.85, mb: 3 }}>
              Sign up to personalize recommendations or list properties with intelligent analytics.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button variant="contained" color="secondary" size="large" sx={{ borderRadius: 2 }} onClick={() => navigate('/signup')}>
                Create an account
              </Button>
              <Button variant="outlined" color="inherit" size="large" sx={{ borderRadius: 2 }} onClick={() => navigate('/login')}>
                Sign in
              </Button>
            </Stack>
          </Paper>
        </Container>
      </Box>
    </>
  );
}