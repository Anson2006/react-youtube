import { useState } from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import { Box, Stack, Drawer } from '@mui/material';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Feed from './pages/Feed';
import VideoDetail from './pages/VideoDetail';
import ChannelDetail from './pages/ChannelDetail';
import SearchFeed from './pages/SearchFeed';

const VideoDetailWrapper = () => {
  const { id } = useParams();
  return <VideoDetail key={id} />;
};

function App() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const toggleSidebar = () => {
    // If mobile viewport (< 600px), toggle drawer. Otherwise, toggle desktop sidebar collapse.
    if (window.innerWidth < 600) {
      setMobileOpen(!mobileOpen);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: 'background.default',
        color: 'text.primary',
      }}
    >
      {/* Top Navbar */}
      <Navbar toggleSidebar={toggleSidebar} />

      {/* Main Layout Container */}
      <Stack direction="row" sx={{ flex: 1, overflow: 'hidden' }}>
        {/* Responsive Mobile Drawer Navigation */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: 240,
              backgroundColor: 'background.default',
              backgroundImage: 'none',
              borderRight: (theme) => `1px solid ${theme.palette.mode === 'dark' ? '#272727' : '#e5e5e5'}`,
            },
          }}
        >
          <Box onClick={handleDrawerToggle}>
            <Sidebar
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              isCollapsed={false}
              mobileView={true}
            />
          </Box>
        </Drawer>

        {/* Desktop Sidebar Navigation */}
        <Sidebar
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          isCollapsed={isSidebarCollapsed}
          mobileView={false}
        />

        {/* View Page Content */}
        <Box
          component="main"
          className="custom-scrollbar"
          sx={{
            flex: 1,
            overflowY: 'auto',
            backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#0f0f0f' : '#f9f9f9',
          }}
        >
          <Routes>
            <Route
              path="/"
              element={
                <Feed
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                />
              }
            />
            <Route path="/video/:id" element={<VideoDetailWrapper />} />
            <Route path="/channel/:id" element={<ChannelDetail />} />
            <Route path="/search/:searchTerm" element={<SearchFeed />} />
          </Routes>
        </Box>
      </Stack>
    </Box>
  );
}

export default App;
