import React, { useState, useEffect } from 'react';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { Problem } from '../../../constants/statuses';
import { usethemeUtils } from '../../../context/ThemeWrapper';
import { getThemeColors } from '../../../constants/uiColors';
import { updateProblemNotes } from '../../../services/codeMasterApi';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const ProblemNotes: React.FC<{ problem: Problem | null }> = ({ problem }) => {
  const { colorMode } = usethemeUtils();
  const theme = getThemeColors(colorMode as 'dark' | 'light');
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (problem) {
      setNotes(problem.notes || '');
    }
  }, [problem]);

  if (!problem) return null;

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProblemNotes(problem.id, notes);
      queryClient.setQueryData(['problem', problem.id], (old: any) => {
        if (!old) return old;
        return { ...old, notes };
      });
      setIsEditing(false);
      toast.success('Notes saved successfully');
    } catch (err) {
      toast.error('Failed to save notes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={2} sx={{ overflowY: 'auto', height: '100%', p: 1.5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 700,
            color: theme.textPrimary,
          }}
        >
          My Notes
        </Typography>
        {!isEditing ? (
          <Button
            size="small"
            startIcon={<EditOutlinedIcon />}
            onClick={() => setIsEditing(true)}
            sx={{ textTransform: 'none', color: theme.primary }}
          >
            Edit
          </Button>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              onClick={() => {
                setNotes(problem.notes || '');
                setIsEditing(false);
              }}
              sx={{ textTransform: 'none', color: theme.textSecondary }}
            >
              Cancel
            </Button>
            <Button
              size="small"
              variant="contained"
              startIcon={<SaveOutlinedIcon />}
              onClick={handleSave}
              disabled={loading}
              sx={{
                textTransform: 'none',
                bgcolor: 'var(--cm-primary)',
                '&:hover': { bgcolor: 'var(--cm-primary-hover)' },
              }}
            >
              Save
            </Button>
          </Box>
        )}
      </Box>

      {isEditing ? (
        <TextField
          fullWidth
          multiline
          minRows={10}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Write your personal notes here..."
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: theme.bgTableHeader,
              color: theme.textPrimary,
              borderRadius: '8px',
              '& fieldset': { borderColor: theme.borderPrimary },
              '&:hover fieldset': { borderColor: theme.primary },
              '&.Mui-focused fieldset': { borderColor: theme.primary },
            },
          }}
        />
      ) : (
        <Box
          sx={{
            p: 2,
            borderRadius: '8px',
            bgcolor: theme.bgTableHeader,
            border: `1px solid ${theme.borderSecondary}`,
            minHeight: '200px',
            whiteSpace: 'pre-wrap',
            color: theme.textPrimary,
            fontSize: '0.85rem',
            lineHeight: 1.6,
          }}
        >
          {problem.notes ? (
            problem.notes
          ) : (
            <Typography variant="body2" sx={{ color: theme.textTertiary, fontStyle: 'italic' }}>
              No notes added yet. Click edit to add some.
            </Typography>
          )}
        </Box>
      )}
    </Stack>
  );
};

export default ProblemNotes;
