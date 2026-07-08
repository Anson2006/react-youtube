import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { Box, Stack, Typography, Avatar, Button, Paper, TextField, IconButton, Grid, Skeleton, CardMedia } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { fetchVideoDetails, fetchRelatedVideos, fetchVideoComments, fetchChannelDetails } from '../services/api';

const VideoDetail = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [channel, setChannel] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isCommentFocused, setIsCommentFocused] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingRelated, setLoadingRelated] = useState(true);
  const [descExpanded, setDescExpanded] = useState(false);
  
  // Interactive user actions
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const loadVideoContent = async () => {
      try {
        const videoData = await fetchVideoDetails(id);
        setVideo(videoData);
        setLoading(false);

        // Fetch channel info
        if (videoData.channelId) {
          const channelData = await fetchChannelDetails(videoData.channelId);
          setChannel(channelData);
        }

        const relatedData = await fetchRelatedVideos(id);
        setRelatedVideos(relatedData);
        setLoadingRelated(false);

        const commentsData = await fetchVideoComments(id);
        setComments(commentsData);
      } catch (error) {
        console.error('Failed to load video detail content:', error);
      }
    };

    loadVideoContent();
  }, [id]);

  const handleLike = () => {
    if (liked) {
      setLiked(false);
    } else {
      setLiked(true);
      setDisliked(false);
    }
  };

  const handleDislike = () => {
    if (disliked) {
      setDisliked(false);
    } else {
      setDisliked(true);
      setLiked(false);
    }
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const myComment = {
      id: `my-${Date.now()}`,
      author: 'Current User',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
      text: newComment.trim(),
      likes: 0,
      timeAgo: 'Just now'
    };

    setComments([myComment, ...comments]);
    setNewComment('');
    setIsCommentFocused(false);
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Skeleton variant="rectangular" width="100%" sx={{ aspectRatio: '16/9', borderRadius: '12px' }} />
        <Skeleton variant="text" width="60%" height={40} />
        <Skeleton variant="text" width="40%" height={30} />
      </Box>
    );
  }

  // Parse total likes
  const initialLikesCount = video ? parseInt(video.likes.replace(/,/g, '')) || 0 : 0;
  const currentLikesCount = liked ? initialLikesCount + 1 : initialLikesCount;

  return (
    <Box sx={{ p: { xs: 1.5, md: 3 }, flex: 1, overflowY: 'auto' }}>
      <Grid container spacing={3}>
        {/* Main Content Area */}
        <Grid item xs={12} lg={8}>
          {/* Video Player */}
          <Box
            sx={{
              width: '100%',
              aspectRatio: '16/9',
              borderRadius: '12px',
              overflow: 'hidden',
              backgroundColor: '#000',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            }}
          >
            <ReactPlayer
              url={`https://www.youtube.com/watch?v=${video.youtubeId}`}
              className="react-player"
              controls
              width="100%"
              height="100%"
              playing
            />
          </Box>

          {/* Title */}
          <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 2, mb: 1.5, fontSize: { xs: '1.15rem', sm: '1.35rem', md: '1.5rem' }, lineHeight: 1.3 }}>
            {video.title}
          </Typography>

          {/* Sub bar: Channel, Subscribe, Likes & Actions */}
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', md: 'center' }}
            spacing={2}
            sx={{ mb: 2 }}
          >
            {/* Channel info and sub button */}
            <Stack direction="row" alignItems="center" spacing={2}>
              <Link to={`/channel/${video.channelId}`}>
                <Avatar
                  src={channel?.avatar}
                  alt={video.channelTitle}
                  sx={{ width: 40, height: 40, border: '1px solid rgba(0,0,0,0.1)' }}
                />
              </Link>
              <Box>
                <Stack direction="row" alignItems="center" gap={0.5}>
                  <Link to={`/channel/${video.channelId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                      {video.channelTitle}
                    </Typography>
                  </Link>
                  <CheckCircleIcon sx={{ fontSize: '14px', color: 'gray' }} />
                </Stack>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.78rem' }}>
                  {channel?.subscribers || '1.1M'} subscribers
                </Typography>
              </Box>
              <Button
                variant={subscribed ? 'outlined' : 'contained'}
                onClick={() => setSubscribed(!subscribed)}
                sx={{
                  borderRadius: '20px',
                  px: 3,
                  fontSize: '0.82rem',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  backgroundColor: subscribed ? 'transparent' : 'secondary.main',
                  color: subscribed ? 'text.primary' : 'background.paper',
                  border: subscribed ? '1px solid gray' : 'none',
                  '&:hover': {
                    backgroundColor: subscribed ? 'background.hover' : 'text.primary',
                  },
                }}
              >
                {subscribed ? 'Subscribed' : 'Subscribe'}
              </Button>
            </Stack>

            {/* Like, Dislike, Share */}
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ alignSelf: { xs: 'stretch', sm: 'auto' }, justifyContent: 'flex-end' }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#272727' : '#f2f2f2',
                  borderRadius: '20px',
                  p: 0.5,
                }}
              >
                <Button
                  onClick={handleLike}
                  startIcon={liked ? <ThumbUpIcon sx={{ color: 'primary.main' }} /> : <ThumbUpOutlinedIcon />}
                  sx={{
                    borderRadius: '20px 0 0 20px',
                    color: 'text.primary',
                    px: 2,
                    fontSize: '0.82rem',
                    borderRight: (theme) => `1px solid ${theme.palette.mode === 'dark' ? '#444' : '#ccc'}`,
                    '&:hover': { backgroundColor: 'background.hover' }
                  }}
                >
                  {currentLikesCount.toLocaleString()}
                </Button>
                <IconButton onClick={handleDislike} sx={{ px: 2, color: 'text.primary', borderRadius: '0 20px 20px 0', '&:hover': { backgroundColor: 'background.hover' } }}>
                  {disliked ? <ThumbDownIcon sx={{ color: 'secondary.main' }} /> : <ThumbDownOutlinedIcon sx={{ fontSize: '20px' }} />}
                </IconButton>
              </Box>

              <Button
                startIcon={<ShareOutlinedIcon />}
                sx={{
                  backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#272727' : '#f2f2f2',
                  color: 'text.primary',
                  borderRadius: '20px',
                  px: 2.5,
                  fontSize: '0.82rem',
                  '&:hover': { backgroundColor: 'background.hover' }
                }}
              >
                Share
              </Button>

              <IconButton sx={{ backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#272727' : '#f2f2f2', color: 'text.primary' }}>
                <MoreHorizIcon />
              </IconButton>
            </Stack>
          </Stack>

          {/* Description Card */}
          <Paper
            onClick={() => !descExpanded && setDescExpanded(true)}
            sx={{
              p: 2,
              borderRadius: '12px',
              backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#272727' : '#f2f2f2',
              cursor: descExpanded ? 'default' : 'pointer',
              transition: 'background-color 0.15s',
              '&:hover': {
                backgroundColor: (theme) => !descExpanded ? (theme.palette.mode === 'dark' ? '#323232' : '#ebebeb') : 'inherit',
              },
            }}
          >
            <Stack direction="row" spacing={1.5} mb={1}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                {video.views} views
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                {video.uploadTime}
              </Typography>
              <Typography variant="subtitle2" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                #{video.category}
              </Typography>
            </Stack>

            <Typography
              variant="body2"
              sx={{
                whiteSpace: 'pre-line',
                lineHeight: 1.5,
                fontSize: '0.85rem',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: descExpanded ? 'unset' : 3,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {video.description}
            </Typography>

            <Button
              onClick={(e) => {
                if (descExpanded) {
                  e.stopPropagation();
                  setDescExpanded(false);
                }
              }}
              sx={{
                p: 0,
                mt: 1.5,
                fontWeight: 'bold',
                textTransform: 'none',
                minWidth: 0,
                fontSize: '0.8rem',
                color: 'text.primary',
                '&:hover': { textDecoration: 'underline', backgroundColor: 'transparent' }
              }}
            >
              {descExpanded ? 'Show less' : 'Show more...'}
            </Button>
          </Paper>

          {/* Comments Section */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
              {comments.length} Comments
            </Typography>

            {/* Comment Form */}
            <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 4 }}>
              <Avatar src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces" sx={{ width: 40, height: 40 }} />
              <Box component="form" onSubmit={handleCommentSubmit} sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  variant="standard"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onFocus={() => setIsCommentFocused(true)}
                  InputProps={{
                    disableUnderline: !isCommentFocused,
                    sx: {
                      fontSize: '0.9rem',
                      pb: 0.8,
                      borderBottom: (theme) => `1px solid ${isCommentFocused ? theme.palette.text.primary : (theme.palette.mode === 'dark' ? '#444' : '#ccc')}`,
                    }
                  }}
                />
                {isCommentFocused && (
                  <Stack direction="row" justifyContent="flex-end" spacing={1.5} sx={{ mt: 1.5 }}>
                    <Button
                      onClick={() => {
                        setIsCommentFocused(false);
                        setNewComment('');
                      }}
                      sx={{ color: 'text.primary', textTransform: 'none', fontWeight: 'bold' }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={!newComment.trim()}
                      sx={{
                        borderRadius: '20px',
                        textTransform: 'none',
                        fontWeight: 'bold',
                        px: 3,
                      }}
                    >
                      Comment
                    </Button>
                  </Stack>
                )}
              </Box>
            </Stack>

            {/* Comments List */}
            <Stack spacing={3}>
              {comments.map((comment) => (
                <Stack key={comment.id} direction="row" spacing={2} alignItems="flex-start">
                  <Avatar src={comment.authorAvatar} alt={comment.author} sx={{ width: 40, height: 40 }} />
                  <Box>
                    <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                        {comment.author}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                        {comment.timeAgo}
                      </Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.4, fontSize: '0.85rem' }}>
                      {comment.text}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1} mt={1}>
                      <IconButton size="small" sx={{ p: 0.5 }}>
                        <ThumbUpOutlinedIcon sx={{ fontSize: '15px' }} />
                      </IconButton>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                        {comment.likes}
                      </Typography>
                      <IconButton size="small" sx={{ p: 0.5 }}>
                        <ThumbDownOutlinedIcon sx={{ fontSize: '15px' }} />
                      </IconButton>
                      <Button size="small" sx={{ color: 'text.secondary', textTransform: 'none', fontSize: '0.75rem', ml: 1, minWidth: 0 }}>
                        Reply
                      </Button>
                    </Stack>
                  </Box>
                </Stack>
              ))}
            </Stack>
          </Box>
        </Grid>

        {/* Sidebar: Related Videos */}
        <Grid item xs={12} lg={4}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
            Up Next
          </Typography>

          {loadingRelated ? (
            <Stack spacing={2}>
              {Array.from(new Array(5)).map((_, i) => (
                <Stack key={i} direction="row" spacing={1.5}>
                  <Skeleton variant="rectangular" width={140} height={80} sx={{ borderRadius: '8px', flexShrink: 0 }} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="90%" />
                    <Skeleton variant="text" width="60%" />
                  </Box>
                </Stack>
              ))}
            </Stack>
          ) : (
            <Stack spacing={2}>
              {relatedVideos.map((item) => (
                <Link
                  key={item.id}
                  to={`/video/${item.id}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <Stack
                    direction="row"
                    spacing={1.5}
                    sx={{
                      cursor: 'pointer',
                      '&:hover .related-title': { color: 'primary.main' }
                    }}
                  >
                    {/* Related video thumbnail */}
                    <Box sx={{ position: 'relative', width: '140px', height: '80px', flexShrink: 0, borderRadius: '8px', overflow: 'hidden' }}>
                      <CardMedia
                        component="img"
                        image={item.thumbnail}
                        alt={item.title}
                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      {item.duration && (
                        <Typography
                          variant="caption"
                          sx={{
                            position: 'absolute',
                            bottom: 4,
                            right: 4,
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            color: '#fff',
                            px: 0.5,
                            py: 0.1,
                            borderRadius: 0.5,
                            fontSize: '9px',
                            fontWeight: 'bold',
                          }}
                        >
                          {item.duration}
                        </Typography>
                      )}
                    </Box>

                    {/* Related video details */}
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography
                        className="related-title line-clamp-2"
                        variant="subtitle2"
                        sx={{
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          lineHeight: '1.1rem',
                          color: 'text.primary',
                          mb: 0.5,
                        }}
                      >
                        {item.title}
                      </Typography>
                      <Stack direction="row" alignItems="center" gap={0.5}>
                        <Typography
                          className="line-clamp-1"
                          variant="body2"
                          sx={{ color: 'text.secondary', fontSize: '0.72rem', fontWeight: 500 }}
                        >
                          {item.channelTitle}
                        </Typography>
                        <CheckCircleIcon sx={{ fontSize: '10px', color: 'gray' }} />
                      </Stack>
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.72rem', mt: 0.2 }}>
                        {item.views} views • {item.uploadTime}
                      </Typography>
                    </Box>
                  </Stack>
                </Link>
              ))}
            </Stack>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default VideoDetail;
