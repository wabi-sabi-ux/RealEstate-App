import { Grid, Container, Typography, Skeleton, Paper, Box } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import { Property } from '../types';
import api from '../lib/api';

export default function Properties() {
  const { data: properties, isLoading } = useQuery<Property[]>({
    queryKey: ['properties'],
    queryFn: () => api.get('/api/properties').then(res => res.data)
  });

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Discover Available Properties
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Browse through curated listings across prime neighbourhoods and emerging hot-spots.
        </Typography>
      </Box>

      {isLoading ? (
        <Grid container spacing={3}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper sx={{ p: 2, borderRadius: 3 }}>
                <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2, mb: 2 }} />
                <Skeleton width="60%" height={28} />
                <Skeleton width="80%" height={20} />
              </Paper>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={3}>
          {properties?.map(property => (
            <Grid item xs={12} sm={6} md={4} key={property.propId}>
              <Link to={`/properties/${property.propId}`} style={{ textDecoration: 'none' }}>
                <PropertyCard property={property} />
              </Link>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
