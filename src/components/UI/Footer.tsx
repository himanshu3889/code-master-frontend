import { Box, Typography } from '@mui/material';
import { usethemeUtils } from '../../context/ThemeWrapper';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';

export default function Footer() {
  const { colorMode } = usethemeUtils();
  const isDark = colorMode === 'dark';

  return (
    <footer
      style={{
        borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
        padding: '12px 0',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 0.5,
          color: isDark ? '#475569' : '#94a3b8',
        }}
      >
        <Typography variant="caption">Code Master</Typography>
        <Typography variant="caption">·</Typography>
        <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          Made with <FavoriteOutlinedIcon sx={{ fontSize: 12, color: '#e17055' }} />
        </Typography>
      </Box>
    </footer>
  );
}
