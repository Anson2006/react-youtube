/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const ColorModeContext = createContext({
  toggleColorMode: () => {},
  mode: 'dark',
});

export const useColorMode = () => useContext(ColorModeContext);

export const ThemeContextProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('youtube-clone-theme');
    return savedMode ? savedMode : 'dark';
  });

  useEffect(() => {
    localStorage.setItem('youtube-clone-theme', mode);
  }, [mode]);

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#FF0000', // YouTube Red
            light: '#ff3333',
            dark: '#cc0000',
          },
          secondary: {
            main: mode === 'dark' ? '#ffffff' : '#0f0f0f',
          },
          background: {
            default: mode === 'dark' ? '#0f0f0f' : '#f9f9f9',
            paper: mode === 'dark' ? '#1f1f1f' : '#ffffff',
            hover: mode === 'dark' ? '#2d2d2d' : '#f2f2f2',
            alt: mode === 'dark' ? '#0a0a0a' : '#f0f0f0',
          },
          text: {
            primary: mode === 'dark' ? '#ffffff' : '#0f0f0f',
            secondary: mode === 'dark' ? '#aaaaaa' : '#606060',
          },
        },
        typography: {
          fontFamily: '"Roboto", "Inter", "Helvetica", "Arial", sans-serif',
          h6: {
            fontSize: '1rem',
            fontWeight: 500,
            lineHeight: 1.4,
          },
          body1: {
            fontSize: '0.875rem',
            lineHeight: 1.4,
          },
          body2: {
            fontSize: '0.75rem',
            color: mode === 'dark' ? '#aaaaaa' : '#606060',
          },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                borderRadius: 20,
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                boxShadow: 'none',
                backgroundImage: 'none',
                backgroundColor: 'transparent',
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={{ toggleColorMode, mode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};
