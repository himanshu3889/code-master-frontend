import { Box, Button, IconButton } from '@mui/material';
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
}: ProblemEditorHeaderProps) {
  const { colorMode } = usethemeUtils();
  const theme = getThemeColors(colorMode as 'dark' | 'light');

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
          disabled={isSubmitting}
          sx={{
            bgcolor: 'var(--cm-primary)',
            color: '#fff',
            textTransform: 'none',
            boxShadow: 'none',
            '&:hover': { bgcolor: 'var(--cm-primary-hover)', boxShadow: 'none' }
          }}
        >
          {isSubmitting ? 'Running...' : 'Run'}
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
    </div>
  );
}
