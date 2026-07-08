import { Link } from 'react-router-dom';
import { Card, CardContent, Typography, Box, Avatar, Stack } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { CHANNELS } from '../services/mockData';

const VideoCard = ({ video }) => {
  const { id, title, thumbnail, channelId, channelTitle, views, uploadTime, duration } = video;

  // Resolve channel avatar from mock CHANNELS dataset
  const channelInfo = CHANNELS[channelId];
  const channelAvatar = channelInfo ? channelInfo.avatar : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=faces';

  return (
    <Card
      className="video-card-hover"
      sx={{
        width: '100%',
        backgroundColor: 'transparent',
        cursor: 'pointer',
        transition: 'transform 0.15s ease-in-out',
        '&:hover': {
          '& .video-card-title': {
            color: 'primary.main',
          }
        }
      }}
    >
      {/* Thumbnail with duration badge */}
      <Link to={`/video/${id}`} style={{ textDecoration: 'none' }}>
        <Box className="video-card-thumbnail-container" sx={{ position: 'relative' }}>
          <img
            src={thumbnail}
            alt={title}
            className="video-card-thumbnail"
            loading="lazy"
          />
          {duration && (
            <Typography
              variant="caption"
              sx={{
                position: 'absolute',
                bottom: 8,
                right: 8,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                color: '#fff',
                px: 0.8,
                py: 0.2,
                borderRadius: 1,
                fontWeight: 600,
                fontSize: '11px',
                letterSpacing: '0.5px',
              }}
            >
              {duration}
            </Typography>
          )}
        </Box>
      </Link>

      {/* Details (Avatar + Metadata) */}
      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 }, display: 'flex', gap: 1.5 }}>
        <Link to={`/channel/${channelId}`}>
          <Avatar
            src={channelAvatar}
            alt={channelTitle}
            sx={{
              width: 36,
              height: 36,
              border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? '#333' : '#eee'}`,
              transition: 'opacity 0.15s',
              '&:hover': { opacity: 0.8 }
            }}
          />
        </Link>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Link to={`/video/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <Typography
              className="video-card-title line-clamp-2"
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                fontSize: '0.92rem',
                lineHeight: '1.25rem',
                color: 'text.primary',
                mb: 0.5,
              }}
            >
              {title}
            </Typography>
          </Link>
          
          <Stack direction="row" alignItems="center" gap={0.5}>
            <Link to={`/channel/${channelId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <Typography
                className="line-clamp-1"
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  fontWeight: 500,
                  fontSize: '0.78rem',
                  '&:hover': { color: 'text.primary' }
                }}
              >
                {channelTitle}
              </Typography>
            </Link>
            <CheckCircleIcon sx={{ fontSize: '12px', color: 'gray' }} />
          </Stack>

          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.78rem', mt: 0.2 }}>
            {views} views • {uploadTime}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default VideoCard;
