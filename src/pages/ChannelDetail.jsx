import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, CardMedia, Stack, Typography, Tabs, Tab, Button, Avatar } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { fetchChannelDetails, fetchChannelVideos } from '../services/api';
import VideoGrid from '../components/VideoGrid';

const ChannelDetail = () => {
  const { id } = useParams();
  const [channelDetail, setChannelDetail] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loadingChannel, setLoadingChannel] = useState(true);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [subscribed, setSubscribed] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const loadChannelData = async () => {
      setLoadingChannel(true);
      setLoadingVideos(true);
      try {
        const channelData = await fetchChannelDetails(id);
        setChannelDetail(channelData);
        setLoadingChannel(false);

        const videoData = await fetchChannelVideos(id);
        setVideos(videoData);
      } catch (error) {
        console.error('Failed to load channel details:', error);
      } finally {
        setLoadingVideos(false);
      }
    };

    loadChannelData();
  }, [id]);

  const handleSubscribeToggle = () => {
    setSubscribed(!subscribed);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ minHeight: '95vh', flex: 1, overflowY: 'auto' }}>
      {/* Banner */}
      <Box sx={{ width: '100%' }}>
        {loadingChannel ? (
          <Box sx={{ height: '220px', backgroundColor: 'background.alt' }} />
        ) : (
          <CardMedia
            component="img"
            image={channelDetail?.banner || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80'}
            alt="Channel Banner"
            sx={{
              height: { xs: '140px', sm: '200px', md: '250px' },
              objectFit: 'cover',
            }}
          />
        )}
      </Box>

      {/* Profile info header */}
      <Box
        sx={{
          px: { xs: 2, sm: 4, md: 8 },
          py: 3,
          backgroundColor: 'background.default',
          borderBottom: (theme) => `1px solid ${theme.palette.mode === 'dark' ? '#272727' : '#e5e5e5'}`,
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 2, sm: 4 }}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          justifyContent="space-between"
        >
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems="center">
            {loadingChannel ? (
              <Avatar sx={{ width: 120, height: 120, mb: { xs: 2, sm: 0 } }} />
            ) : (
              <Avatar
                src={channelDetail?.avatar}
                alt={channelDetail?.name}
                sx={{
                  width: { xs: 100, sm: 120 },
                  height: { xs: 100, sm: 120 },
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                  border: (theme) => `2px solid ${theme.palette.background.paper}`,
                }}
              />
            )}

            <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
              <Stack direction="row" alignItems="center" justifyContent={{ xs: 'center', sm: 'flex-start' }} gap={0.5} mb={0.5}>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  {channelDetail?.name}
                </Typography>
                <CheckCircleIcon sx={{ fontSize: '18px', color: 'gray' }} />
              </Stack>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                @{channelDetail?.id} • {channelDetail?.subscribers} subscribers • {channelDetail?.videoCount} videos
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '0.85rem', maxWidth: '600px', display: 'block' }}>
                {channelDetail?.description}
              </Typography>
            </Box>
          </Stack>

          {!loadingChannel && (
            <Button
              variant={subscribed ? 'outlined' : 'contained'}
              onClick={handleSubscribeToggle}
              sx={{
                borderRadius: '20px',
                px: 4,
                py: 1,
                fontSize: '0.875rem',
                fontWeight: 'bold',
                textTransform: 'none',
                backgroundColor: subscribed ? 'transparent' : 'secondary.main',
                color: subscribed ? 'text.primary' : 'background.paper',
                border: subscribed ? '1px solid gray' : 'none',
                alignSelf: { xs: 'center', sm: 'center' },
                width: { xs: '100%', sm: 'auto' },
                '&:hover': {
                  backgroundColor: subscribed ? 'background.hover' : 'text.primary',
                },
              }}
            >
              {subscribed ? 'Subscribed' : 'Subscribe'}
            </Button>
          )}
        </Stack>

        {/* Tabs switcher */}
        <Box sx={{ mt: 3, borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            textColor="inherit"
            indicatorColor="primary"
            sx={{
              '& .MuiTab-root': {
                fontWeight: 600,
                textTransform: 'none',
                minWidth: '80px',
                fontSize: '0.9rem',
              },
            }}
          >
            <Tab label="Home" />
            <Tab label="Videos" />
            <Tab label="About" />
          </Tabs>
        </Box>
      </Box>

      {/* Grid of uploaded videos */}
      <Box sx={{ px: { xs: 2, sm: 4, md: 8 }, py: 3 }}>
        {tabValue === 0 || tabValue === 1 ? (
          <VideoGrid videos={videos} loading={loadingVideos} />
        ) : (
          <Box sx={{ py: 3, maxWidth: '800px' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              About
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.primary', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
              {channelDetail?.description}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ChannelDetail;
