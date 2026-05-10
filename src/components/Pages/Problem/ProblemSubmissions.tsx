import { Box, Chip, Stack, Typography, Collapse } from '@mui/material';
import { Submission, executionStatusColors, executionStatusLabels, ExecutionStatus } from '../../../utils/types';
import { usethemeUtils } from '../../../context/ThemeWrapper';
import { getThemeColors } from '../../../constants/uiColors';
import { useState } from 'react';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import MemoryOutlinedIcon from '@mui/icons-material/MemoryOutlined';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';

export default function ProblemSubmissions({ data }: { data: Submission[] }) {
  const { colorMode } = usethemeUtils();
  const isDark = colorMode === 'dark';
  const theme = getThemeColors(colorMode as 'dark' | 'light');
  const [expandedId, setExpandedId] = useState<string | number | null>(null);

  if (!data || data.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
        <Typography variant="body2" sx={{ color: theme.textTertiary }}>
          No submissions yet
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={1} sx={{ overflowY: 'auto', height: '100%', p: 1 }}>
      {data.map((sub, idx) => {
        const isAwaiting = sub.status === null;
        const status = sub.status as ExecutionStatus;
        const color = isAwaiting ? theme.textSecondary : (executionStatusColors[status] ?? theme.textSecondary);
        const label = isAwaiting ? 'Submitting' : (executionStatusLabels[status] ?? sub.status);
        const isSuccess = status === 'AC';
        const isExpanded = expandedId === (sub.id || idx);

        return (
          <Box
            key={sub.id || idx}
            onClick={() => setExpandedId(isExpanded ? null : (sub.id || idx))}
            className="animate-fade-in-up"
            sx={{
              p: 2,
              borderRadius: '10px',
              border: `1px solid ${theme.borderSecondary}`,
              bgcolor: theme.bgTableHeader,
              transition: 'all 0.2s ease',
              animationDelay: `${idx * 50}ms`,
              cursor: 'pointer',
              '&:hover': {
                bgcolor: isDark ? theme.bgHover : theme.bgTertiary,
                borderColor: `${color}40`,
              },
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  label={label}
                  size="small"
                  sx={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    bgcolor: `${color}18`,
                    color,
                    border: `1px solid ${color}30`,
                  }}
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="caption" sx={{ color: theme.textTertiary, display: 'block' }}>
                    {sub.createdAt ? new Date(sub.createdAt).toLocaleString(undefined, {
                      month: 'short', day: 'numeric', year: 'numeric',
                      hour: 'numeric', minute: '2-digit', second: '2-digit'
                    }) : '—'}
                  </Typography>
                </Box>
                {isExpanded ? (
                  <KeyboardArrowDownOutlinedIcon sx={{ fontSize: 20, color: theme.textSecondary }} />
                ) : (
                  <ChevronRightOutlinedIcon sx={{ fontSize: 20, color: theme.textSecondary }} />
                )}
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              {/* Language */}
              <Typography variant="caption" sx={{ fontWeight: 600, color: theme.textPrimary }}>
                {sub.language}
              </Typography>

              {/* Execution time */}
              {sub.executionTimeMs != null && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <AccessTimeOutlinedIcon sx={{ fontSize: 13, color: theme.primary }} />
                  <Typography variant="caption" sx={{ color: theme.textSecondary }}>
                    {sub.executionTimeMs}ms
                  </Typography>
                </Box>
              )}

              {/* Memory */}
              {sub.memoryUsedKb != null && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <MemoryOutlinedIcon sx={{ fontSize: 13, color: '#00cec9' }} />
                  <Typography variant="caption" sx={{ color: theme.textSecondary }}>
                    {sub.memoryUsedKb}KB
                  </Typography>
                </Box>
              )}

              {/* Test results summary */}
              {sub.testResults && sub.testResults.length > 0 && (
                <Typography variant="caption" sx={{ color: isSuccess ? '#00b894' : color }}>
                  {sub.testResults.filter((t) => t.passed).length}/{sub.testResults.length} passed
                </Typography>
              )}
            </Box>

            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {/* Stdout */}
                {sub.stdout && (
                  <Box>
                    <Typography variant="caption" sx={{ color: theme.textSecondary, fontWeight: 600 }}>Standard Output</Typography>
                    <Box
                      sx={{
                        p: 1.5,
                        mt: 0.5,
                        borderRadius: '6px',
                        bgcolor: theme.bgSelectOption,
                        border: `1px solid ${theme.borderSecondary}`,
                        maxHeight: '200px',
                        overflowY: 'auto',
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color: theme.textPrimary,
                          fontFamily: 'monospace',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                          fontSize: '0.75rem',
                        }}
                      >
                        {sub.stdout}
                      </Typography>
                    </Box>
                  </Box>
                )}

                {/* Stderr for errors */}
                {sub.stderr && (
                  <Box>
                    <Typography variant="caption" sx={{ color: theme.textSecondary, fontWeight: 600 }}>Standard Error</Typography>
                    <Box
                      sx={{
                        p: 1.5,
                        mt: 0.5,
                        borderRadius: '6px',
                        bgcolor: `${theme.danger}10`,
                        border: `1px solid ${theme.danger}40`,
                        maxHeight: '200px',
                        overflowY: 'auto',
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color: theme.danger,
                          fontFamily: 'monospace',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                          fontSize: '0.75rem',
                        }}
                      >
                        {sub.stderr}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            </Collapse>
          </Box>
        );
      })}
    </Stack>
  );
}
