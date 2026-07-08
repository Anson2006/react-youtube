import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { searchVideos } from '../services/api';
import VideoGrid from '../components/VideoGrid';

const SearchFeed = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { searchTerm } = useParams();

  useEffect(() => {
    const loadSearchResults = async () => {
      setLoading(true);
      try {
        const decodedTerm = decodeURIComponent(searchTerm);
        const data = await searchVideos(decodedTerm);
        setVideos(data);
      } catch (error) {
        console.error('Failed to run search:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSearchResults();
  }, [searchTerm]);

  return (
    <Box sx={{ p: 2, flex: 1, overflowY: 'auto', minHeight: 'calc(100vh - 56px)' }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
        Search results for:{' '}
        <span style={{ color: '#FF0000' }}>"{decodeURIComponent(searchTerm)}"</span>
      </Typography>

      <VideoGrid videos={videos} loading={loading} mockCount={4} />
    </Box>
  );
};

export default SearchFeed;
