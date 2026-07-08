import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, CardContent, CardMedia, Typography, Button, Stack } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const ChannelCard = ({ channelDetail, marginTop }) => {
  const [subscribed, setSubscribed] = useState(false);

  // Fallback structures if channelDetail is formatted differently (e.g. from search results vs details api)
  const id = channelDetail?.id || channelDetail?.channelId;
  const name = channelDetail?.name || channelDetail?.title;
  const avatar = channelDetail?.avatar;
  const subscribers = channelDetail?.subscribers || '0';
  const videoCount = channelDetail?.videoCount || '0';
  const description = channelDetail?.description || '';

  const handleSubscribeToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSubscribed(!subscribed);
  };

  return (
    <Box
      sx={{
        boxShadow: 'none',
        borderRadius: '20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: { xs: '356px', md: '320px' },
        height: '326px',
        margin: 'auto',
        marginTop,
      }}
    >
      <Link to={`/channel/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <CardContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            textAlign: 'center',
            color: 'text.primary',
            alignItems: 'center',
          }}
        >
          <CardMedia
            component="img"
            image={avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=faces'}
            alt={name}
            sx={{
              borderRadius: '50%',
              height: '180px',
              width: '180px',
              mb: 2,
              border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? '#333' : '#eee'}`,
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.02)'
              }
            }}
          />
          <Stack direction="row" alignItems="center" gap={0.5} mb={0.5}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {name}
            </Typography>
            <CheckCircleIcon sx={{ fontSize: '14px', color: 'gray' }} />
          </Stack>
          
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1.5 }}>
            {subscribers} subscribers • {videoCount} videos
          </Typography>

          {description && (
            <Typography variant="body2" className="line-clamp-2" sx={{ color: 'text.secondary', maxWidth: '280px', mb: 2, fontSize: '0.78rem' }}>
              {description}
            </Typography>
          )}

          <Button
            variant={subscribed ? "outlined" : "contained"}
            onClick={handleSubscribeToggle}
            sx={{
              borderRadius: '20px',
              px: 3,
              py: 0.8,
              fontSize: '0.82rem',
              fontWeight: 'bold',
              textTransform: 'none',
              backgroundColor: subscribed
                ? 'transparent'
                : (theme) => theme.palette.mode === 'dark' ? '#fff' : '#000',
              color: subscribed
                ? 'text.primary'
                : (theme) => theme.palette.mode === 'dark' ? '#000' : '#fff',
              border: subscribed ? '1px solid gray' : 'none',
              '&:hover': {
                backgroundColor: subscribed
                  ? 'background.hover'
                  : (theme) => theme.palette.mode === 'dark' ? '#e0e0e0' : '#222',
              }
            }}
          >
            {subscribed ? 'Subscribed' : 'Subscribe'}
          </Button>
        </CardContent>
      </Link>
    </Box>
  );
};

export default ChannelCard;
