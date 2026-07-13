import React, { useState, useEffect } from 'react';
import { Box, Chip, Stack, Typography, Link as MuiLink, Button, TextField, Select, MenuItem, FormControl } from '@mui/material';
import { Problem, ProblemStatus, ProblemDifficultyLevel, problemStatusLabels, problemDifficultyLabels } from '../../../constants/statuses';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import MemoryOutlinedIcon from '@mui/icons-material/MemoryOutlined';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { usethemeUtils } from '../../../context/ThemeWrapper';
import { getThemeColors } from '../../../constants/uiColors';
import { updateProblemStatus, updateProblemDifficulty, updateProblemDescription } from '../../../services/codeMasterApi';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const ProblemDescription: React.FC<{
  problem: Problem | null;
  isInterviewMode?: boolean;
}> = ({ problem, isInterviewMode }) => {
  const { colorMode } = usethemeUtils();
  const isDark = colorMode === 'dark';
  const theme = getThemeColors(colorMode as 'dark' | 'light');
  const queryClient = useQueryClient();

  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [description, setDescription] = useState('');
  const [savingDesc, setSavingDesc] = useState(false);

  useEffect(() => {
    if (problem) {
      setDescription(problem.description || '');
    }
  }, [problem]);

  if (!problem) return null;

  const handleStatusChange = async (e: any) => {
    const newStatus = e.target.value;
    try {
      await updateProblemStatus(problem.id, newStatus);
      queryClient.setQueryData(['problem', String(problem.id)], (old: any) => ({ ...old, status: newStatus }));
      toast.success('Status updated');
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleDifficultyChange = async (e: any) => {
    const newDiff = e.target.value;
    try {
      await updateProblemDifficulty(problem.id, newDiff);
      queryClient.setQueryData(['problem', String(problem.id)], (old: any) => ({ ...old, difficultyLevel: newDiff }));
      toast.success('Difficulty updated');
    } catch (err) {
      toast.error('Failed to update difficulty');
    }
  };

  const handleSaveDescription = async () => {
    setSavingDesc(true);
    try {
      await updateProblemDescription(problem.id, description);
      queryClient.setQueryData(['problem', String(problem.id)], (old: any) => ({ ...old, description }));
      setIsEditingDesc(false);
      toast.success('Description updated');
    } catch (err) {
      toast.error('Failed to update description');
    } finally {
      setSavingDesc(false);
    }
  };

  return (
    <Stack spacing={3} sx={{ overflowY: 'auto', height: '100%', p: 1.5 }}>
      {/* Title & Group */}
      <Box>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            letterSpacing: '-0.01em',
            color: theme.textPrimary,
            mb: 1,
          }}
        >
          {problem.name}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap', mb: 2 }}>
          {problem.group && (
            <Chip
              label={problem.group}
              size="small"
              sx={{
                fontSize: '0.7rem',
                fontWeight: 600,
                bgcolor: theme.primaryBgSubtle,
                color: theme.primaryText,
                border: `1px solid ${theme.primaryBorder}`,
              }}
            />
          )}
          {problem.url && (
            <MuiLink
              href={problem.url}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                ml: 1,
                fontSize: '0.75rem',
                color: theme.primary,
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              Original <OpenInNewOutlinedIcon sx={{ fontSize: 12 }} />
            </MuiLink>
          )}
        </Box>

        {/* Status & Difficulty Dropdowns */}
        <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={problem.status || ProblemStatus.TODO}
              onChange={handleStatusChange}
              displayEmpty
              sx={{
                fontSize: '0.8rem',
                bgcolor: theme.bgQuaternary,
                color: theme.textPrimary,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.borderPrimary,
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.primary,
                },
              }}
            >
              {Object.values(ProblemStatus).map((status) => (
                <MenuItem key={status} value={status} sx={{ fontSize: '0.8rem' }}>{problemStatusLabels[status as ProblemStatus]}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={problem.difficultyLevel || ''}
              onChange={handleDifficultyChange}
              displayEmpty
              sx={{
                fontSize: '0.8rem',
                bgcolor: theme.bgQuaternary,
                color: theme.textPrimary,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.borderPrimary,
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#00cec9',
                },
              }}
            >
              <MenuItem value="" sx={{ fontSize: '0.8rem', fontStyle: 'italic', color: theme.textSecondary }}>
                Unset
              </MenuItem>
              {Object.values(ProblemDifficultyLevel).map((diff) => (
                <MenuItem key={diff} value={diff} sx={{ fontSize: '0.8rem' }}>{problemDifficultyLabels[diff as ProblemDifficultyLevel]}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Description Section */}
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.textPrimary, fontSize: '0.85rem' }}>
            Description
          </Typography>
          {!isEditingDesc ? (
            <Button
              size="small"
              startIcon={<EditOutlinedIcon />}
              onClick={() => setIsEditingDesc(true)}
              sx={{ textTransform: 'none', color: theme.primary }}
            >
              Edit
            </Button>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                size="small"
                onClick={() => {
                  setDescription(problem.description || '');
                  setIsEditingDesc(false);
                }}
                sx={{ textTransform: 'none', color: theme.textSecondary }}
              >
                Cancel
              </Button>
              <Button
                size="small"
                variant="contained"
                startIcon={<SaveOutlinedIcon />}
                onClick={handleSaveDescription}
                disabled={savingDesc}
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

        {isEditingDesc ? (
          <TextField
            fullWidth
            multiline
            minRows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write problem description here..."
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
              whiteSpace: 'pre-wrap',
              color: theme.textPrimary,
              fontSize: '0.85rem',
              lineHeight: 1.6,
            }}
          >
            {problem.description ? (
              problem.description
            ) : (
              <Typography variant="body2" sx={{ color: theme.textTertiary, fontStyle: 'italic' }}>
                No description available. Click edit to add one.
              </Typography>
            )}
          </Box>
        )}
      </Box>

      {/* Limits */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.75,
            px: 1.5,
            py: 0.75,
            borderRadius: '8px',
            bgcolor: isDark ? `${theme.primary}15` : theme.primaryBgSubtle,
            border: `1px solid ${theme.primary}30`,
          }}
        >
          <AccessTimeOutlinedIcon sx={{ fontSize: 16, color: theme.primary }} />
          <Typography variant="caption" sx={{ fontWeight: 600, color: theme.textPrimary }}>
            {problem.timeLimit}ms
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.75,
            px: 1.5,
            py: 0.75,
            borderRadius: '8px',
            bgcolor: isDark ? 'rgba(0, 206, 201, 0.08)' : 'rgba(0, 206, 201, 0.05)',
            border: '1px solid rgba(0, 206, 201, 0.15)',
          }}
        >
          <MemoryOutlinedIcon sx={{ fontSize: 16, color: '#00cec9' }} />
          <Typography variant="caption" sx={{ fontWeight: 600, color: theme.textPrimary }}>
            {problem.memoryLimit}MB
          </Typography>
        </Box>
      </Box>

      {/* Test Cases */}
      {problem.testCases && problem.testCases.length > 0 && (
        <Box>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 700,
              mb: 1.5,
              color: theme.textPrimary,
              fontSize: '0.85rem',
            }}
          >
            Test Cases ({problem.testCases.length})
          </Typography>
          <Stack spacing={2}>
            {problem.testCases.map((tc, idx) => (
              <Box
                key={idx}
                sx={{
                  borderRadius: '10px',
                  border: `1px solid ${theme.borderSecondary}`,
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    px: 1.5,
                    py: 0.75,
                    bgcolor: theme.bgTableHeader,
                    borderBottom: `1px solid ${theme.borderSecondary}`,
                  }}
                >
                  <Typography variant="caption" sx={{ fontWeight: 600, color: theme.textSecondary }}>
                    Case {idx + 1}
                  </Typography>
                </Box>
                <Box sx={{ p: 1.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: theme.primary, display: 'block', mb: 0.5 }}>
                    Input
                  </Typography>
                  <Box className="code-block" sx={{ mb: 1.5, fontSize: '0.8rem' }}>
                    {tc.input || '(empty)'}
                  </Box>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: '#00cec9', display: 'block', mb: 0.5 }}>
                    Expected Output
                  </Typography>
                  <Box className="code-block" sx={{ fontSize: '0.8rem' }}>
                    {isInterviewMode ? (
                      <span style={{ fontStyle: 'italic', color: 'var(--cm-text-secondary)' }}>
                        Hidden during Interview Mode
                      </span>
                    ) : (
                      tc.output || '(empty)'
                    )}
                  </Box>
                </Box>
              </Box>
            ))}
          </Stack>
        </Box>
      )}
    </Stack>
  );
};

export default ProblemDescription;
