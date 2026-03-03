import { createTheme } from '@mui/material/styles';

export const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          primary: { main: '#1565C0', light: '#1E88E5', dark: '#0D47A1' },
          secondary: { main: '#5C6BC0', light: '#7986CB', dark: '#3949AB' },
          error: { main: '#D32F2F', light: '#EF5350', dark: '#C62828' },
          warning: { main: '#ED6C02', light: '#FF9800', dark: '#E65100' },
          success: { main: '#2E7D32', light: '#4CAF50', dark: '#1B5E20' },
          background: { default: '#F4F6F8', paper: '#FFFFFF' },
          text: { primary: '#1A2027', secondary: '#637381' },
        }
      : {
          primary: { main: '#42A5F5', light: '#64B5F6', dark: '#1E88E5' },
          secondary: { main: '#7986CB', light: '#9FA8DA', dark: '#5C6BC0' },
          error: { main: '#EF5350', light: '#E57373', dark: '#D32F2F' },
          warning: { main: '#FFA726', light: '#FFB74D', dark: '#F57C00' },
          success: { main: '#66BB6A', light: '#81C784', dark: '#388E3C' },
          background: { default: '#0A1929', paper: '#132F4C' },
          text: { primary: '#FFFFFF', secondary: '#B2BAC2' },
        }),
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: mode === 'light'
            ? '0 2px 12px 0 rgba(0,0,0,0.08)'
            : '0 2px 12px 0 rgba(0,0,0,0.4)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, padding: '8px 20px' },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 500 },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: { fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: 1 },
      },
    },
  },
});

export const createAppTheme = (mode) => createTheme(getDesignTokens(mode));
