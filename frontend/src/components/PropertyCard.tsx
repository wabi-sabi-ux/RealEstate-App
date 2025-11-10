import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Chip, 
  Box, 
  CardActions,
  Button,
  Rating,
  IconButton
} from "@mui/material";
import { 
  Home, 
  LocationOn, 
  SquareFoot, 
  Visibility,
  Favorite,
  FavoriteBorder 
} from "@mui/icons-material";
import { Property } from "../types";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { resolveImageUrl } from "../lib/imageUtils";

interface PropertyCardProps {
  property: Property;
  isFavorite?: boolean;
  onFavorite?: (propertyId: number, isFavorite: boolean) => void;
}

export default function PropertyCard({ property, isFavorite = false, onFavorite }: PropertyCardProps) {
  const navigate = useNavigate();
  const [localFavorite, setLocalFavorite] = useState(isFavorite);
  const mainImage = resolveImageUrl(property.imageUrls?.[0]);

  const handleViewDetails = () => {
    navigate(`/properties/${property.propId}`);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newFavoriteState = !localFavorite;
    setLocalFavorite(newFavoriteState);
    onFavorite?.(property.propId, newFavoriteState);
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
        position: 'relative'
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="220"
          image={
            mainImage ?? "https://via.placeholder.com/400x220?text=No+Image"
          }
          alt={property.configuration}
          sx={{
            objectFit: 'cover',
          }}
        />
        <Box 
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            display: 'flex',
            gap: 1
          }}
        >
          <Chip
            label={property.offerType}
            color={property.offerType === "SELL" ? "success" : "info"}
            size="small"
            sx={{ fontWeight: 'bold' }}
          />
          {!property.status && (
            <Chip label="Sold" color="error" size="small" />
          )}
        </Box>
        <IconButton
          onClick={handleFavorite}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: 'white',
            '&:hover': { bgcolor: 'grey.100' }
          }}
          size="small"
        >
          {localFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
        </IconButton>
      </Box>

      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Typography 
          variant="h6" 
          component="h2"
          sx={{ 
            fontWeight: 'bold',
            mb: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <Home color="primary" fontSize="small" />
          {property.configuration}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, color: 'text.secondary' }}>
          <LocationOn fontSize="small" sx={{ mr: 0.5 }} />
          <Typography variant="body2">
            {property.address}, {property.city}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <SquareFoot fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {property.areaSqft} sq ft
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography 
            variant="h5" 
            color="primary"
            sx={{ fontWeight: 'bold' }}
          >
            ₹{property.offerCost.toLocaleString()}
          </Typography>
          {property.offerType === "RENT" && (
            <Typography variant="body2" color="text.secondary">
              /month
            </Typography>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Rating 
            value={property.avgRating} 
            readOnly 
            size="small" 
            precision={0.1}
          />
          <Typography variant="body2" color="text.secondary">
            ({property.reviewCount} reviews)
          </Typography>
        </Box>
      </CardContent>

      <CardActions sx={{ pt: 0, px: 2, pb: 2 }}>
        <Button
          variant="contained"
          fullWidth
          startIcon={<Visibility />}
          onClick={handleViewDetails}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 'bold'
          }}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
}
