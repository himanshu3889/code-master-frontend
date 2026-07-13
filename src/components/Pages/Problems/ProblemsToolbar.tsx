import { Box, TextField, InputAdornment, IconButton, Select, MenuItem, Typography, Button } from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import RestartAltOutlinedIcon from '@mui/icons-material/RestartAltOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { ProblemStatus, problemStatusLabels } from '../../../constants/statuses';
import { usethemeUtils } from '../../../context/ThemeWrapper';
import { getThemeColors } from '../../../constants/uiColors';

interface ProblemsToolbarProps {
  searchQuery: string;
  searchStatus: string;
  onSearchChange: (q: string) => void;
  onStatusChange: (s: string) => void;
  onClearSearch: () => void;
  onReset: () => void;
  onCreateClick: () => void;
  activeCount: number;
}

export default function ProblemsToolbar({
  searchQuery,
  searchStatus,
  onSearchChange,
  onStatusChange,
  onClearSearch,
  onReset,
  onCreateClick,
  activeCount,
}: ProblemsToolbarProps) {
  const { colorMode } = usethemeUtils();
  const theme = getThemeColors(colorMode as 'dark' | 'light');

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
        <TextField
          placeholder="Search problems..."
          size="small"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlinedIcon sx={{ fontSize: 18, color: theme.textSecondary }} />
              </InputAdornment>
            ),
            endAdornment: searchQuery ? (
              <InputAdornment position="end">
                <IconButton size="small" onClick={onClearSearch}>
                  <ClearOutlinedIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </InputAdornment>
            ) : null,
          }}
          sx={{
            width: 320,
            '& .MuiOutlinedInput-root': {
              borderRadius: '10px',
              fontSize: '0.85rem',
              bgcolor: theme.bgTertiary,
              '& fieldset': { borderColor: theme.borderPrimary },
              '&:hover fieldset': { borderColor: theme.borderHover },
              '&.Mui-focused fieldset': { borderColor: theme.primary },
            },
          }}
        />
        <Select
          value={searchStatus}
          displayEmpty
          size="small"
          onChange={(e) => onStatusChange(e.target.value as string)}
          sx={{
            width: 180,
            borderRadius: '10px',
            fontSize: '0.85rem',
            bgcolor: theme.bgTertiary,
            color: searchStatus ? theme.textPrimary : theme.textSecondary,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.borderPrimary,
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.borderHover,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: theme.primary },
          }}
          MenuProps={{
            disableScrollLock: true,
          }}
        >
          <MenuItem value="" sx={{ fontSize: '0.85rem', color: theme.textSecondary, fontStyle: 'italic' }}>
            All Statuses
          </MenuItem>
          {Object.values(ProblemStatus).map((status) => (
            <MenuItem key={status} value={status} sx={{ fontSize: '0.85rem' }}>
              {problemStatusLabels[status as ProblemStatus]}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="caption" sx={{ color: theme.textSecondary }}>
          {activeCount} problems
        </Typography>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddCircleOutlineIcon sx={{ fontSize: 16 }} />}
          onClick={onCreateClick}
          sx={{
            textTransform: 'none',
            background: 'var(--cm-gradient-primary)',
            boxShadow: '0 4px 14px rgba(108, 92, 231, 0.4)',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '0.75rem',
            px: 2,
            '&:hover': {
              background: 'var(--cm-gradient-primary)',
              filter: 'brightness(1.1)',
              boxShadow: '0 6px 20px rgba(108, 92, 231, 0.6)',
            }
          }}
        >
          Create Problem
        </Button>
        <IconButton
          size="small"
          title="Reset"
          onClick={onReset}
          sx={{ color: theme.textSecondary }}
        >
          <RestartAltOutlinedIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
}
