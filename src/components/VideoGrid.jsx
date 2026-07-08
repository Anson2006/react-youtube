import { Grid, Skeleton, Box } from '@mui/material';
import VideoCard from './VideoCard';
import ChannelCard from './ChannelCard';

const VideoGrid = ({ videos, loading, mockCount = 8 }) => {
  if (loading) {
    return (
      <Grid container spacing={3} sx={{ py: 1 }}>
        {Array.from(new Array(mockCount)).map((_, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Box sx={{ width: '100%', mb: 2 }}>
              {/* Thumbnail skeleton */}
              <Skeleton
                variant="rectangular"
                width="100%"
                sx={{
                  aspectRatio: '16/9',
                  borderRadius: '12px',
                  backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#272727' : '#e0e0e0',
                }}
              />
              {/* Title & Channel details skeleton */}
              <Box sx={{ display: 'flex', mt: 1.5, gap: 1.5 }}>
                <Skeleton
                  variant="circular"
                  width={36}
                  height={36}
                  sx={{
                    flexShrink: 0,
                    backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#272727' : '#e0e0e0',
                  }}
                />
                <Box sx={{ flex: 1 }}>
                  <Skeleton
                    variant="text"
                    width="90%"
                    height={20}
                    sx={{ backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#272727' : '#e0e0e0', mb: 0.5 }}
                  />
                  <Skeleton
                    variant="text"
                    width="60%"
                    height={15}
                    sx={{ backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#272727' : '#e0e0e0', mb: 0.5 }}
                  />
                  <Skeleton
                    variant="text"
                    width="40%"
                    height={15}
                    sx={{ backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#272727' : '#e0e0e0' }}
                  />
                </Box>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <Box sx={{ py: 5, textAlign: 'center', color: 'text.secondary' }}>
        No videos found. Try search suggestions or select other categories.
      </Box>
    );
  }

  return (
    <Grid container spacing={3} sx={{ py: 1 }}>
      {videos.map((item, index) => {
        // Handle channel searches vs video lists
        const isChannel = item.type === 'channel';
        const key = item.id || `item-${index}`;

        return (
          <Grid
            item
            xs={12}
            sm={isChannel ? 12 : 6}
            md={isChannel ? 12 : 4}
            lg={isChannel ? 12 : 3}
            key={key}
            sx={{
              display: 'flex',
              justifyContent: isChannel ? 'center' : 'stretch',
              alignItems: 'center',
            }}
          >
            {isChannel ? (
              <ChannelCard channelDetail={item} />
            ) : (
              <VideoCard video={item} />
            )}
          </Grid>
        );
      })}
    </Grid>
  );
};

export default VideoGrid;
