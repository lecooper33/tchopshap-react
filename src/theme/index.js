import { createTheme } from '@mui/material/styles';

// Couleurs communes
const commonColors = {
  common: {
    black: '#000',
    white: '#fff',
  },
  primary: {
    main: '#ff9800',
    light: '#ffa726',
    dark: '#f57c00',
    contrastText: '#fff',
  },
  secondary: {
    main: '#2196f3',
    light: '#42a5f5',
    dark: '#1976d2',
    contrastText: '#fff',
  },
  error: {
    main: '#f44336',
    light: '#e57373',
    dark: '#d32f2f',
    contrastText: '#fff',
  },
  warning: {
    main: '#ff9800',
    light: '#ffb74d',
    dark: '#f57c00',
    contrastText: 'rgba(0, 0, 0, 0.87)',
  },
  success: {
    main: '#4caf50',
    light: '#81c784',
    dark: '#388e3c',
    contrastText: 'rgba(0, 0, 0, 0.87)',
  },
};

// Thème clair
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    ...commonColors,
    background: {
      default: '#f8f9fa',
      paper: '#fff',
    },
    text: {
      primary: '#2d3436',
      secondary: '#636e72',
      disabled: '#b2bec3',
    },
    divider: 'rgba(0, 0, 0, 0.12)',
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#fff',
          color: '#2d3436',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#fff',
          color: '#2d3436',
        },
      },
    },
  },
});

// Thème sombre
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    ...commonColors,
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#fff',
      secondary: '#b2bec3',
      disabled: '#636e72',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e1e1e',
          color: '#fff',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1e1e1e',
          color: '#fff',
        },
      },
    },
  },
});
