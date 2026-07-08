import { Link } from 'react-router-dom';
import { Stack, Box, IconButton, Avatar, Tooltip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import YouTubeIcon from '@mui/icons-material/YouTube';
import VideoCallOutlinedIcon from '@mui/icons-material/VideoCallOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import SearchBar from './SearchBar';
import { useColorMode } from '../context/ThemeContext';

const Navbar = ({ toggleSidebar }) => {
  const { toggleColorMode, mode } = useColorMode();

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      p={2}
      sx={{
        position: 'sticky',
        background: (theme) => theme.palette.background.default,
        top: 0,
        zIndex: 100,
        borderBottom: (theme) => `1px solid ${theme.palette.mode === 'dark' ? '#272727' : '#e5e5e5'}`,
        height: '56px',
        py: 1,
      }}
    >
      {/* Left section: Hamburger and Logo */}
      <Stack direction="row" alignItems="center" gap={1}>
        <IconButton
          onClick={toggleSidebar}
          sx={{
            color: 'text.primary',
            '&:hover': { backgroundColor: 'background.hover' },
          }}
        >
          <MenuIcon />
        </IconButton>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
          <YouTubeIcon sx={{ color: '#FF0000', fontSize: '32px', mr: 0.5 }} />
          <Box
            component="span"
            sx={{
              fontWeight: 'bold',
              fontSize: '1.25rem',
              letterSpacing: '-0.5px',
              fontFamily: '"Oswald", "Roboto", sans-serif',
              display: { xs: 'none', sm: 'inline-block' },
            }}
          >
            YouTube
          </Box>
        </Link>
      </Stack>

      {/* Middle section: Search Bar */}
      <SearchBar />

      {/* Right section: Actions & Avatar */}
      <Stack direction="row" alignItems="center" gap={{ xs: 0.5, sm: 1.5 }}>
        <Tooltip title={mode === 'dark' ? 'Light Mode' : 'Dark Mode'}>
          <IconButton onClick={toggleColorMode} color="inherit">
            {mode === 'dark' ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Create">
          <IconButton sx={{ display: { xs: 'none', md: 'inline-flex' } }} color="inherit">
            <VideoCallOutlinedIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Notifications">
          <IconButton sx={{ display: { xs: 'none', md: 'inline-flex' } }} color="inherit">
            <NotificationsOutlinedIcon />
          </IconButton>
        </Tooltip>

        <Avatar
          alt="User Profile"
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"
          sx={{
            width: 32,
            height: 32,
            cursor: 'pointer',
            ml: 1,
            border: '1px solid rgba(0,0,0,0.1)',
            transition: 'transform 0.15s ease-in-out',
            '&:hover': {
              transform: 'scale(1.05)',
            }
          }}
        />
      </Stack>
    </Stack>
  );
};

export default Navbar;
