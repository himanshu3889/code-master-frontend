import { Box, Chip, Stack, Typography, IconButton, Collapse, Button } from '@mui/material';
import { executionStatusColors, executionStatusLabels } from '../../../constants/statuses';
import { usethemeUtils } from '../../../context/ThemeWrapper';
import { getThemeColors } from '../../../constants/uiColors';
import { useState } from 'react';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import MemoryOutlinedIcon from '@mui/icons-material/MemoryOutlined';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';

export default function ProblemSubmissions({ data }: { data: Submission[] }) {
  const { colorMode } = usethemeUtils();
  const isDark = colorMode === 'dark';
  const theme = getThemeColors(colorMode as 'dark' | 'light');
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | number | null>(null);
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

  if (selectedSubmissionId !== null) {
    const sub = data.find((s, idx) => (s.id || idx) === selectedSubmissionId);
    if (sub) {
      const isAwaiting = sub.status === null;
      const status = sub.status as ExecutionStatus;
      const color = isAwaiting ? theme.textSecondary : (executionStatusColors[status] ?? theme.textSecondary);
      const label = isAwaiting ? 'Submitting' : (executionStatusLabels[status] ?? sub.status);

      return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: theme.textPrimary }}>
              Submission Details
            </Typography>
            <IconButton size="small" onClick={() => setSelectedSubmissionId(null)}>
              <CloseOutlinedIcon fontSize="small" sx={{ color: theme.textSecondary }} />
            </IconButton>
          </Box>

          <Box sx={{ flex: 1, overflowY: 'auto', pr: 1 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
              <Chip
                label={label}
                size="small"
                sx={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  bgcolor: `${color}18`,
                  color,
                  border: `1px solid ${color}30`,
                }}
              />
              <Typography variant="caption" sx={{ fontWeight: 600, color: theme.textPrimary }}>
                {sub.language}
              </Typography>
              {sub.executionTimeMs != null && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <AccessTimeOutlinedIcon sx={{ fontSize: 13, color: theme.primary }} />
                  <Typography variant="caption" sx={{ color: theme.textSecondary }}>
                    {sub.executionTimeMs}ms
                  </Typography>
                </Box>
              )}
              {sub.memoryUsedKb != null && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <MemoryOutlinedIcon sx={{ fontSize: 13, color: '#00cec9' }} />
                  <Typography variant="caption" sx={{ color: theme.textSecondary }}>
                    {sub.memoryUsedKb}KB
                  </Typography>
                </Box>
              )}
            </Box>

            <Typography variant="caption" sx={{ color: theme.textSecondary, fontWeight: 600, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em', mt: 2, display: 'block' }}>Code</Typography>
            <Box sx={{ p: 1.5, mt: 0.5, mb: 3, borderRadius: '6px', bgcolor: isDark ? '#1e1e1e' : '#f5f5f5', border: `1px solid ${theme.borderSecondary}`, overflowX: 'auto' }}>
              <pre style={{ margin: 0, color: isDark ? '#d4d4d4' : '#333', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                {(sub as any).code || sub.stdin || 'No code available'}
              </pre>
            </Box>

            <Typography variant="caption" sx={{ color: theme.textSecondary, fontWeight: 600, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', mb: 1 }}>Execution Results</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {sub.testResults && sub.testResults.length > 0 ? (
                sub.testResults.map((tr, i) => {
                  const isSingleLineStdout = tr.stdout && !tr.stdout.includes('\n') && tr.stdout.length < 100;
                  const isSingleLineStderr = tr.stderr && !tr.stderr.includes('\n') && tr.stderr.length < 100;

                  return (
                    <Box key={i} sx={{ border: `1px solid ${theme.borderSecondary}`, borderRadius: '8px', p: 1.5, bgcolor: theme.bgSecondary }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" sx={{ color: theme.textSecondary, fontWeight: 600 }}>
                          Case {tr.testIndex + 1}
                          <span style={{ color: tr.passed ? '#00b894' : theme.danger, marginLeft: '8px' }}>
                            {tr.passed ? 'Passed' : executionStatusLabels[tr.status] || 'Failed'}
                          </span>
                        </Typography>
                        <Typography variant="caption" sx={{ color: theme.textTertiary }}>
                          {tr.timeMs}ms • {tr.memoryBytes / 1000}KB
                        </Typography>
                      </Box>

                      {sub.testCases && sub.testCases[tr.testIndex] && (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="caption" sx={{ color: theme.textSecondary, fontWeight: 600, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Input</Typography>
                          {(() => {
                            const input = sub.testCases[tr.testIndex];
                            const isSingleLineInput = !input.includes('\n') && input.length < 100;
                            return isSingleLineInput ? (
                              <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: theme.textPrimary, fontFamily: 'monospace', p: 1, bgcolor: theme.bgTertiary, borderRadius: '6px', border: `1px solid ${theme.borderSecondary}` }}>
                                {input}
                              </Typography>
                            ) : (
                              <Box sx={{ p: 1.5, mt: 0.5, borderRadius: '6px', bgcolor: theme.bgTertiary, border: `1px solid ${theme.borderSecondary}`, maxHeight: '200px', overflowY: 'auto' }}>
                                <Typography variant="caption" sx={{ color: theme.textPrimary, fontFamily: 'monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '0.75rem' }}>
                                  {input}
                                </Typography>
                              </Box>
                            );
                          })()}
                        </Box>
                      )}

                      {tr.stdout && (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="caption" sx={{ color: theme.textSecondary, fontWeight: 600, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Output</Typography>
                          {isSingleLineStdout ? (
                            <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: theme.textPrimary, fontFamily: 'monospace', p: 1, bgcolor: theme.bgTertiary, borderRadius: '6px', border: `1px solid ${theme.borderSecondary}` }}>
                              {tr.stdout}
                            </Typography>
                          ) : (
                            <Box sx={{ p: 1.5, mt: 0.5, borderRadius: '6px', bgcolor: theme.bgTertiary, border: `1px solid ${theme.borderSecondary}`, maxHeight: '200px', overflowY: 'auto' }}>
                              <Typography variant="caption" sx={{ color: theme.textPrimary, fontFamily: 'monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '0.75rem' }}>
                                {tr.stdout}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      )}

                      {tr.stderr && (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="caption" sx={{ color: theme.textSecondary, fontWeight: 600, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Error</Typography>
                          {isSingleLineStderr ? (
                            <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: theme.danger, fontFamily: 'monospace', p: 1, bgcolor: `${theme.danger}10`, borderRadius: '4px' }}>
                              {tr.stderr}
                            </Typography>
                          ) : (
                            <Box sx={{ p: 1.5, mt: 0.5, borderRadius: '6px', bgcolor: `${theme.danger}10`, border: `1px solid ${theme.danger}40`, maxHeight: '200px', overflowY: 'auto' }}>
                              <Typography variant="caption" sx={{ color: theme.danger, fontFamily: 'monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '0.75rem' }}>
                                {tr.stderr}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      )}
                    </Box>
                  );
                })
              ) : (
                <>
                  {sub.stdout && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="caption" sx={{ color: theme.textSecondary, fontWeight: 600, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Standard Output</Typography>
                      <Box sx={{ p: 1.5, mt: 0.5, borderRadius: '6px', bgcolor: theme.bgSecondary, border: `1px solid ${theme.borderSecondary}`, maxHeight: '200px', overflowY: 'auto' }}>
                        <Typography variant="caption" sx={{ color: theme.textPrimary, fontFamily: 'monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '0.75rem' }}>
                          {sub.stdout}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  {sub.stderr && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="caption" sx={{ color: theme.textSecondary, fontWeight: 600, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Standard Error</Typography>
                      <Box sx={{ p: 1.5, mt: 0.5, borderRadius: '6px', bgcolor: `${theme.danger}10`, border: `1px solid ${theme.danger}40`, maxHeight: '200px', overflowY: 'auto' }}>
                        <Typography variant="caption" sx={{ color: theme.danger, fontFamily: 'monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '0.75rem' }}>
                          {sub.stderr}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </>
              )}
            </Box>
          </Box>
        </Box>
      );
    }
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
                <Button
                  size="small"
                  variant="outlined"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSubmissionId(sub.id || idx);
                  }}
                  startIcon={<CodeOutlinedIcon />}
                  sx={{
                    fontSize: '0.65rem',
                    padding: '0px 6px',
                    color: theme.textSecondary,
                    borderColor: theme.borderSecondary,
                    textTransform: 'none',
                    minWidth: 0,
                    '&:hover': {
                      bgcolor: isDark ? '#333' : '#e0e0e0',
                      color: theme.textPrimary,
                    }
                  }}
                >
                  Code
                </Button>
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
              <Typography variant="caption" sx={{ fontWeight: 600, color: theme.textPrimary }}>
                {sub.language}
              </Typography>

              {sub.executionTimeMs != null && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <AccessTimeOutlinedIcon sx={{ fontSize: 13, color: theme.primary }} />
                  <Typography variant="caption" sx={{ color: theme.textSecondary }}>
                    {sub.executionTimeMs}ms
                  </Typography>
                </Box>
              )}

              {sub.memoryUsedKb != null && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <MemoryOutlinedIcon sx={{ fontSize: 13, color: '#00cec9' }} />
                  <Typography variant="caption" sx={{ color: theme.textSecondary }}>
                    {sub.memoryUsedKb}KB
                  </Typography>
                </Box>
              )}

              {sub.testResults && sub.testResults.length > 0 && (
                <Typography variant="caption" sx={{ color: isSuccess ? '#00b894' : color }}>
                  {sub.testResults.filter((t) => t.passed).length}/{sub.testResults.length} passed
                </Typography>
              )}
            </Box>

            {sub.testResults && sub.testResults.length === 1 && sub.testResults[0].stdout && !sub.testResults[0].stdout.includes('\n') && sub.testResults[0].stdout.length < 100 && (
              <Box sx={{ mt: 0.5, px: 0.5 }}>
                <Typography variant="caption" sx={{ color: theme.textSecondary, fontFamily: 'monospace' }}>
                  ↳ Output: <span style={{ color: theme.textPrimary }}>{sub.testResults[0].stdout}</span>
                </Typography>
              </Box>
            )}

            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }} onClick={(e) => e.stopPropagation()}>
                {sub.testResults && sub.testResults.length > 0 ? (
                  sub.testResults.map((tr, i) => {
                    const isSingleLineStdout = tr.stdout && !tr.stdout.includes('\n') && tr.stdout.length < 100;
                    const isSingleLineStderr = tr.stderr && !tr.stderr.includes('\n') && tr.stderr.length < 100;

                    return (
                      <Box key={i} sx={{ borderTop: i > 0 ? `1px solid ${theme.borderSecondary}` : 'none', pt: i > 0 ? 1.5 : 0 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="caption" sx={{ color: theme.textSecondary, fontWeight: 600 }}>
                            Case {tr.testIndex + 1}
                            <span style={{ color: tr.passed ? '#00b894' : theme.danger, marginLeft: '8px' }}>
                              {tr.passed ? 'Passed' : executionStatusLabels[tr.status] || 'Failed'}
                            </span>
                          </Typography>
                          <Typography variant="caption" sx={{ color: theme.textTertiary }}>
                            {tr.timeMs}ms • {tr.memoryBytes / 1000}KB
                          </Typography>
                        </Box>

                        {sub.testCases && sub.testCases[tr.testIndex] && (
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="caption" sx={{ color: theme.textSecondary, fontWeight: 600, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Input</Typography>
                            {(() => {
                              const input = sub.testCases[tr.testIndex];
                              const isSingleLineInput = !input.includes('\n') && input.length < 100;
                              return isSingleLineInput ? (
                                <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: theme.textPrimary, fontFamily: 'monospace', p: 1, bgcolor: theme.bgSecondary, borderRadius: '6px', border: `1px solid ${theme.borderSecondary}` }}>
                                  {input}
                                </Typography>
                              ) : (
                                <Box sx={{ p: 1.5, mt: 0.5, borderRadius: '6px', bgcolor: theme.bgSecondary, border: `1px solid ${theme.borderSecondary}`, maxHeight: '200px', overflowY: 'auto' }}>
                                  <Typography variant="caption" sx={{ color: theme.textPrimary, fontFamily: 'monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '0.75rem' }}>
                                    {input}
                                  </Typography>
                                </Box>
                              );
                            })()}
                          </Box>
                        )}

                        {tr.stdout && (
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="caption" sx={{ color: theme.textSecondary, fontWeight: 600, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Output</Typography>
                            {isSingleLineStdout ? (
                              <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: theme.textPrimary, fontFamily: 'monospace', p: 1, bgcolor: theme.bgSecondary, borderRadius: '6px', border: `1px solid ${theme.borderSecondary}` }}>
                                {tr.stdout}
                              </Typography>
                            ) : (
                              <Box sx={{ p: 1.5, mt: 0.5, borderRadius: '6px', bgcolor: theme.bgSecondary, border: `1px solid ${theme.borderSecondary}`, maxHeight: '200px', overflowY: 'auto' }}>
                                <Typography variant="caption" sx={{ color: theme.textPrimary, fontFamily: 'monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '0.75rem' }}>
                                  {tr.stdout}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        )}

                        {tr.stderr && (
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="caption" sx={{ color: theme.textSecondary, fontWeight: 600, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Error</Typography>
                            {isSingleLineStderr ? (
                              <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: theme.danger, fontFamily: 'monospace', p: 1, bgcolor: `${theme.danger}10`, borderRadius: '4px' }}>
                                {tr.stderr}
                              </Typography>
                            ) : (
                              <Box sx={{ p: 1.5, mt: 0.5, borderRadius: '6px', bgcolor: `${theme.danger}10`, border: `1px solid ${theme.danger}40`, maxHeight: '200px', overflowY: 'auto' }}>
                                <Typography variant="caption" sx={{ color: theme.danger, fontFamily: 'monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '0.75rem' }}>
                                  {tr.stderr}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        )}
                      </Box>
                    );
                  })
                ) : (
                  <>
                    {sub.stdin && (
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="caption" sx={{ color: theme.textSecondary, fontWeight: 600, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Standard Input</Typography>
                        <Box sx={{ p: 1.5, mt: 0.5, borderRadius: '6px', bgcolor: theme.bgSecondary, border: `1px solid ${theme.borderSecondary}`, maxHeight: '200px', overflowY: 'auto' }}>
                          <Typography variant="caption" sx={{ color: theme.textPrimary, fontFamily: 'monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '0.75rem' }}>
                            {sub.stdin}
                          </Typography>
                        </Box>
                      </Box>
                    )}

                    {sub.stdout && (
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="caption" sx={{ color: theme.textSecondary, fontWeight: 600, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Standard Output</Typography>
                        <Box sx={{ p: 1.5, mt: 0.5, borderRadius: '6px', bgcolor: theme.bgSecondary, border: `1px solid ${theme.borderSecondary}`, maxHeight: '200px', overflowY: 'auto' }}>
                          <Typography variant="caption" sx={{ color: theme.textPrimary, fontFamily: 'monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '0.75rem' }}>
                            {sub.stdout}
                          </Typography>
                        </Box>
                      </Box>
                    )}

                    {sub.stderr && (
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="caption" sx={{ color: theme.textSecondary, fontWeight: 600, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Standard Error</Typography>
                        <Box sx={{ p: 1.5, mt: 0.5, borderRadius: '6px', bgcolor: `${theme.danger}10`, border: `1px solid ${theme.danger}40`, maxHeight: '200px', overflowY: 'auto' }}>
                          <Typography variant="caption" sx={{ color: theme.danger, fontFamily: 'monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '0.75rem' }}>
                            {sub.stderr}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </>
                )}
              </Box>
            </Collapse>
          </Box>
        );
      })}
    </Stack>
  );
}
