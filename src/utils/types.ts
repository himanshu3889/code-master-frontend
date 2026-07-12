import { ReactNode } from 'react';

// ==================== Theme & Context ====================
export interface themeContext {
  toggleColorMode: () => void;
  colorMode: 'light' | 'dark';
}
export interface contextWrapperProps {
  children: ReactNode;
}

// ==================== Backend Model Types ====================

// 
export interface TestCase {
  input: string;
  output: string;
}

export interface IWebsocketMessage {
  event: string; // e.g. 'problem.snapshot' or 'problem.submission'
  room: string;
  data: any;
}



export enum ProblemStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  SOLVED = 'SOLVED',
  REVIEW_NEEDED = 'REVIEW_NEEDED',
  STUCK = 'STUCK',
  SKIPPED = 'SKIPPED',
  REDO_LIST = 'REDO_LIST',
  ARCHIVED = 'ARCHIVED',
}

export enum ProblemDifficultyLevel {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

export const problemStatusLabels: Record<ProblemStatus, string> = {
  [ProblemStatus.TODO]: 'Not started',
  [ProblemStatus.IN_PROGRESS]: 'Currently coding',
  [ProblemStatus.SOLVED]: 'Solved',
  [ProblemStatus.REVIEW_NEEDED]: 'Review Needed',
  [ProblemStatus.STUCK]: 'Stuck',
  [ProblemStatus.SKIPPED]: 'Skipped',
  [ProblemStatus.REDO_LIST]: 'Redo List',
  [ProblemStatus.ARCHIVED]: 'Archived',
};

export const problemStatusColors: Record<ProblemStatus, string> = {
  [ProblemStatus.TODO]: '#94a3b8',
  [ProblemStatus.IN_PROGRESS]: '#2188ff',
  [ProblemStatus.SOLVED]: '#00c853',
  [ProblemStatus.REVIEW_NEEDED]: '#ffb800',
  [ProblemStatus.STUCK]: '#ff5252',
  [ProblemStatus.SKIPPED]: '#959da5',
  [ProblemStatus.REDO_LIST]: '#ff9100',
  [ProblemStatus.ARCHIVED]: '#6a737d',
};

export const problemDifficultyLabels: Record<ProblemDifficultyLevel, string> = {
  [ProblemDifficultyLevel.EASY]: 'Easy',
  [ProblemDifficultyLevel.MEDIUM]: 'Medium',
  [ProblemDifficultyLevel.HARD]: 'Hard',
};

export const problemDifficultyColors: Record<ProblemDifficultyLevel, string> = {
  [ProblemDifficultyLevel.EASY]: '#00af9b',
  [ProblemDifficultyLevel.MEDIUM]: '#ffb800',
  [ProblemDifficultyLevel.HARD]: '#ff2d55',
};

// 
export interface Problem {
  id: string;
  name: string;
  group: string;
  description: string;
  difficultyLevel?: ProblemDifficultyLevel | string;
  rating?: number;
  timeLimit: number;
  memoryLimit: number;
  testCases: TestCase[];
  url: string;
  status: ProblemStatus | string;
  savedCode: Record<string, string> | null;
  attemptCount: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

// 
export interface Language {
  id: string;
  name: string;
  code: string;
  createdAt: string;
}

// 
export interface CodeSnapshot {
  id: string;
  problemId: string;
  language: string;
  code: string;
  createdAt: string;
}

// 
export type ExecutionStatus =
  | 'AC'
  | 'CE'
  | 'RE'
  | 'WA'
  | 'TLE'
  | 'MLE';

// 
export interface TestResult {
  testIndex: number;
  passed: boolean;
  status: ExecutionStatus;
  timeMs: number;
  memoryBytes: number;
  stderr?: string;
  stdout?: string;
}

// 
export interface Submission {
  id: string;
  problemId: string;
  interviewSessionId: string | null;
  language: string;
  status: ExecutionStatus | null;
  executionTimeMs?: number;
  memoryUsedKb?: number;
  stdin: string;
  stdout?: string;
  stderr?: string;
  testCases: string[];
  testResults: TestResult[];
  createdAt: string;
}

// 
export interface Timeline {
  id: string;
  problemId: string;
  submissionId?: string;
  codeSnapshotId?: string;
  createdAt: string;
}

// 
export interface DetailedTimeline {
  timelineId: number;
  timelineCreatedAt: string;
  codeSnapshotId?: number;
  code?: string;
  snapshotLanguage?: string;
  snapshotCreatedAt?: string;
  submissionId?: number;
  submissionStatus?: string;
  executionTimeMs?: number;
  memoryUsedKb?: number;
  stdin?: string;
  stdout?: string;
  stderr?: string;
  testCases?: TestCase[];
  testResults?: TestResult[];
  submissionCreatedAt?: string;
}


// ==================== UI Types ====================

export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  wrapperClassName?: string;
  innerDivClassName?: string;
}

export enum ShrinkActionKind {
  SHRINKLEFTPANEL = 'SHRINKLEFTPANEL',
  SHRINKRIGHTPANEL = 'SHRINKRIGHTPANEL',
  EXPANDLEFTPANEL = 'EXPANDLEFTPANEL',
  EXPANDRIGHTPANEL = 'EXPANDRIGHTPANEL',
}

export interface ShrinkAction {
  type: ShrinkActionKind;
}

export interface ShrinkState {
  shrinkrightpanel: boolean;
  shrinkleftpanel: boolean;
}

// Status display helpers
export const executionStatusLabels: Record<ExecutionStatus, string> = {
  AC: 'Accepted',
  CE: 'Compile Error',
  RE: 'Runtime Error',
  WA: 'Wrong Answer',
  TLE: 'Time Limit Exceeded',
  MLE: 'Memory Limit Exceeded',
};

export const executionStatusColors: Record<ExecutionStatus, string> = {
  AC: '#00c853',
  CE: '#ff5252',
  RE: '#ff5252',
  WA: '#ff9100',
  TLE: '#ff6d00',
  MLE: '#ff6d00',
};
