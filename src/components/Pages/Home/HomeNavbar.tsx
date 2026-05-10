import { Box, Button, Typography, Tooltip } from '@mui/material';
import { usethemeUtils } from '../../../context/ThemeWrapper';
import DarkModeIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
// import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
import { useSocket } from '../../../context/SocketContext';

export default function HomeNavbar() {
  const { colorMode, toggleColorMode } = usethemeUtils();
  const { isConnected } = useSocket();

  return (
    <nav
      style={{
        borderBottom: '1px solid var(--cm-border)',
        background:
          colorMode === 'dark'
            ? 'rgba(26, 26, 46, 0.85)'
            : 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <Box
        sx={{
          maxWidth: 1200,
          mx: 'auto',
          px: 3,
          py: 1.5,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Brand */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {/* <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '10px',
              background: 'var(--cm-gradient-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CodeOutlinedIcon sx={{ color: '#fff', fontSize: 20 }} />
          </Box> */}
          {/* Use the logo from the public folder */}
          <img src="/logo.png" alt="Logo" style={{ width: 36, height: 36 }} />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              letterSpacing: '-0.02em',
              background: 'var(--cm-gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Code Master
          </Typography>
        </Box>

        {/* Right: Status and Theme toggle */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Tooltip title={isConnected ? 'Connected to WebSocket' : 'Disconnected from WebSocket'}>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                bgcolor: isConnected ? '#00b894' : '#e17055',
                boxShadow: isConnected ? '0 0 8px rgba(0, 184, 148, 0.6)' : '0 0 8px rgba(225, 112, 85, 0.6)',
                transition: 'all 0.3s ease',
              }}
            />
          </Tooltip>

          <Button
            variant="text"
            onClick={toggleColorMode}
            sx={{
              minWidth: 'auto',
              p: 1,
              borderRadius: '10px',
              color: colorMode === 'dark' ? '#e2e8f0' : '#2d3748',
              '&:hover': {
                background:
                  colorMode === 'dark'
                    ? 'rgba(255,255,255,0.06)'
                    : 'rgba(0,0,0,0.04)',
              },
            }}
          >
            {colorMode === 'dark' ? (
              <LightModeOutlinedIcon fontSize="small" />
            ) : (
              <DarkModeIcon fontSize="small" />
            )}
          </Button>
        </Box>
      </Box>
    </nav>
  );
}
