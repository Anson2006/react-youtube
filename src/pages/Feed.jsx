import { useState, useEffect } from 'react';
import { Box, Stack, Typography, Button } from '@mui/material';
import { fetchVideosByCategory } from '../services/api';
import { CATEGORIES } from '../services/mockData';
import VideoGrid from '../components/VideoGrid';

const Feed = ({ selectedCategory, setSelectedCategory }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVideos = async () => {
      setLoading(true);
      try {
        const data = await fetchVideosByCategory(selectedCategory);
        setVideos(data);
      } catch (error) {
        console.error('Failed to load videos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, [selectedCategory]);

  return (
    <Box sx={{ p: 2, flex: 1, overflowY: 'auto', minHeight: 'calc(100vh - 56px)' }}>
      {/* Horizontal categories list */}
      <Stack
        direction="row"
        spacing={1}
        className="no-scrollbar"
        sx={{
          overflowX: 'auto',
          pb: 2,
          mb: 2,
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {CATEGORIES.map((category) => (
          <Button
            key={category}
            onClick={() => setSelectedCategory(category)}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              px: 2,
              py: 0.6,
              fontSize: '0.85rem',
              fontWeight: 500,
              flexShrink: 0,
              backgroundColor: category === selectedCategory
                ? (theme) => theme.palette.mode === 'dark' ? '#ffffff' : '#0f0f0f'
                : (theme) => theme.palette.mode === 'dark' ? '#272727' : '#f2f2f2',
              color: category === selectedCategory
                ? (theme) => theme.palette.mode === 'dark' ? '#0f0f0f' : '#ffffff'
                : 'text.primary',
              '&:hover': {
                backgroundColor: category === selectedCategory
                  ? (theme) => theme.palette.mode === 'dark' ? '#e0e0e0' : '#222'
                  : (theme) => theme.palette.mode === 'dark' ? '#3f3f3f' : '#e5e5e5',
              },
            }}
          >
            {category}
          </Button>
        ))}
      </Stack>

      {/* Main Grid Header */}
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
        Recommended {selectedCategory !== 'All' && <Typography component="span" variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>{selectedCategory}</Typography>} Videos
      </Typography>

      {/* Video listings */}
      <VideoGrid videos={videos} loading={loading} />
    </Box>
  );
};

export default Feed;
