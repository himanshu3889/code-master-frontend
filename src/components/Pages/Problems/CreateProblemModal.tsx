import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Chip,
  Autocomplete,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { usethemeUtils } from '../../../context/ThemeWrapper';
import { getThemeColors } from '../../../constants/uiColors';
import { createProblem, getAllTags } from '../../../services/codeMasterApi';
import { Problem, ProblemDifficultyLevel, problemDifficultyLabels } from '../../../constants/statuses';

interface CreateProblemModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (newProblem: Problem) => void;
}

export default function CreateProblemModal({
  open,
  onClose,
  onSuccess,
}: CreateProblemModalProps) {
  const { colorMode } = usethemeUtils();
  const isDark = colorMode === 'dark';
  const theme = getThemeColors(colorMode as 'dark' | 'light');

  const [formData, setFormData] = useState({
    name: '',
    group: '',
    url: '',
    timeLimit: 2000,
    memoryLimit: 256,
    description: '',
    difficulty: ProblemDifficultyLevel.MEDIUM,
    rating: 0,
    notes: '',
    tags: [] as string[],
  });
  const [testCases, setTestCases] = useState<TestCase[]>([{ input: '', output: '' }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      getAllTags().then(tags => setAvailableTags(tags || [])).catch(console.error);
    }
  }, [open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value as string }));
  };

  const handleTestCaseChange = (index: number, field: 'input' | 'output', value: string) => {
    const newTestCases = [...testCases];
    newTestCases[index][field] = value;
    setTestCases(newTestCases);
  };

  const addTestCase = () => {
    setTestCases([...testCases, { input: '', output: '' }]);
  };

  const removeTestCase = (index: number) => {
    setTestCases(testCases.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!formData.name.trim()) {
      setError('Problem name is required');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        group: formData.group || 'Custom',
        url: formData.url,
        timeLimit: Number(formData.timeLimit) || 2000,
        memoryLimit: Number(formData.memoryLimit) || 256,
        description: formData.description || 'Custom problem created manually.',
        difficultyLevel: formData.difficulty,
        rating: Number(formData.rating) || 0,
        notes: formData.notes,
        tags: formData.tags,
        testCases: testCases.filter(tc => tc.input.trim() || tc.output.trim()),
      };
      const newProblem = await createProblem(payload);
      onSuccess(newProblem);
      setFormData({
        name: '', group: '', url: '', timeLimit: 2000, memoryLimit: 256,
        description: '', difficulty: ProblemDifficultyLevel.MEDIUM, rating: 0, notes: '', tags: []
      });
      setTestCases([{ input: '', output: '' }]);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create problem');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: theme.bgSelectOption,
          color: theme.textPrimary,
          borderRadius: '16px',
          boxShadow: isDark
            ? '0 24px 48px rgba(0, 0, 0, 0.4)'
            : '0 24px 48px rgba(0, 0, 0, 0.1)',
          backgroundImage: 'none',
        },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 3,
          pb: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          borderBottom: `1px solid ${theme.borderSecondary}`,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 36,
            height: 36,
            borderRadius: '10px',
            background: 'var(--cm-gradient-primary)',
            color: '#fff',
          }}
        >
          <AddCircleOutlineIcon fontSize="small" />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Create New Problem
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 16,
            top: 20,
            color: theme.textSecondary,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ p: 3, pt: 3 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
            {/* Left Column: Details */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TextField
                label="Problem Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
                placeholder="e.g. Two Sum"
                variant="outlined"
                sx={{ ...textFieldStyles(theme) }}
              />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Group / Contest"
                  name="group"
                  value={formData.group}
                  onChange={handleChange}
                  fullWidth
                  placeholder="e.g. LeetCode"
                  variant="outlined"
                  sx={{ ...textFieldStyles(theme) }}
                />
                <FormControl fullWidth sx={{ ...selectStyles(theme) }}>
                  <InputLabel id="difficulty-label">Difficulty</InputLabel>
                  <Select
                    labelId="difficulty-label"
                    name="difficulty"
                    value={formData.difficulty}
                    label="Difficulty"
                    onChange={handleSelectChange}
                  >
                    {Object.values(ProblemDifficultyLevel).map((diff) => (
                      <MenuItem key={diff} value={diff}>{problemDifficultyLabels[diff as ProblemDifficultyLevel]}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <TextField
                label="Original URL"
                name="url"
                value={formData.url}
                onChange={handleChange}
                fullWidth
                placeholder="https://..."
                variant="outlined"
                sx={{ ...textFieldStyles(theme) }}
              />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Time Limit (ms)"
                  name="timeLimit"
                  type="number"
                  value={formData.timeLimit}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  sx={{ ...textFieldStyles(theme) }}
                />
                <TextField
                  label="Memory Limit (MB)"
                  name="memoryLimit"
                  type="number"
                  value={formData.memoryLimit}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  sx={{ ...textFieldStyles(theme) }}
                />
                <TextField
                  label="Rating"
                  name="rating"
                  type="number"
                  value={formData.rating}
                  onChange={handleChange}
                  fullWidth
                  placeholder="e.g. 1500"
                  variant="outlined"
                  sx={{ ...textFieldStyles(theme) }}
                />
              </Box>
              <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={4}
                placeholder="Problem description (Markdown supported)..."
                variant="outlined"
                sx={{ ...textFieldStyles(theme) }}
              />
              <Autocomplete
                multiple
                options={availableTags}
                value={formData.tags}
                onChange={(_, newValue) => {
                  setFormData((prev) => ({ ...prev, tags: newValue }));
                }}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip variant="outlined" label={option} size="small" {...getTagProps({ index })} />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Tags"
                    placeholder="Select tags..."
                    sx={{ ...textFieldStyles(theme) }}
                  />
                )}
              />
              <TextField
                label="Notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                fullWidth
                multiline
                rows={2}
                placeholder="Personal notes..."
                variant="outlined"
                sx={{ ...textFieldStyles(theme) }}
              />


            </Box>

            {/* Right Column: Test Cases */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Test Cases
                </Typography>
                <Button
                  size="small"
                  onClick={addTestCase}
                  startIcon={<AddCircleOutlineIcon />}
                  sx={{
                    color: theme.primary,
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Add Test Case
                </Button>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  maxHeight: '520px',
                  overflowY: 'auto',
                  pr: 1,
                  '&::-webkit-scrollbar': {
                    width: '6px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: theme.borderPrimary,
                    borderRadius: '10px',
                  },
                }}
              >
                {testCases.map((tc, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: 2,
                      borderRadius: '12px',
                      border: `1px solid ${theme.borderPrimary}`,
                      bgcolor: theme.bgTableHeader,
                      position: 'relative',
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                      <Typography variant="caption" sx={{ color: theme.textSecondary, fontWeight: 600 }}>
                        TEST CASE #{index + 1}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => removeTestCase(index)}
                        sx={{ color: theme.danger, p: 0 }}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      <TextField
                        label="Input"
                        value={tc.input}
                        onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                        fullWidth
                        multiline
                        rows={2}
                        variant="outlined"
                        sx={{ ...textFieldStyles(theme) }}
                        placeholder="e.g. 1 2\n3 4"
                      />
                      <TextField
                        label="Expected Output"
                        value={tc.output}
                        onChange={(e) => handleTestCaseChange(index, 'output', e.target.value)}
                        fullWidth
                        multiline
                        rows={2}
                        variant="outlined"
                        sx={{ ...textFieldStyles(theme) }}
                        placeholder="e.g. 5\n7"
                      />
                    </Box>
                  </Box>
                ))}
                {testCases.length === 0 && (
                  <Typography variant="body2" sx={{ color: theme.textTertiary, textAlign: 'center', py: 4 }}>
                    No test cases added. Click "Add Test Case" to create one.
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>

          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </DialogContent>
        <DialogActions
          sx={{
            p: 3,
            pt: 2,
            borderTop: `1px solid ${theme.borderSecondary}`,
          }}
        >
          <Button
            onClick={onClose}
            disabled={loading}
            sx={{
              color: theme.textSecondary,
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                bgcolor: theme.bgHover,
              },
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              px: 4,
              background: 'var(--cm-gradient-primary)',
              boxShadow: '0 4px 14px rgba(108, 92, 231, 0.4)',
              '&:hover': {
                background: 'var(--cm-gradient-primary)',
                filter: 'brightness(1.1)',
                boxShadow: '0 6px 20px rgba(108, 92, 231, 0.6)',
              },
            }}
          >
            {loading ? 'Creating...' : 'Create Problem'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

const textFieldStyles = (theme: any) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    bgcolor: theme.bgQuaternary,
    color: theme.textPrimary,
    '& fieldset': {
      borderColor: theme.borderPrimary,
    },
    '&:hover fieldset': {
      borderColor: theme.borderHover,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.primary,
    },
  },
  '& .MuiInputLabel-root': {
    color: theme.textSecondary,
    '&.Mui-focused': {
      color: theme.primary,
    },
  },
});

const selectStyles = (theme: any) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    bgcolor: theme.bgQuaternary,
    color: theme.textPrimary,
    '& fieldset': {
      borderColor: theme.borderPrimary,
    },
    '&:hover fieldset': {
      borderColor: theme.borderHover,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.primary,
    },
  },
  '& .MuiInputLabel-root': {
    color: theme.textSecondary,
    '&.Mui-focused': {
      color: theme.primary,
    },
  },
  '& .MuiSelect-icon': {
    color: theme.textSecondary,
  },
  '& .MuiMenuItem-root': {
    color: theme.textPrimary,
  }
});
