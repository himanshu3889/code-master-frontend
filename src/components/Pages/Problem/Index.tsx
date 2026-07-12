import { useParams } from 'react-router';
import { Monaco } from '@monaco-editor/react';
import * as monaco from '@monaco-editor/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSocket } from '../../../context/SocketContext';
import { toast } from 'sonner';
import { createSubmission } from '../../../services/codeMasterApi';
import {
  Backdrop,
  Box,
  CircularProgress,
  IconButton,
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import Layout from '../../UI/Layout';
import { usethemeUtils } from '../../../context/ThemeWrapper';
import { darktheme, lighttheme } from '../../../constants/Index';
import CodeEditor from './CodeEditor';
import ProblemEditorHeader from './ProblemEditorHeader';
import CustomTabs from '../../UI/CustomTabs';
import CustomTabPanel from '../../UI/TabPanel';
import ProblemDescription from './ProblemInfo';
import ProblemSubmissions from './ProblemSubmissions';
import ProblemNotes from './ProblemNotes';
import useResizePanel from '../../../hooks/useResizePanel';
import useShrinkState from '../../../hooks/useShrinkState';
import SettingsOverscanOutlinedIcon from '@mui/icons-material/SettingsOverscanOutlined';
import CloseFullscreenOutlinedIcon from '@mui/icons-material/CloseFullscreenOutlined';
import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import useFullScreen from '../../../hooks/useFullScreen';
import { getGridColumnStyles, getGridTemplateColumns } from '../../../utils/helpers';
import { getProblem, getProblemWithSubmissions, getLanguages } from '../../../services/codeMasterApi';
import { getThemeColors } from '../../../constants/uiColors';
import RunTestcasesDialog from './RunTestcasesDialog';

// Simplified theme type
type theme = any;

export default function ProblemPage() {
  const { id: slug } = useParams<{ id: string }>();
  const id = slug?.split('-')[0];
  const editorRef = useRef<any>(null);
  const { colorMode } = usethemeUtils();
  const theme = getThemeColors(colorMode as 'dark' | 'light');
  const isDark = colorMode === 'dark';
  const [leftTab, setLeftTab] = useState(0);
  const [currentTab, setCurrentTab] = useState(0);
  const [language, setLanguage] = useState(() => localStorage.getItem('preferred_language') || 'python');
  const [code, setCode] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const { isFullScreenEnabled, toggleFullScreen } = useFullScreen();
  const { lastMessage, sendMessage } = useSocket();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isPlainMode, setIsPlainMode] = useState(false);
  const [isRunDialogOpen, setIsRunDialogOpen] = useState(false);

  // Snapshot websocket ticker variables
  const codeRef = useRef(code);
  const languageRef = useRef(language);
  const lastSentCodeRef = useRef('');
  const [lastSavedCode, setLastSavedCode] = useState('');
  const lastSavedCodeRef = useRef('');
  const sendMessageRef = useRef(sendMessage);

  useEffect(() => {
    sendMessageRef.current = sendMessage;
  }, [sendMessage]);

  useEffect(() => {
    lastSavedCodeRef.current = lastSavedCode;
  }, [lastSavedCode]);

  useEffect(() => {
    codeRef.current = code;
    languageRef.current = language;
  }, [code, language]);

  useEffect(() => {
    if (!id) return;
    const intervalId = setInterval(() => {
      const currentCode = codeRef.current;
      if (currentCode && currentCode !== lastSentCodeRef.current) {
        sendMessage({
          event: 'codeSnapshot.submit',
          room: `problems.${id}`,
          data: {
            problemId: id,
            language: languageRef.current,
            code: currentCode,
          }
        });
        lastSentCodeRef.current = currentCode;
      }
    }, 10000);
    return () => clearInterval(intervalId);
  }, [id, sendMessage]);

  // Handle auto-saving code after every 10 sec from the previous save
  useEffect(() => {
    if (!id) return;
    const intervalId = setInterval(() => {
      const currentCode = codeRef.current;
      const lang = languageRef.current;
      if (currentCode && currentCode !== lastSavedCodeRef.current) {
        sendMessage({
          event: 'problem.code.save',
          room: `problems.${id}`,
          data: {
            problemId: id,
            id: id,
            code: currentCode,
            langCode: lang,
          }
        });
        setLastSavedCode(currentCode);
        setHasUnsavedChanges(false);
      }
    }, 10000);
    return () => clearInterval(intervalId);
  }, [id, sendMessage]);

  // Handle real-time websocket updates from backend
  useEffect(() => {
    if (lastMessage) {
      const isCurrentProblem =
        lastMessage.room === `problem.${id}` ||
        lastMessage.room === `problems.${id}` ||
        lastMessage.room === id ||
        lastMessage.data?.problemId === id;

      if (isCurrentProblem) {
        if (lastMessage.event === 'problem.submission' || lastMessage.event === 'submission.result') {
          const payload = lastMessage.data;
          queryClient.setQueryData(['problem-submissions', id], (old: any) => {
            if (!old) return old;
            return {
              ...old,
              submissions: old.submissions?.map((sub: any) =>
                sub.id === payload?.id ? { ...sub, ...payload } : sub
              ) || [],
            };
          });
          queryClient.invalidateQueries({ queryKey: ['problem-timeline', id] });
        } else if (lastMessage.event === 'problem.snapshot') {
          queryClient.invalidateQueries({ queryKey: ['problem-timeline', id] });
        }
      }
    }
  }, [lastMessage, id, queryClient]);

  const handleSubmit = async (testCases: string[]) => {
    if (!id || !codeRef.current.trim()) return;
    setIsSubmitting(true);
    try {
      const newSubmission = await createSubmission(id, {
        problemId: id,
        language: language,
        stdin: codeRef.current,
        code: codeRef.current,
        testCases: testCases,
      } as any);

      queryClient.setQueryData(['problem-submissions', id], (old: any) => {
        if (!old) return { problem: null, submissions: [newSubmission] };
        return {
          ...old,
          submissions: [newSubmission, ...(old.submissions || [])]
        };
      });

      setCurrentTab(0); // switch to submissions tab (which is now on the right side)
      setIsRunDialogOpen(false);
    } catch (err) {
      toast.error('Failed to submit code');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const [isLeftPanelExpanded, toggleLeftPanelExpansion] = useReducer((state) => {
    if (state && editorRef.current) {
      editorRef.current.layout({});
    }
    return !state;
  }, false);

  const [isRightPanelExpanded, toggleRightPanelExpansion] = useReducer((state) => !state, false);

  const {
    shrinkLeftHandler,
    shrinkRightHandler,
    isResizeActive,
    isLeftPanelOnlyShrinked,
    isRightPanelOnlyShrinked,
    shrinkState,
  } = useShrinkState({ isLeftPanelExpanded, isRightPanelExpanded });

  const { startDragging, sizes } = useResizePanel({
    initialSize: { div1: 130, div2: 35 },
    containerRef,
    resizeHandler: (e) => {
      if (!containerRef.current) return null;
      const containerRect = containerRef.current.getBoundingClientRect();
      const percentage = ((e.clientX - containerRect.left) / containerRect.width) * 200;
      const constrainedPercentage = Math.floor(percentage);
      return { div1: constrainedPercentage, div2: Math.floor((200 - constrainedPercentage) / 2) };
    },
  });

  // Fetch problem
  const { data: problem, isLoading, isError, error } = useQuery({
    queryKey: ['problem', id],
    queryFn: () => getProblem(id!),
    enabled: !!id,
  });

  // Fetch submissions
  const { data: submissionsData } = useQuery({
    queryKey: ['problem-submissions', id],
    queryFn: () => getProblemWithSubmissions(id!),
    enabled: !!id,
  });

  // Fetch languages
  const { data: languages } = useQuery({
    queryKey: ['languages'],
    queryFn: getLanguages,
  });

  // Set default language when fetched
  useEffect(() => {
    if (languages && languages.length > 0) {
      const preferred = localStorage.getItem('preferred_language');
      const foundPref = languages.find(l => l.code === preferred);

      if (foundPref) {
        if (language !== preferred) setLanguage(foundPref.code);
      } else if (!languages.find(l => l.code === language)) {
        setLanguage(languages[0].code);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [languages]);

  // Set saved code when problem loads or language changes
  useEffect(() => {
    const loadedCode = problem?.savedCode?.[language] || '';
    setCode(loadedCode);
    setLastSavedCode(loadedCode);
    setHasUnsavedChanges(false);
  }, [problem, language]);

  // Monaco theme setup
  useEffect(() => {
    monaco.loader.init().then((monacoinstance: Monaco) => {
      monacoinstance.editor.defineTheme('mylightTheme', lighttheme as theme);
      monacoinstance.editor.defineTheme('mydarkTheme', darktheme as theme);
    });
  }, [colorMode]);

  const firstPanelTabLabels = useMemo(() => ['Code'], []);
  const secondPanelTabLabels = useMemo(() => ['Submissions', 'Description', 'Notes'], []);

  const memoizedSubmissions = useMemo(() => <ProblemSubmissions data={submissionsData?.submissions ?? []} />, [submissionsData?.submissions]);
  const memoizedDescription = useMemo(() => <ProblemDescription problem={problem ?? null} />, [problem]);
  const memoizedNotes = useMemo(() => <ProblemNotes problem={problem ?? null} />, [problem]);

  const handleTabChange = (
    _: React.SyntheticEvent,
    newValue: number,
    type: 'firstpaneltabs' | 'secondpaneltabs'
  ) => {
    if (type === 'firstpaneltabs') setLeftTab(newValue);
    else setCurrentTab(newValue);
  };

  if (isLoading) {
    return (
      <Backdrop sx={{ color: '#fff', zIndex: 9999 }} open>
        <CircularProgress sx={{ color: 'var(--cm-primary)' }} />
      </Backdrop>
    );
  }

  if (isError) {
    return (
      <Layout showFooter={false}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '80vh',
          }}
        >
          <Typography variant="h6" sx={{ color: 'var(--cm-error)', mb: 1 }}>
            Failed to load problem
          </Typography>
          <Typography variant="body2" sx={{ color: 'var(--cm-text-secondary)' }}>
            {error instanceof Error ? error.message : 'Unknown error'}
          </Typography>
        </Box>
      </Layout>
    );
  }

  const panelBorder = theme.borderSecondary;

  const middleContent = problem ? (
    <Box sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="body1" sx={{ fontWeight: 600, color: theme.textPrimary, lineHeight: 1.2 }}>
        {problem.name}
      </Typography>
      {problem.group && problem.url && (
        <a href={problem.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
          <Typography variant="caption" sx={{ color: theme.primary, '&:hover': { textDecoration: 'underline' } }}>
            {problem.group} <OpenInNewOutlinedIcon sx={{ fontSize: 10, verticalAlign: 'baseline', ml: 0.25 }} />
          </Typography>
        </a>
      )}
    </Box>
  ) : null;

  return (
    <Layout className="problem-layout" showFooter={false} headerMiddleContent={middleContent}>
      <div
        ref={containerRef}
        className={`tw-gap-0.5 tw-h-full problem-container ${isLeftPanelExpanded || isRightPanelExpanded
          ? 'expanded'
          : isLeftPanelOnlyShrinked
            ? 'leftshrinked'
            : isRightPanelOnlyShrinked
              ? 'rightshrinked'
              : ''
          }`}
        style={
          isResizeActive
            ? { gridTemplateColumns: `${getGridTemplateColumns(sizes.div1, sizes.div2)}` }
            : undefined
        }
      >
        {isResizeActive && <div onMouseDown={startDragging} className="problem-resizer"></div>}

        {/* Left sidepanel (collapsed) */}
        {isLeftPanelOnlyShrinked && (
          <div
            className="tw-flex tw-flex-col tw-justify-between tw-w-full tw-h-full tw-p-2 tw-rounded-lg panel-card"
            style={{
              display: isRightPanelExpanded ? 'none' : 'flex',
              gridColumn: getGridColumnStyles(isLeftPanelExpanded, shrinkState.shrinkrightpanel, shrinkState.shrinkleftpanel),
            }}
          >
            <CustomTabs
              tabs={firstPanelTabLabels}
              writingMode="vertical-lr"
              className={isDark ? '!tw-text-white' : ''}
              value={leftTab}
              onChange={(event: React.SyntheticEvent, value: any) => handleTabChange(event, value, 'firstpaneltabs')}
              orientation="vertical"
            />
            <IconButton
              title="Unfold"
              onClick={() => {
                editorRef.current?.layout?.(771, 436);
                shrinkLeftHandler();
              }}
              sx={{ color: theme.textSecondary }}
            >
              <ChevronRightOutlinedIcon fontSize="small" />
            </IconButton>
          </div>
        )}
        {/* First container (Left panel) */}
        <div
          className="tw-w-full tw-h-full tw-p-2 tw-rounded-lg panel-card tw-flex tw-flex-col"
          style={{
            display: isRightPanelExpanded || shrinkState.shrinkleftpanel ? 'none' : 'flex',
            gridColumn: getGridColumnStyles(isLeftPanelExpanded, shrinkState.shrinkrightpanel, shrinkState.shrinkleftpanel),
          }}
        >
          <div className="tw-h-full tw-flex tw-flex-col">
            <ProblemEditorHeader
              language={language}
              languages={languages}
              onLanguageChange={(lang) => {
                setLanguage(lang);
                localStorage.setItem('preferred_language', lang);
              }}
              isPlainMode={isPlainMode}
              onTogglePlainMode={() => setIsPlainMode(!isPlainMode)}
              hasUnsavedChanges={hasUnsavedChanges}
              onSave={() => {
                const currentCode = codeRef.current;
                sendMessage({
                  event: 'problem.code.save',
                  room: `problems.${id}`,
                  data: {
                    problemId: id,
                    id: id,
                    code: currentCode,
                    langCode: languageRef.current,
                  }
                });
                setLastSavedCode(currentCode);
                setHasUnsavedChanges(false);
              }}
              isSubmitting={isSubmitting}
              onSubmit={() => setIsRunDialogOpen(true)}
              isFullScreenEnabled={isFullScreenEnabled ?? false}
              onToggleFullScreen={toggleFullScreen}
              isLeftPanelExpanded={isLeftPanelExpanded}
              onToggleLeftPanelExpansion={toggleLeftPanelExpansion}
              shrinkLeftPanel={shrinkState.shrinkleftpanel ?? false}
              onShrinkLeftHandler={shrinkLeftHandler}
              panelBorder={panelBorder}
            />

              {/* Editor */}
              <div className="tw-flex-1 tw-min-h-0 tw-pt-1">
                <CodeEditor
                onMount={(editor, monacoInst) => {
                  editorRef.current = editor;
                  editor.addCommand(monacoInst.KeyMod.CtrlCmd | monacoInst.KeyCode.KeyS, () => {
                    const currentCode = editor.getValue();
                    if (currentCode !== lastSavedCodeRef.current) {
                      sendMessageRef.current({
                        event: 'problem.code.save',
                        room: `problems.${id}`,
                        data: {
                          problemId: id,
                          id: id,
                          code: currentCode,
                          langCode: languageRef.current,
                        }
                      });
                      setLastSavedCode(currentCode);
                      setHasUnsavedChanges(false);
                    }
                  });
                }}
                onChange={(changedcode) => {
                  if (changedcode !== undefined) {
                    codeRef.current = changedcode;
                    const isUnsaved = changedcode !== lastSavedCodeRef.current;
                    if (isUnsaved !== hasUnsavedChanges) {
                      setHasUnsavedChanges(isUnsaved);
                    }
                  }
                }}
                code={code}
                isPlainMode={isPlainMode}
                language={language === 'cpp' ? 'cpp' : language === 'csharp' ? 'csharp' : language}
                theme={colorMode === 'light' ? 'mylightTheme' : 'mydarkTheme'}
              />
              </div>
            </div>
        </div>

        {/* Right sidepanel (collapsed) */}
        {isRightPanelOnlyShrinked && (
          <div
            className="tw-p-2 tw-rounded-lg tw-h-full tw-flex tw-flex-col tw-justify-between panel-card"
            style={{
              display: isLeftPanelExpanded ? 'none' : 'flex',
              gridColumn: getGridColumnStyles(isRightPanelExpanded, shrinkState.shrinkleftpanel, shrinkState.shrinkrightpanel),
            }}
          >
            <CustomTabs
              className={isDark ? 'tw-text-white !tw-min-w-12' : '!tw-min-w-12'}
              onChange={(event: React.SyntheticEvent, value: any) => handleTabChange(event, value, 'secondpaneltabs')}
              value={currentTab}
              orientation="vertical"
              tabs={secondPanelTabLabels}
              writingMode="vertical-lr"
            />
            <IconButton onClick={shrinkRightHandler} sx={{ color: theme.textSecondary }}>
              <ChevronLeftOutlinedIcon titleAccess="Unfold" fontSize="small" />
            </IconButton>
          </div>
        )}

        {/* Second section (Right panel) */}
        <div
          className="tw-p-2 tw-rounded-lg tw-h-full tw-order-3 panel-card tw-flex tw-flex-col"
          style={{
            gridColumn: getGridColumnStyles(isRightPanelExpanded, shrinkState.shrinkleftpanel, shrinkState.shrinkrightpanel),
            display: isLeftPanelExpanded || shrinkState.shrinkrightpanel ? 'none' : 'flex',
            width: isResizeActive ? `${sizes.div2}%` : '100%',
            height: isResizeActive ? `calc(100% - 70px)` : '100%',
            position: isResizeActive ? 'absolute' : 'static',
            right: isResizeActive ? 0 : 'initial',
          }}
        >
          <div className="tw-flex tw-items-center tw-justify-between tw-shrink-0">
            <CustomTabs
              value={currentTab}
              tabs={secondPanelTabLabels}
              className={isDark ? 'tw-text-white' : ''}
              onChange={(event: React.SyntheticEvent, value: any) => handleTabChange(event, value, 'secondpaneltabs')}
            />
            <div>
              <IconButton onClick={toggleRightPanelExpansion} size="small" sx={{ color: theme.textSecondary }}>
                {!isRightPanelExpanded ? (
                  <SettingsOverscanOutlinedIcon titleAccess="Maximise" fontSize="small" />
                ) : (
                  <CloseFullscreenOutlinedIcon titleAccess="Minimise" fontSize="small" />
                )}
              </IconButton>
              {!isRightPanelExpanded && (
                <IconButton onClick={shrinkRightHandler} size="small" sx={{ color: theme.textSecondary }}>
                  {!shrinkState.shrinkrightpanel ? (
                    <ChevronRightOutlinedIcon titleAccess="Fold" fontSize="small" />
                  ) : (
                    <ChevronLeftOutlinedIcon titleAccess="UnFold" fontSize="small" />
                  )}
                </IconButton>
              )}
            </div>
          </div>

          {/* Submissions tab */}
          <CustomTabPanel wrapperClassName="tw-flex-1 tw-overflow-hidden" innerDivClassName="tw-h-full" value={currentTab} index={0}>
            {memoizedSubmissions}
          </CustomTabPanel>
          <CustomTabPanel wrapperClassName="tw-flex-1 tw-overflow-hidden" innerDivClassName="tw-h-full" value={currentTab} index={1}>
            {memoizedDescription}
          </CustomTabPanel>
          <CustomTabPanel wrapperClassName="tw-flex-1 tw-overflow-hidden" innerDivClassName="tw-h-full" value={currentTab} index={2}>
            {memoizedNotes}
          </CustomTabPanel>
        </div>
      </div>
      
      <RunTestcasesDialog
        open={isRunDialogOpen}
        onClose={() => setIsRunDialogOpen(false)}
        onSubmit={handleSubmit}
        defaultTestCases={problem?.testCases?.map((tc: any) => tc.input) || []}
        isSubmitting={isSubmitting}
      />
    </Layout>
  );
}
