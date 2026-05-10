import { useNavigate } from 'react-router-dom';
import { usethemeUtils } from '../../context/ThemeWrapper';
import { Button, Box, IconButton, Tooltip } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeIcon from '@mui/icons-material/LightModeOutlined';
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { useSocket } from '../../context/SocketContext';

export default function Navbar({ middleContent }: { middleContent?: React.ReactNode }) {
  const { colorMode, toggleColorMode } = usethemeUtils();
  const location = window.location;
  const navigate = useNavigate();
  const isDark = colorMode === 'dark';
  const isProblemPage = location.pathname.startsWith('/problem/');
  const { isConnected } = useSocket();

  return (
    <nav
      style={{
        borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
        background: isDark ? 'rgba(26, 26, 46, 0.9)' : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 2,
          py: 1,
        }}
      >
        {/* Left: Brand + nav */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
          <Box
            onClick={() => navigate('/')}
            sx={{
              width: 32,
              height: 32,
              borderRadius: '8px',
              background: 'var(--cm-gradient-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.05)' },
            }}
          >
            <CodeOutlinedIcon sx={{ color: '#fff', fontSize: 18 }} />
          </Box>

          {isProblemPage && (
            <IconButton
              onClick={() => navigate('/')}
              size="small"
              title="Back to problems"
              sx={{ color: isDark ? '#94a3b8' : '#64748b' }}
            >
              <HomeOutlinedIcon fontSize="small" />
            </IconButton>
          )}
        </Box>

        {/* Middle content */}
        {middleContent && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 2 }}>
            {middleContent}
          </Box>
        )}

        {/* Right: Status and Theme toggle */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, justifyContent: 'flex-end' }}>
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
              p: 0.75,
              borderRadius: '8px',
              color: isDark ? '#e2e8f0' : '#2d3748',
              '&:hover': {
                background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
              },
            }}
          >
            {isDark ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
          </Button>
        </Box>
      </Box>
    </nav>
  );
}
