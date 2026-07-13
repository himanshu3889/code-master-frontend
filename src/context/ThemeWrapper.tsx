import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { createContext, FC, useContext, useMemo, useState } from 'react';

export const ThemeWrapperContext = createContext<themeContext>({
  toggleColorMode: () => {},
  colorMode: 'dark',
});

export const usethemeUtils = () => {
  const themeutils = useContext(ThemeWrapperContext);
  return themeutils;
};

const ThemeWrapper: FC<contextWrapperProps> = ({ children }) => {
  const [mode, setMode] = useState<'light' | 'dark'>('dark');

  const darkTheme = createTheme({
    palette: {
      mode,
      primary: {
        main: '#6c5ce7',
        light: '#a29bfe',
        dark: '#5b4cdb',
      },
      secondary: {
        main: '#00cec9',
        light: '#81ecec',
        dark: '#00b5b0',
      },
      background: {
        default: mode === 'light' ? '#f8fafc' : '#0f172a',
        paper: mode === 'light' ? '#ffffff' : '#1e293b',
      },
      success: {
        main: '#00b894',
      },
      error: {
        main: '#e17055',
      },
      warning: {
        main: '#fdcb6e',
      },
      common: {
        white: '#ffffff',
        black: '#000000',
      },
    },
    typography: {
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      button: {
        textTransform: 'none',
        fontWeight: 500,
      },
      h3: {
        fontWeight: 800,
        letterSpacing: '-0.03em',
      },
      h5: {
        fontWeight: 700,
        letterSpacing: '-0.01em',
      },
      h6: {
        fontWeight: 700,
        letterSpacing: '-0.01em',
      },
    },
    shape: {
      borderRadius: 10,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
    },
  });

  const themeWrapperUtils = useMemo(
    () => ({
      colorMode: mode,
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [mode]
  );

  return (
    <ThemeWrapperContext.Provider value={themeWrapperUtils}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeWrapperContext.Provider>
  );
};

export default ThemeWrapper;
