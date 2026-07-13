import { useState } from 'react';
import { Box, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SettingsOverscanOutlinedIcon from '@mui/icons-material/SettingsOverscanOutlined';
import CloseFullscreenOutlinedIcon from '@mui/icons-material/CloseFullscreenOutlined';
import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import OpenInFullOutlinedIcon from '@mui/icons-material/OpenInFullOutlined';
import { usethemeUtils } from '../../../context/ThemeWrapper';
import { getThemeColors } from '../../../constants/uiColors';

interface ProblemEditorHeaderProps {
  language: string;
  languages: { code: string; name: string }[] | undefined;
  onLanguageChange: (lang: string) => void;
  isPlainMode: boolean;
  onTogglePlainMode: () => void;
  hasUnsavedChanges: boolean;
  onSave: () => void;
  isSubmitting: boolean;
  onSubmit: () => void;
  isFullScreenEnabled: boolean;
  onToggleFullScreen: () => void;
  isLeftPanelExpanded: boolean;
  onToggleLeftPanelExpansion: () => void;
  shrinkLeftPanel: boolean;
  onShrinkLeftHandler: () => void;
  panelBorder: string;
  sessions: InterviewSession[];
  selectedSessionId: string | null;
  onSelectSession: (sessionId: string | null) => void;
  onStartNewInterview: () => void;
  onEndSession: () => void;
  remainingSeconds: number;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function ProblemEditorHeader({
  language,
  languages,
  onLanguageChange,
  isPlainMode,
  onTogglePlainMode,
  hasUnsavedChanges,
  onSave,
  isSubmitting,
  onSubmit,
  isFullScreenEnabled,
  onToggleFullScreen,
  isLeftPanelExpanded,
  onToggleLeftPanelExpansion,
  shrinkLeftPanel,
  onShrinkLeftHandler,
  panelBorder,
  sessions,
  selectedSessionId,
  onSelectSession,
  onStartNewInterview,
  onEndSession,
  remainingSeconds,
}: ProblemEditorHeaderProps) {
  const { colorMode } = usethemeUtils();
  const theme = getThemeColors(colorMode as 'dark' | 'light');
  const [isStartDialogOpen, setIsStartDialogOpen] = useState(false);

  return (
    <div
      className="tw-pb-2 tw-flex tw-justify-between tw-items-center tw-shrink-0"
      style={{ borderBottom: `1px solid ${panelBorder}` }}
    >
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <select
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
          disabled={!languages || languages.length === 0}
          style={{
            background: theme.bgSecondary,
            color: theme.textPrimary,
            border: `1px solid ${panelBorder}`,
            borderRadius: '8px',
            padding: '4px 12px',
            fontSize: '0.8rem',
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          {languages ? (
            languages.map((lang) => (
              <option
                key={lang.code}
                value={lang.code}
                style={{
                  background: theme.bgSelectOption,
                  color: theme.textPrimary
                }}
              >
                {lang.name}
              </option>
            ))
          ) : (
            <option
              value={language}
              style={{
                background: theme.bgSelectOption,
                color: theme.textPrimary
              }}
            >Loading...</option>
          )}
        </select>
        <Button
          variant="outlined"
          onClick={onTogglePlainMode}
          sx={{
            textTransform: 'none',
            fontSize: '0.75rem',
            padding: '2px 8px',
            borderColor: panelBorder,
            color: isPlainMode ? theme.danger : theme.textPrimary,
            '&:hover': { borderColor: isPlainMode ? theme.dangerHover : theme.borderPlainModeHover },
          }}
        >
          {isPlainMode ? 'Plain Mode: ON' : 'Plain Mode: OFF'}
        </Button>
        <select
          value={selectedSessionId ?? ''}
          onChange={(e) => onSelectSession(e.target.value || null)}
          style={{
            background: theme.bgSecondary,
            color: theme.textPrimary,
            border: `1px solid ${panelBorder}`,
            borderRadius: '8px',
            padding: '4px 12px',
            fontSize: '0.8rem',
            outline: 'none',
            cursor: 'pointer',
            maxWidth: '220px',
          }}
        >
          <option value="" style={{ background: theme.bgSelectOption, color: theme.textPrimary }}>Practice</option>
          {sessions.length > 0 && <option disabled style={{ background: theme.bgSelectOption, color: theme.textPrimary }}>──────────</option>}
          {sessions.map((s, idx) => (
            <option key={s.id} value={s.id} style={{ background: theme.bgSelectOption, color: theme.textPrimary }}>
              {sessions.length - idx}. {new Date(s.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })} ({s.status === 'IN_PROGRESS' ? 'Active' : s.status.replace('_', ' ')})
            </option>
          ))}
          {sessions.length > 0 && <option disabled style={{ background: theme.bgSelectOption, color: theme.textPrimary }}>──────────</option>}
        </select>
        <IconButton
          size="small"
          onClick={() => setIsStartDialogOpen(true)}
          title="Start New Interview"
          sx={{ color: theme.textSecondary, '&:hover': { color: 'var(--cm-primary)' } }}
        >
          <AddIcon fontSize="small" />
        </IconButton>
        {selectedSessionId && sessions.find((s) => s.id === selectedSessionId)?.status === 'IN_PROGRESS' && (
          <>
            <Box
              sx={{
                px: 1.5,
                py: 0.5,
                borderRadius: '6px',
                fontWeight: 700,
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                color: remainingSeconds < 300 ? '#fff' : theme.textPrimary,
                bgcolor: remainingSeconds < 300 ? 'var(--cm-danger)' : theme.bgSecondary,
                border: `1px solid ${remainingSeconds < 300 ? 'var(--cm-danger)' : panelBorder}`,
              }}
            >
              {formatTime(remainingSeconds)}
            </Box>
            <Button
              variant="outlined"
              size="small"
              onClick={onEndSession}
              sx={{
                textTransform: 'none',
                fontSize: '0.75rem',
                padding: '2px 10px',
                borderColor: 'var(--cm-danger)',
                color: 'var(--cm-danger)',
                '&:hover': { borderColor: 'var(--cm-danger-hover)', bgcolor: 'rgba(231, 76, 60, 0.08)' },
              }}
            >
              End
            </Button>
          </>
        )}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {hasUnsavedChanges && (
          <Button
            variant="contained"
            size="small"
            startIcon={<SaveOutlinedIcon />}
            onClick={onSave}
            sx={{
              bgcolor: theme.bgSecondary,
              color: theme.textPrimary,
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': { bgcolor: theme.bgHover, boxShadow: 'none' }
            }}
          >
            Save
          </Button>
        )}
        <Button
          variant="contained"
          size="small"
          startIcon={<PlayArrowIcon />}
          onClick={onSubmit}
          disabled={isSubmitting || (!!selectedSessionId && sessions.find((s) => s.id === selectedSessionId)?.status !== 'IN_PROGRESS')}
          sx={{
            bgcolor: (selectedSessionId && sessions.find((s) => s.id === selectedSessionId)?.status !== 'IN_PROGRESS') ? 'var(--cm-danger)' : 'var(--cm-primary)',
            color: '#fff',
            textTransform: 'none',
            boxShadow: 'none',
            '&:hover': {
              bgcolor: (selectedSessionId && sessions.find((s) => s.id === selectedSessionId)?.status !== 'IN_PROGRESS')
                ? 'var(--cm-danger-hover)'
                : 'var(--cm-primary-hover)',
              boxShadow: 'none',
            },
          }}
        >
          {(selectedSessionId && sessions.find((s) => s.id === selectedSessionId)?.status !== 'IN_PROGRESS')
            ? 'Review'
            : isSubmitting
              ? 'Running...'
              : 'Run'}
        </Button>

        <IconButton onClick={onToggleFullScreen} size="small" sx={{ color: theme.textSecondary }}>
          {isFullScreenEnabled ? (
            <CloseFullscreenOutlinedIcon titleAccess="Exit FullScreen" fontSize="small" />
          ) : (
            <OpenInFullOutlinedIcon titleAccess="FullScreen" fontSize="small" />
          )}
        </IconButton>

        <div className="tw-w-[1px] tw-h-4 tw-bg-gray-500 tw-opacity-30 tw-mx-0.5"></div>

        <IconButton onClick={onToggleLeftPanelExpansion} size="small" sx={{ color: theme.textSecondary }}>
          {!isLeftPanelExpanded ? (
            <SettingsOverscanOutlinedIcon titleAccess="Maximise" fontSize="small" />
          ) : (
            <CloseFullscreenOutlinedIcon titleAccess="Minimise" fontSize="small" />
          )}
        </IconButton>
        {!isLeftPanelExpanded && (
          <IconButton onClick={onShrinkLeftHandler} size="small" sx={{ color: theme.textSecondary }}>
            {!shrinkLeftPanel ? (
              <ChevronLeftOutlinedIcon titleAccess="Fold" fontSize="small" />
            ) : (
              <ChevronRightOutlinedIcon titleAccess="UnFold" fontSize="small" />
            )}
          </IconButton>
        )}
      </Box>

      <Dialog
        open={isStartDialogOpen}
        onClose={() => setIsStartDialogOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: colorMode === 'dark' ? '#1e293b' : '#ffffff',
            backgroundImage: 'none',
            color: theme.textPrimary,
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          },
        }}
      >
        <DialogTitle sx={{ borderBottom: `1px solid ${panelBorder}`, pb: 2 }}>
          <Typography variant="h6" fontWeight={700}>
            Start New Interview?
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Typography variant="body1" sx={{ color: theme.textSecondary }}>
            Are you sure you want to start a new interview session? This will give you a 45-minute timed session to solve the problem.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: `1px solid ${panelBorder}`, gap: 1 }}>
          <Button
            onClick={() => setIsStartDialogOpen(false)}
            sx={{ color: theme.textSecondary, textTransform: 'none', flex: 1 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setIsStartDialogOpen(false);
              onStartNewInterview();
            }}
            sx={{
              bgcolor: 'var(--cm-primary)',
              color: '#fff',
              textTransform: 'none',
              flex: 1,
              fontWeight: 600,
              '&:hover': { bgcolor: 'var(--cm-primary-hover)' },
            }}
          >
            Start Interview
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
