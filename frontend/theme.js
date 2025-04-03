import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark', // Enables dark mode
    primary: {
      main: '#6A0DAD', // Deep royal purple
    },
    secondary: {
      main: '#E5C100', // Warm, rich gold
    },
    background: {
      default: '#121212', // Almost black
      paper: '#1E1E1E', // Slightly lighter black for contrast
    },
    text: {
      primary: '#FFFFFF', // White text for readability
      secondary: '#E5C100', // Gold highlights
    },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
    h1: { fontSize: '2.5rem', fontWeight: 700, color: '#E5C100' },
    h2: { fontSize: '2rem', fontWeight: 600, color: '#6A0DAD' },
    h3: { fontSize: '1.8rem', fontWeight: 500, color: '#FFFFFF' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 'bold',
          padding: '10px 20px',
          borderRadius: '10px',
          transition: '0.3s',
          '&:hover': {
            backgroundColor: '#E5C100',
            color: '#121212',
          },
        },
      },
    },
  },
});

export default theme;
