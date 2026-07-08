import { useNavigate, useLocation } from 'react-router-dom';
import { Stack, Button, Typography, Divider, Box, Avatar } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import CodeIcon from '@mui/icons-material/Code';
import DeveloperModeIcon from '@mui/icons-material/DeveloperMode';
import LanguageIcon from '@mui/icons-material/Language';
import DevicesIcon from '@mui/icons-material/Devices';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import TheaterComedyIcon from '@mui/icons-material/TheaterComedy';
import VideoLibraryOutlinedIcon from '@mui/icons-material/VideoLibraryOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import WatchLaterOutlinedIcon from '@mui/icons-material/WatchLaterOutlined';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';

const categories = [
  { name: 'All', icon: <HomeIcon /> },
  { name: 'ReactJS', icon: <CodeIcon /> },
  { name: 'NextJS', icon: <DeveloperModeIcon /> },
  { name: 'JavaScript', icon: <LanguageIcon /> },
  { name: 'Tech', icon: <DevicesIcon /> },
  { name: 'Music', icon: <MusicNoteIcon /> },
  { name: 'Gaming', icon: <SportsEsportsIcon /> },
  { name: 'Comedy', icon: <TheaterComedyIcon /> },
];

const Sidebar = ({ selectedCategory, setSelectedCategory, isCollapsed, mobileView }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleCategoryClick = (categoryName) => {
    if (setSelectedCategory) {
      setSelectedCategory(categoryName);
    }
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  // If collapsed, render mini-sidebar (compact)
  if (isCollapsed) {
    return (
      <Stack
        sx={{
          width: '72px',
          height: 'calc(100vh - 56px)',
          position: 'sticky',
          top: '56px',
          backgroundColor: 'background.default',
          borderRight: (theme) => `1px solid ${theme.palette.mode === 'dark' ? '#272727' : '#e5e5e5'}`,
          py: 1,
          px: 0.5,
          alignItems: 'center',
          gap: 2,
          display: { xs: 'none', sm: 'flex' },
        }}
      >
        {categories.slice(0, 5).map((category) => (
          <Button
            key={category.name}
            onClick={() => handleCategoryClick(category.name)}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textTransform: 'none',
              minWidth: '0',
              width: '64px',
              height: '64px',
              borderRadius: '8px',
              p: 0.5,
              color: category.name === selectedCategory ? 'primary.main' : 'text.primary',
              backgroundColor: category.name === selectedCategory ? 'background.hover' : 'transparent',
              '&:hover': {
                backgroundColor: 'background.hover',
              },
            }}
          >
            <Box sx={{ fontSize: '20px' }}>{category.icon}</Box>
            <Typography
              variant="caption"
              sx={{
                fontSize: '10px',
                mt: 0.5,
                fontWeight: category.name === selectedCategory ? 'bold' : 'normal',
                textAlign: 'center',
              }}
            >
              {category.name}
            </Typography>
          </Button>
        ))}
      </Stack>
    );
  }

  // Otherwise, render full standard expanded sidebar
  return (
    <Stack
      className="custom-scrollbar"
      sx={{
        width: '240px',
        height: 'calc(100vh - 56px)',
        position: 'sticky',
        top: '56px',
        backgroundColor: 'background.default',
        borderRight: (theme) => `1px solid ${theme.palette.mode === 'dark' ? '#272727' : '#e5e5e5'}`,
        py: 2,
        px: 1.5,
        gap: 0.5,
        display: { xs: mobileView ? 'flex' : 'none', sm: 'flex' },
        overflowY: 'auto',
      }}
    >
      <Typography variant="body2" sx={{ px: 1.5, pb: 1, fontWeight: 'bold', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px' }}>
        Categories
      </Typography>

      {categories.map((category) => (
        <Button
          key={category.name}
          onClick={() => handleCategoryClick(category.name)}
          startIcon={category.icon}
          fullWidth
          sx={{
            justifyContent: 'flex-start',
            px: 2,
            py: 1.2,
            borderRadius: '10px',
            color: 'text.primary',
            backgroundColor: category.name === selectedCategory ? 'background.hover' : 'transparent',
            fontWeight: category.name === selectedCategory ? 600 : 400,
            borderLeft: (theme) => category.name === selectedCategory ? `4px solid ${theme.palette.primary.main}` : '4px solid transparent',
            pl: category.name === selectedCategory ? 1.5 : 2, // offset border left
            '&:hover': {
              backgroundColor: 'background.hover',
            },
            '& .MuiButton-startIcon': {
              color: category.name === selectedCategory ? 'primary.main' : 'text.secondary',
              mr: 2,
            },
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 'inherit' }}>
            {category.name}
          </Typography>
        </Button>
      ))}

      <Divider sx={{ my: 1.5, borderColor: (theme) => theme.palette.mode === 'dark' ? '#272727' : '#e5e5e5' }} />

      <Typography variant="body2" sx={{ px: 1.5, pb: 1, fontWeight: 'bold', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px' }}>
        Library
      </Typography>

      <Button
        startIcon={<VideoLibraryOutlinedIcon />}
        fullWidth
        sx={{
          justifyContent: 'flex-start',
          px: 2,
          py: 1,
          borderRadius: '10px',
          color: 'text.primary',
          '&:hover': { backgroundColor: 'background.hover' },
          '& .MuiButton-startIcon': { color: 'text.secondary', mr: 2 },
        }}
      >
        <Typography variant="body2">Library</Typography>
      </Button>

      <Button
        startIcon={<HistoryOutlinedIcon />}
        fullWidth
        sx={{
          justifyContent: 'flex-start',
          px: 2,
          py: 1,
          borderRadius: '10px',
          color: 'text.primary',
          '&:hover': { backgroundColor: 'background.hover' },
          '& .MuiButton-startIcon': { color: 'text.secondary', mr: 2 },
        }}
      >
        <Typography variant="body2">History</Typography>
      </Button>

      <Button
        startIcon={<WatchLaterOutlinedIcon />}
        fullWidth
        sx={{
          justifyContent: 'flex-start',
          px: 2,
          py: 1,
          borderRadius: '10px',
          color: 'text.primary',
          '&:hover': { backgroundColor: 'background.hover' },
          '& .MuiButton-startIcon': { color: 'text.secondary', mr: 2 },
        }}
      >
        <Typography variant="body2">Watch Later</Typography>
      </Button>

      <Button
        startIcon={<ThumbUpOutlinedIcon />}
        fullWidth
        sx={{
          justifyContent: 'flex-start',
          px: 2,
          py: 1,
          borderRadius: '10px',
          color: 'text.primary',
          '&:hover': { backgroundColor: 'background.hover' },
          '& .MuiButton-startIcon': { color: 'text.secondary', mr: 2 },
        }}
      >
        <Typography variant="body2">Liked Videos</Typography>
      </Button>

      <Divider sx={{ my: 1.5, borderColor: (theme) => theme.palette.mode === 'dark' ? '#272727' : '#e5e5e5' }} />

      <Typography variant="body2" sx={{ px: 1.5, pb: 1, fontWeight: 'bold', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px' }}>
        Subscriptions
      </Typography>

      <Button
        startIcon={<Avatar src="https://yt3.googleusercontent.com/ytc/AIdro5lZ_9oQ4N2-6sQv1Vz_e2-tKz9pPzG2Gz=s176-c-k-c0x00ffffff-no-rj" sx={{ width: 24, height: 24 }} />}
        fullWidth
        onClick={() => navigate('/channel/freecodecamp')}
        sx={{
          justifyContent: 'flex-start',
          px: 2,
          py: 0.8,
          borderRadius: '10px',
          color: 'text.primary',
          '&:hover': { backgroundColor: 'background.hover' },
          '& .MuiButton-startIcon': { mr: 2 },
        }}
      >
        <Typography variant="body2" noWrap>freeCodeCamp.org</Typography>
      </Button>

      <Button
        startIcon={<Avatar src="https://yt3.googleusercontent.com/wg1T7tGU2DgUCcvJvtNuEqOxg6wK-Y7k72Gzk5wRKAeFR9QG=s176-c-k-c0x00ffffff-no-rj" sx={{ width: 24, height: 24 }} />}
        fullWidth
        onClick={() => navigate('/channel/javascriptmastery')}
        sx={{
          justifyContent: 'flex-start',
          px: 2,
          py: 0.8,
          borderRadius: '10px',
          color: 'text.primary',
          '&:hover': { backgroundColor: 'background.hover' },
          '& .MuiButton-startIcon': { mr: 2 },
        }}
      >
        <Typography variant="body2" noWrap>JavaScript Mastery</Typography>
      </Button>

      <Button
        startIcon={<Avatar src="https://yt3.googleusercontent.com/lkH3LxEB18DOwp5bJ12g1FyAB5c8A16z6n3IXP36x9iO2=s176-c-k-c0x00ffffff-no-rj" sx={{ width: 24, height: 24 }} />}
        fullWidth
        onClick={() => navigate('/channel/mkbhd')}
        sx={{
          justifyContent: 'flex-start',
          px: 2,
          py: 0.8,
          borderRadius: '10px',
          color: 'text.primary',
          '&:hover': { backgroundColor: 'background.hover' },
          '& .MuiButton-startIcon': { mr: 2 },
        }}
      >
        <Typography variant="body2" noWrap>Marques Brownlee</Typography>
      </Button>

      <Typography variant="caption" sx={{ px: 1.5, pt: 2, color: 'text.secondary', display: 'block', fontSize: '11px' }}>
        © 2026 YouTube, LLC
      </Typography>
    </Stack>
  );
};

export default Sidebar;
