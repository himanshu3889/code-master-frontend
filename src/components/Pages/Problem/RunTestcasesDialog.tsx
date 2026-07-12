import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Box,
  Typography,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import { usethemeUtils } from '../../../context/ThemeWrapper';
import { getThemeColors } from '../../../constants/uiColors';

interface RunTestcasesDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (testCases: string[]) => void;
  defaultTestCases: string[];
  isSubmitting: boolean;
}

export default function RunTestcasesDialog({
  open,
  onClose,
  onSubmit,
  defaultTestCases,
  isSubmitting
}: RunTestcasesDialogProps) {
  const { colorMode } = usethemeUtils();
  const theme = getThemeColors(colorMode as 'dark' | 'light');
  const [testCases, setTestCases] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      if (testCases.length === 0 && defaultTestCases.length > 0) {
        setTestCases([...defaultTestCases]);
      } else if (testCases.length === 0) {
        setTestCases(['']);
      }
    }
  }, [open, defaultTestCases]);

  const handleAddTestCase = () => {
    setTestCases([...testCases, '']);
  };

  const handleRemoveTestCase = (index: number) => {
    const newTestCases = testCases.filter((_, i) => i !== index);
    if (newTestCases.length === 0) {
      newTestCases.push('');
    }
    setTestCases(newTestCases);
  };

  const handleChangeTestCase = (index: number, value: string) => {
    // don't allow more than one space, don't allow two blank lines (\n\n\n -> \n\n)
    let formattedValue = value.replace(/  +/g, ' ');
    formattedValue = formattedValue.replace(/\n{3,}/g, '\n\n');

    const newTestCases = [...testCases];
    newTestCases[index] = formattedValue;
    setTestCases(newTestCases);
  };

  const handleSubmit = () => {
    const finalTestCases = testCases.filter(tc => tc.trim().length > 0);
    onSubmit(finalTestCases.length > 0 ? finalTestCases : defaultTestCases);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: colorMode === 'dark' ? '#1e293b' : '#ffffff',
          backgroundImage: 'none',
          color: theme.textPrimary,
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          maxHeight: '85vh',
        }
      }}
    >
      <DialogTitle sx={{ borderBottom: `1px solid ${theme.borderSecondary}`, pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight="bold">Run Code - Test Cases</Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 3, overflowY: 'auto' }}>
        {testCases.map((tc, index) => (
          <Box key={index} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle2" sx={{ color: theme.textSecondary, fontWeight: 600 }}>
                Testcase {index + 1}
              </Typography>
              <IconButton
                size="small"
                onClick={() => handleRemoveTestCase(index)}
                sx={{ p: 0.5, color: theme.textSecondary, '&:hover': { color: theme.danger } }}
              >
                <DeleteOutlineIcon fontSize="small" sx={{ fontSize: '1rem' }} />
              </IconButton>
            </Box>
            <TextField
              multiline
              fullWidth
              variant="outlined"
              minRows={1}
              maxRows={10}
              value={tc}
              onChange={(e) => handleChangeTestCase(index, e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: theme.textPrimary,
                  fontFamily: 'monospace',
                  bgcolor: theme.bgSecondary,
                  fontSize: '0.85rem',
                  p: 1.5,
                  '& fieldset': { borderColor: theme.borderSecondary },
                  '&:hover fieldset': { borderColor: theme.borderHover },
                  '&.Mui-focused fieldset': { borderColor: 'var(--cm-primary)' },
                }
              }}
            />
          </Box>
        ))}

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
          <Button
            startIcon={<AddIcon />}
            onClick={handleAddTestCase}
            variant="text"
            sx={{
              color: 'var(--cm-primary)',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
            }}
          >
            Add Testcase
          </Button>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2.5, borderTop: `1px solid ${theme.borderSecondary}` }}>
        <Button
          onClick={onClose}
          sx={{ color: theme.textSecondary, textTransform: 'none' }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isSubmitting}
          sx={{
            bgcolor: 'var(--cm-primary)',
            color: '#fff',
            textTransform: 'none',
            px: 4,
            '&:hover': { bgcolor: 'var(--cm-primary-hover)' }
          }}
        >
          {isSubmitting ? 'Running...' : 'Run Code'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
