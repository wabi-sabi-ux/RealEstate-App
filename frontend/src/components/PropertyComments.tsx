import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Rating,
  TextField,
  Button,
  Card,
  CardContent,
  Avatar,
  Alert,
  CircularProgress,
  Stack
} from '@mui/material';
import { Send } from '@mui/icons-material';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

interface Comment {
  commentId: number;
  content: string;
  rating: number;
  createdAt: string;
  user: {
    userId: number;
    email: string;
  };
}

interface PropertyCommentsProps {
  propertyId: number;
}

export default function PropertyComments({ propertyId }: PropertyCommentsProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState<number | null>(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchComments();
  }, [propertyId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/properties/${propertyId}/comments`);
      setComments(response.data);
    } catch (err) {
      console.error('Failed to fetch comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !newRating) {
      setError('Please provide both a comment and rating');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      const commentData = {
        content: newComment.trim(),
        rating: newRating
      };

      await api.post(`/api/properties/${propertyId}/comments`, commentData);
      
      // Reset form
      setNewComment('');
      setNewRating(0);
      
      // Refresh comments
      await fetchComments();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit comment');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAverageRating = () => {
    if (comments.length === 0) return 0;
    const sum = comments.reduce((acc, comment) => acc + comment.rating, 0);
    return sum / comments.length;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Reviews & Ratings
      </Typography>
      
      {comments.length > 0 && (
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Rating value={getAverageRating()} precision={0.1} readOnly />
          <Typography variant="body1">
            {getAverageRating().toFixed(1)} ({comments.length} review{comments.length !== 1 ? 's' : ''})
          </Typography>
        </Box>
      )}

      {user && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'grey.50' }}>
          <Typography variant="h6" gutterBottom>
            Write a Review
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ mb: 2 }}>
            <Typography component="legend">Rating</Typography>
            <Rating
              value={newRating}
              onChange={(_, value) => setNewRating(value)}
              size="large"
            />
          </Box>

          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Share your experience with this property..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Button
            variant="contained"
            startIcon={submitting ? <CircularProgress size={20} /> : <Send />}
            onClick={handleSubmitComment}
            disabled={submitting || !newComment.trim() || !newRating}
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </Paper>
      )}

      <Stack spacing={2}>
        {comments.length === 0 ? (
          <Typography variant="body1" color="text.secondary" textAlign="center" py={3}>
            No reviews yet. Be the first to review this property!
          </Typography>
        ) : (
          comments.map((comment) => (
            <Card key={comment.commentId} variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                    {comment.user.email.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        {comment.user.email}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(comment.createdAt)}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Rating value={comment.rating} readOnly size="small" />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        {comment.rating}/5 stars
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                
                <Typography variant="body1">
                  {comment.content}
                </Typography>
              </CardContent>
            </Card>
          ))
        )}
      </Stack>
    </Paper>
  );
}