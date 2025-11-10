import { useQuery } from '@tanstack/react-query';
import { Container, Grid, Card, CardContent, Typography } from '@mui/material';
import api from '../lib/api';
import { Broker } from '../types';

export default function BrokerList() {
  const { data: brokers, isLoading } = useQuery<Broker[]>({
    queryKey: ['brokers'],
    queryFn: () => api.get('/api/brokers').then(res => res.data)
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Our Brokers
      </Typography>
      <Grid container spacing={3}>
        {brokers?.map(broker => (
          <Grid item xs={12} sm={6} md={4} key={broker.broId}>
            <Card>
              <CardContent>
                <Typography variant="h6">{broker.broName}</Typography>
                <Typography color="text.secondary">{broker.email}</Typography>
                {broker.city && (
                  <Typography color="text.secondary">{broker.city}</Typography>
                )}
                {broker.avgRating && broker.ratingCount ? (
                  <Typography>
                    Rating: {broker.avgRating.toFixed(1)} ({broker.ratingCount} reviews)
                  </Typography>
                ) : (
                  <Typography color="text.secondary">No ratings yet</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
