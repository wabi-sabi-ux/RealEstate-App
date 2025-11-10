import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Checkbox,
  FormControlLabel,
  Button,
  Collapse,
  IconButton,
  Chip,
  Rating,
} from '@mui/material';
import {
  Search,
  Clear,
  FilterList,
} from '@mui/icons-material';
import type { PropertyConfig, OfferType } from '../types';

export interface SearchFilters {
  city?: string;
  configuration?: PropertyConfig | '';
  offerType?: OfferType | '';
  minCost?: number;
  maxCost?: number;
  minArea?: number;
  maxArea?: number;
  minRating?: number;
  availableOnly?: boolean;
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  loading?: boolean;
}

export default function AdvancedSearch({ onSearch, loading = false }: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    city: '',
    configuration: '',
    offerType: '',
    minCost: 0,
    maxCost: 10000000,
    minArea: 0,
    maxArea: 5000,
    minRating: 0,
    availableOnly: true,
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [priceRange, setPriceRange] = useState<number[]>([0, 10000000]);
  const [areaRange, setAreaRange] = useState<number[]>([0, 5000]);

  const handleFilterChange = (field: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePriceChange = (_: Event, newValue: number | number[]) => {
    const range = newValue as number[];
    setPriceRange(range);
    setFilters(prev => ({
      ...prev,
      minCost: range[0],
      maxCost: range[1]
    }));
  };

  const handleAreaChange = (_: Event, newValue: number | number[]) => {
    const range = newValue as number[];
    setAreaRange(range);
    setFilters(prev => ({
      ...prev,
      minArea: range[0],
      maxArea: range[1]
    }));
  };

  const handleSearch = () => {
    // Remove empty values
    const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value !== '' && value !== 0 && value !== undefined) {
        acc[key as keyof SearchFilters] = value;
      }
      return acc;
    }, {} as SearchFilters);
    
    onSearch(cleanFilters);
  };

  const handleClearFilters = () => {
    const defaultFilters: SearchFilters = {
      city: '',
      configuration: '',
      offerType: '',
      minCost: 0,
      maxCost: 10000000,
      minArea: 0,
      maxArea: 5000,
      minRating: 0,
      availableOnly: true,
    };
    setFilters(defaultFilters);
    setPriceRange([0, 10000000]);
    setAreaRange([0, 5000]);
    onSearch({});
  };

  const getActiveFiltersCount = () => {
    return Object.entries(filters).filter(([key, value]) => {
      if (key === 'availableOnly') return !value; // Only count if false
      return value !== '' && value !== 0 && value !== undefined;
    }).length;
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3, bgcolor: 'background.paper' }}>
      {/* Basic Search Bar */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Box sx={{ flex: 1, display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            placeholder="Search by city..."
            value={filters.city}
            onChange={(e) => handleFilterChange('city', e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />,
            }}
          />
          
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Property Type</InputLabel>
            <Select
              value={filters.configuration}
              onChange={(e) => handleFilterChange('configuration', e.target.value)}
              label="Property Type"
            >
              <MenuItem value="">Any</MenuItem>
              <MenuItem value="FLAT">Flat</MenuItem>
              <MenuItem value="SHOP">Shop</MenuItem>
              <MenuItem value="PLOT">Plot</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Offer Type</InputLabel>
            <Select
              value={filters.offerType}
              onChange={(e) => handleFilterChange('offerType', e.target.value)}
              label="Offer Type"
            >
              <MenuItem value="">Any</MenuItem>
              <MenuItem value="SELL">For Sale</MenuItem>
              <MenuItem value="RENT">For Rent</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Button
          variant="contained"
          onClick={handleSearch}
          disabled={loading}
          startIcon={<Search />}
          sx={{ height: 56 }}
        >
          Search
        </Button>

        <IconButton
          onClick={() => setShowAdvanced(!showAdvanced)}
          sx={{ 
            height: 56,
            bgcolor: getActiveFiltersCount() > 0 ? 'primary.main' : 'transparent',
            color: getActiveFiltersCount() > 0 ? 'white' : 'inherit',
            '&:hover': { bgcolor: 'primary.light' }
          }}
        >
          <FilterList />
          {getActiveFiltersCount() > 0 && (
            <Chip 
              label={getActiveFiltersCount()} 
              size="small" 
              sx={{ 
                position: 'absolute', 
                top: -8, 
                right: -8, 
                minWidth: 20, 
                height: 20,
                bgcolor: 'error.main',
                color: 'white'
              }} 
            />
          )}
        </IconButton>
      </Box>

      {/* Advanced Filters Panel */}
      <Collapse in={showAdvanced}>
        <Box sx={{ pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" color="primary">
              Advanced Filters
            </Typography>
            <Button
              startIcon={<Clear />}
              onClick={handleClearFilters}
              size="small"
              color="secondary"
            >
              Clear All
            </Button>
          </Box>

          <Grid container spacing={3}>
            {/* Price Range */}
            <Grid item xs={12} md={6}>
              <Typography gutterBottom>Price Range</Typography>
              <Box sx={{ px: 2 }}>
                <Slider
                  value={priceRange}
                  onChange={handlePriceChange}
                  valueLabelDisplay="auto"
                  min={0}
                  max={10000000}
                  step={100000}
                  valueLabelFormat={(value) => `₹${(value / 100000).toFixed(1)}L`}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    ₹{(priceRange[0] / 100000).toFixed(1)}L
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ₹{(priceRange[1] / 100000).toFixed(1)}L
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Area Range */}
            <Grid item xs={12} md={6}>
              <Typography gutterBottom>Area Range (sq ft)</Typography>
              <Box sx={{ px: 2 }}>
                <Slider
                  value={areaRange}
                  onChange={handleAreaChange}
                  valueLabelDisplay="auto"
                  min={0}
                  max={5000}
                  step={100}
                  valueLabelFormat={(value) => `${value} sq ft`}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {areaRange[0]} sq ft
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {areaRange[1]} sq ft
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Minimum Rating */}
            <Grid item xs={12} md={6}>
              <Typography gutterBottom>Minimum Rating</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Rating
                  value={filters.minRating}
                  onChange={(_, newValue) => handleFilterChange('minRating', newValue || 0)}
                  precision={0.5}
                />
                <Typography variant="body2" color="text.secondary">
                  {filters.minRating} & above
                </Typography>
              </Box>
            </Grid>

            {/* Additional Options */}
            <Grid item xs={12} md={6}>
              <Typography gutterBottom>Options</Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.availableOnly}
                    onChange={(e) => handleFilterChange('availableOnly', e.target.checked)}
                  />
                }
                label="Available properties only"
              />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleSearch}
              disabled={loading}
              startIcon={<Search />}
              sx={{ minWidth: 200 }}
            >
              Apply Filters
            </Button>
          </Box>
        </Box>
      </Collapse>
    </Paper>
  );
}