import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Paper, IconButton, InputBase } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (searchTerm.trim()) {
      navigate(`/search/${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      sx={{
        borderRadius: 20,
        border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? '#303030' : '#ccc'}`,
        pl: 2,
        boxShadow: 'none',
        mr: { sm: 5 },
        display: 'flex',
        alignItems: 'center',
        width: { xs: '150px', sm: '350px', md: '500px' },
        backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#121212' : '#fff',
        transition: 'all 0.15s ease-in-out',
        '&:focus-within': {
          border: '1px solid #1c62b9',
          boxShadow: '0px 0px 4px rgba(28, 98, 185, 0.4)',
        }
      }}
    >
      <InputBase
        className="search-bar"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{
          ml: 1,
          flex: 1,
          color: (theme) => theme.palette.text.primary,
          fontSize: '0.95rem',
        }}
      />
      <IconButton
        type="submit"
        sx={{
          p: '10px',
          color: (theme) => theme.palette.text.primary,
          backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#222222' : '#f8f8f8',
          borderTopRightRadius: 20,
          borderBottomRightRadius: 20,
          borderLeft: (theme) => `1px solid ${theme.palette.mode === 'dark' ? '#303030' : '#ccc'}`,
          borderRadius: 0,
          px: { xs: 1.5, sm: 3 },
          '&:hover': {
            backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#333' : '#ebebeb',
          }
        }}
        aria-label="search"
      >
        <SearchIcon />
      </IconButton>
    </Paper>
  );
};

export default SearchBar;
