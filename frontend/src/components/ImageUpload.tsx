import { useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Grid,
  Paper,
  Chip
} from '@mui/material';
import {
  CloudUpload,
  Delete,
  Preview
} from '@mui/icons-material';

interface ImageUploadProps {
  images: File[];
  onImagesChange: (images: File[]) => void;
  maxImages?: number;
}

export default function ImageUpload({ images, onImagesChange, maxImages = 5 }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newImages = Array.from(files).slice(0, maxImages - images.length);
    onImagesChange([...images, ...newImages]);
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    onImagesChange(updatedImages);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (!files) return;

    const newImages = Array.from(files).slice(0, maxImages - images.length);
    onImagesChange([...images, ...newImages]);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Property Images
        <Chip 
          label={`${images.length}/${maxImages}`} 
          size="small" 
          color={images.length === maxImages ? "error" : "primary"}
          sx={{ ml: 1 }}
        />
      </Typography>

      {/* Upload Area */}
      {images.length < maxImages && (
        <Paper
          variant="outlined"
          sx={{
            p: 3,
            mb: 3,
            textAlign: 'center',
            cursor: 'pointer',
            borderStyle: 'dashed',
            borderWidth: 2,
            borderColor: 'primary.main',
            bgcolor: 'grey.50',
            '&:hover': {
              bgcolor: 'grey.100'
            }
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
        >
          <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" sx={{ mb: 1 }}>
            Upload Property Images
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Drag and drop images here or click to browse
          </Typography>
          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            Supports: JPG, PNG, GIF (Max {maxImages} images)
          </Typography>
        </Paper>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        multiple
        accept="image/*"
        style={{ display: 'none' }}
      />

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <Grid container spacing={2}>
          {images.map((image, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height={200}
                  image={URL.createObjectURL(image)}
                  alt={`Property image ${index + 1}`}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ p: 1 }}>
                  <Typography variant="body2" noWrap>
                    {image.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {(image.size / 1024 / 1024).toFixed(2)} MB
                  </Typography>
                </CardContent>
                <Box
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    display: 'flex',
                    gap: 1
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() => window.open(URL.createObjectURL(image), '_blank')}
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.9)',
                      '&:hover': { bgcolor: 'rgba(255, 255, 255, 1)' }
                    }}
                  >
                    <Preview />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveImage(index)}
                    sx={{
                      bgcolor: 'rgba(244, 67, 54, 0.9)',
                      color: 'white',
                      '&:hover': { bgcolor: 'rgba(244, 67, 54, 1)' }
                    }}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}