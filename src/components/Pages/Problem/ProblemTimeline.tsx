import { Box, Stack, Typography, Chip } from '@mui/material';
import { executionStatusColors, executionStatusLabels } from '../../../constants/statuses';
import { usethemeUtils } from '../../../context/ThemeWrapper';
import { getThemeColors } from '../../../constants/uiColors';
import { formatDate } from '../../../utils/helpers';
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';

export default function ProblemTimeline({ data }: { data: DetailedTimeline[] }) {
  const { colorMode } = usethemeUtils();
  const isDark = colorMode === 'dark';
  const theme = getThemeColors(colorMode as 'dark' | 'light');

  if (!data || data.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
        <Typography variant="body2" sx={{ color: theme.textTertiary }}>
          No activity yet
        </Typography>
      </Box>
    );
  }

  return (
    <Stack sx={{ overflowY: 'auto', maxHeight: '72dvh', p: 2 }}>
      {data.map((entry, idx) => {
        const isSnapshot = entry.codeSnapshotId != null;
        const isSubmission = entry.submissionId != null;
        const status = entry.submissionStatus as ExecutionStatus | undefined;
        const statusColor = status ? executionStatusColors[status] ?? theme.textSecondary : theme.primary;
        const statusLabel = status ? executionStatusLabels[status] ?? entry.submissionStatus : '';

        let dotClass = 'snapshot';
        if (isSubmission && status === 'AC') dotClass = 'submission-success';
        else if (isSubmission) dotClass = 'submission-error';

        return (
          <Box
            key={entry.timelineId || idx}
            className={`timeline-entry ${dotClass}`}
            sx={{ animationDelay: `${idx * 60}ms` }}
          >
            {/* Timestamp */}
            <Typography
              variant="caption"
              sx={{ color: theme.textSecondary, display: 'block', mb: 0.5, fontSize: '0.7rem' }}
            >
              {formatDate(entry.timelineCreatedAt)}
            </Typography>

            {/* Entry card */}
            <Box
              sx={{
                p: 1.5,
                borderRadius: '10px',
                border: `1px solid ${theme.borderSecondary}`,
                bgcolor: theme.bgTableHeader,
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: isDark ? theme.bgHover : theme.bgTertiary,
                },
              }}
            >
              {/* Snapshot info */}
              {isSnapshot && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: isSubmission ? 1 : 0 }}>
                  <CodeOutlinedIcon sx={{ fontSize: 14, color: '#00cec9' }} />
                  <Typography variant="caption" sx={{ fontWeight: 600, color: '#00cec9' }}>
                    Code Snapshot
                  </Typography>
                  {entry.snapshotLanguage && (
                    <Chip
                      label={entry.snapshotLanguage}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.65rem',
                        bgcolor: 'rgba(0, 206, 201, 0.1)',
                        color: '#00cec9',
                      }}
                    />
                  )}
                </Box>
              )}

              {/* Code preview */}
              {isSnapshot && entry.code && (
                <Box
                  className="code-block"
                  sx={{
                    fontSize: '0.75rem',
                    maxHeight: 80,
                    overflow: 'hidden',
                    mb: isSubmission ? 1.5 : 0,
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 24,
                      background: isDark
                        ? `linear-gradient(transparent, ${theme.bgSelectOption})`
                        : 'linear-gradient(transparent, rgba(255,255,255,0.8))',
                    },
                  }}
                >
                  {entry.code.slice(0, 300)}
                </Box>
              )}

              {/* Submission info */}
              {isSubmission && (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <PlayArrowOutlinedIcon sx={{ fontSize: 14, color: statusColor }} />
                    <Typography variant="caption" sx={{ fontWeight: 600, color: statusColor }}>
                      Submission
                    </Typography>
                    <Chip
                      label={statusLabel}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        bgcolor: `${statusColor}18`,
                        color: statusColor,
                        border: `1px solid ${statusColor}30`,
                      }}
                    />
                  </Box>

                  {/* Metrics */}
                  <Box sx={{ display: 'flex', gap: 1.5, mt: 0.5 }}>
                    {entry.executionTimeMs != null && (
                      <Typography variant="caption" sx={{ color: theme.textSecondary }}>
                        ⏱ {entry.executionTimeMs}ms
                      </Typography>
                    )}
                    {entry.memoryUsedKb != null && (
                      <Typography variant="caption" sx={{ color: theme.textSecondary }}>
                        💾 {entry.memoryUsedKb}KB
                      </Typography>
                    )}
                  </Box>

                  {/* Stderr */}
                  {entry.stderr && (
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'block',
                        mt: 0.5,
                        p: 0.75,
                        borderRadius: '6px',
                        bgcolor: `${theme.danger}10`,
                        color: theme.danger,
                        fontFamily: 'monospace',
                        fontSize: '0.65rem',
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {entry.stderr.slice(0, 200)}
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          </Box>
        );
      })}
    </Stack>
  );
}
